import React from "react";
import { Plus, FileText, MoreHorizontal, Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MeshGradient } from "@paper-design/shaders-react";

interface Document {
  id: string;
  title: string;
  lastModified: string;
  thumbnail?: string;
  collaborators?: number;
}

// Mock data for demonstration
const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Project Planning",
    lastModified: "2 hours ago",
    collaborators: 3,
  },
  {
    id: "2",
    title: "Design System",
    lastModified: "1 day ago",
    collaborators: 5,
  },
  {
    id: "3",
    title: "Meeting Notes",
    lastModified: "3 days ago",
    collaborators: 2,
  },
  {
    id: "4",
    title: "Product Roadmap",
    lastModified: "1 week ago",
    collaborators: 8,
  },
  {
    id: "5",
    title: "User Research",
    lastModified: "2 weeks ago",
    collaborators: 4,
  },
  {
    id: "6",
    title: "Marketing Strategy",
    lastModified: "3 weeks ago",
    collaborators: 6,
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateDocument = () => {
    const newDocId = Date.now().toString();
    navigate(`/dashboard/${newDocId}`);
  };

  const handleOpenDocument = (docId: string) => {
    navigate(`/dashboard/${docId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background px-12 py-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold text-white">My Documents</h1>
          <p className="text-sm text-white mt-1">
            Create and collaborate on your projects
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Add New Document Tile */}
          <div
            onClick={handleCreateDocument}
            className="group relative bg-background border-2 border-dashed border-border rounded-lg p-6  transition-all duration-200 cursor-pointer min-h-[200px] flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-200">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">
              New Document
            </h3>
            <p className="text-sm text-white text-center">
              Start a new project
            </p>
          </div>

          {/* Document Tiles */}
          {mockDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleOpenDocument(doc.id)}
              className="group relative bg-background border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
            >
              {/* Thumbnail Placeholder */}
              <div className="">
                <MeshGradient
                  className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                  colors={["#2c2c30", "#bf0d51", "#f02d65"]}
                  speed={0.3}
                  swirl={0.3}
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-medium text-white truncate pr-2">
                    {doc.title}
                  </h3>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-border rounded">
                    <MoreHorizontal className="w-4 h-4 text-border" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{doc.lastModified}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State for when there are no documents */}
        {mockDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-border mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No documents yet
            </h3>
            <p className="text-border">
              Create your first document to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
