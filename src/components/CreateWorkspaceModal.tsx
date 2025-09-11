import React, { useState } from "react";
import { Save, X, Palette } from "lucide-react";
import Modal from "./Modal";
import { WorkspaceService } from "../lib/workspaceService";
import { useWorkspaces } from "../hooks/useWorkspaces";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WorkspaceFormData {
  name: string;
  description: string;
  color: string;
}

const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createWorkspace, loading } = useWorkspaces();
  const [formData, setFormData] = useState<WorkspaceFormData>({
    name: "",
    description: "",
    color: "#3B82F6",
  });
  const [errors, setErrors] = useState<Partial<WorkspaceFormData>>({});

  const colors = WorkspaceService.getWorkspaceColors();

  const validateForm = (): boolean => {
    const newErrors: Partial<WorkspaceFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Workspace name is required";
    }

    if (formData.name.trim().length > 50) {
      newErrors.name = "Workspace name must be less than 50 characters";
    }

    if (formData.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createWorkspace({
        name: formData.name.trim(),
        description: formData.description.trim(),
        color: formData.color,
      });
      handleClose();
    } catch (error) {
      console.error("Error creating workspace:", error);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", description: "", color: "#3B82F6" });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof WorkspaceFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Workspace"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Workspace Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`w-full px-3 py-2 bg-background border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
              errors.name ? "border-red-500" : "border-border"
            }`}
            placeholder="Enter workspace name..."
            maxLength={50}
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name}</p>
          )}
          <p className="text-white/50 text-xs mt-1">
            {formData.name.length}/50 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 bg-background border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none ${
              errors.description ? "border-red-500" : "border-border"
            }`}
            placeholder="Enter description (optional)..."
            maxLength={200}
          />
          {errors.description && (
            <p className="text-red-400 text-sm mt-1">{errors.description}</p>
          )}
          <p className="text-white/50 text-xs mt-1">
            {formData.description.length}/200 characters
          </p>
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            <Palette className="inline w-4 h-4 mr-1" />
            Color Theme
          </label>
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleInputChange("color", color)}
                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                  formData.color === color
                    ? "border-white scale-110"
                    : "border-white/20 hover:border-white/50"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {loading ? "Creating..." : "Create Workspace"}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateWorkspaceModal;
