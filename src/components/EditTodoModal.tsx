import React, { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import Modal from "./Modal";
import { type Todo } from "../lib/todoService";
import { useTodos } from "../hooks/useTodos";

interface EditTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo | null;
}

interface EditFormData {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
}

const EditTodoModal: React.FC<EditTodoModalProps> = ({
  isOpen,
  onClose,
  todo,
}) => {
  const { updateTodo, loading } = useTodos();
  const [formData, setFormData] = useState<EditFormData>({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });
  const [errors, setErrors] = useState<Partial<EditFormData>>({});

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description || "",
        priority: todo.priority,
        dueDate: todo.dueDate || "",
      });
      setErrors({});
    }
  }, [todo]);

  const validateForm = (): boolean => {
    const newErrors: Partial<EditFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (formData.title.trim().length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!todo || !validateForm()) return;

    try {
      await updateTodo(todo.$id!, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof EditFormData, value: string) => {
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
      title="Edit Writing Task"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className={`w-full px-3 py-2 bg-background border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
              errors.title ? "border-red-500" : "border-border"
            }`}
            placeholder="Enter task title..."
            maxLength={100}
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title}</p>
          )}
          <p className="text-white/50 text-xs mt-1">
            {formData.title.length}/100 characters
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
            maxLength={500}
          />
          {errors.description && (
            <p className="text-red-400 text-sm mt-1">{errors.description}</p>
          )}
          <p className="text-white/50 text-xs mt-1">
            {formData.description.length}/500 characters
          </p>
        </div>

        {/* Priority and Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                handleInputChange(
                  "priority",
                  e.target.value as "low" | "medium" | "high"
                )
              }
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              min={new Date().toISOString().split("T")[0]}
            />
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
            {loading ? "Saving..." : "Save Changes"}
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

export default EditTodoModal;
