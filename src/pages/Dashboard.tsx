import React, { useState } from "react";
import { Plus, MoreHorizontal, Clock, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWorkspaces } from "../hooks/useWorkspaces";
import { type Workspace } from "../lib/workspaceService";
import CreateWorkspaceModal from "../components/CreateWorkspaceModal";
import { MeshGradient } from "@paper-design/shaders-react";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { workspaces, loading, error, setCurrentWorkspace } = useWorkspaces();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateWorkspace = () => {
    setShowCreateModal(true);
  };

  const handleOpenWorkspace = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    navigate(`/workspace/${workspace.$id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background px-12 py-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold text-white">My Workspaces</h1>
          <p className="text-sm text-white mt-1">
            Organize your todos by creating and managing workspaces
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Add New Workspace Tile */}
          <div
            onClick={handleCreateWorkspace}
            className="group relative bg-background border-2 border-dashed border-border rounded-lg p-6  transition-all duration-200 cursor-pointer min-h-[200px] flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-200">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">
              New Workspace
            </h3>
            <p className="text-sm text-white text-center">
              Create a new workspace for your todos
            </p>
          </div>

          {/* Workspace Tiles */}
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-white">Loading workspaces...</span>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <div className="text-red-400 mb-2">Error loading workspaces</div>
              <p className="text-white/70">{error}</p>
            </div>
          ) : (
            workspaces.map((workspace) => (
              <div
                key={workspace.$id}
                onClick={() => handleOpenWorkspace(workspace)}
                className="group relative bg-background border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
              >
                {/* Thumbnail Placeholder */}
                <div className="">
                  <MeshGradient
                    className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                    colors={["#000000", `${workspace.color}`]}
                    speed={0.3}
                    swirl={0.3}
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-medium text-white truncate pr-2">
                      {workspace.name}
                    </h3>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-border rounded">
                      <MoreHorizontal className="w-4 h-4 text-border" />
                    </button>
                  </div>

                  {workspace.description && (
                    <p className="text-xs text-white/70 mb-3 line-clamp-2">
                      {workspace.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {workspace.$createdAt
                          ? new Date(workspace.$createdAt).toLocaleDateString()
                          : "Recently"}
                      </span>
                    </div>
                    {workspace.isDefault && (
                      <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State for when there are no workspaces */}
        {!loading && !error && workspaces.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-border mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              No workspaces yet
            </h3>
            <p className="text-border mb-4">
              Create your first workspace to organize your todos
            </p>
            <button
              onClick={handleCreateWorkspace}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Create Workspace
            </button>
          </div>
        )}
      </div>

      {/* Create Workspace Modal */}
      <CreateWorkspaceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default Dashboard;
