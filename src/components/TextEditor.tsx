import React, { useState } from "react";
import { Save, MoreHorizontal, ArrowLeft, Clock, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "./Editor";

const TextEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
    console.log("saved");
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const documentTitle = `Document ${id || "Untitled"}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Back button and title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-border rounded-lg transition-colors duration-200"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">
                    {documentTitle}
                  </h1>
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Edited 2 minutes ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {isSaving ? "Saving..." : "Save"}
                </span>
              </button>

              <button
                className="p-2 hover:bg-border rounded-lg transition-colors duration-200"
                title="More options"
              >
                <MoreHorizontal className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="max-w-6xl mx-auto px-6 py-2">
        <Editor />
      </div>
    </div>
  );
};

export default TextEditor;
