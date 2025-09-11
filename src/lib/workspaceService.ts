import { databases } from "./appwrite";
import { ID, Query } from "appwrite";

// Database and Collection Configuration
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "todo_db";
const WORKSPACES_COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_WORKSPACES_COLLECTION_ID || "workspaces";

export interface Workspace {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  name: string;
  description?: string;
  color: string;
  userId: string;
  isDefault?: boolean;
}

export class WorkspaceService {
  // Create a new workspace
  static async createWorkspace(
    workspace: Omit<Workspace, "$id" | "$createdAt" | "$updatedAt">
  ): Promise<Workspace> {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_COLLECTION_ID,
        ID.unique(),
        workspace
      );
      return response as unknown as Workspace;
    } catch (error) {
      console.error("Failed to create workspace:", error);
      throw error;
    }
  }

  // Get all workspaces for a user
  static async getWorkspaces(userId: string): Promise<Workspace[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        WORKSPACES_COLLECTION_ID,
        [
          Query.equal("userId", userId),
          Query.orderDesc("$createdAt"),
          Query.limit(50),
        ]
      );
      return response.documents as unknown as Workspace[];
    } catch (error) {
      console.error("Failed to fetch workspaces:", error);
      throw error;
    }
  }

  // Update a workspace
  static async updateWorkspace(
    workspaceId: string,
    updates: Partial<
      Omit<Workspace, "$id" | "$createdAt" | "$updatedAt" | "userId">
    >
  ): Promise<Workspace> {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_COLLECTION_ID,
        workspaceId,
        updates
      );
      return response as unknown as Workspace;
    } catch (error) {
      console.error("Failed to update workspace:", error);
      throw error;
    }
  }

  // Delete a workspace
  static async deleteWorkspace(workspaceId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        WORKSPACES_COLLECTION_ID,
        workspaceId
      );
    } catch (error) {
      console.error("Failed to delete workspace:", error);
      throw error;
    }
  }

  // Get workspace by ID
  static async getWorkspace(workspaceId: string): Promise<Workspace> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        WORKSPACES_COLLECTION_ID,
        workspaceId
      );
      return response as unknown as Workspace;
    } catch (error) {
      console.error("Failed to fetch workspace:", error);
      throw error;
    }
  }

  // Create default workspace for new user
  static async createDefaultWorkspace(userId: string): Promise<Workspace> {
    return this.createWorkspace({
      name: "Personal Workspace",
      description: "Your default workspace for personal tasks",
      color: "#3B82F6", // Blue color
      userId,
      isDefault: true,
    });
  }

  // Get workspace colors
  static getWorkspaceColors(): string[] {
    return [
      "#3B82F6", // Blue
      "#10B981", // Green
      "#F59E0B", // Yellow
      "#EF4444", // Red
      "#8B5CF6", // Purple
      "#06B6D4", // Cyan
      "#F97316", // Orange
      "#84CC16", // Lime
      "#EC4899", // Pink
      "#6B7280", // Gray
    ];
  }
}
