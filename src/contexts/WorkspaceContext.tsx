import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type Workspace, WorkspaceService } from "../lib/workspaceService";
import { useAuth } from "../hooks/useAuth";

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  loading: boolean;
  error: string | null;
  createWorkspace: (
    workspace: Omit<Workspace, "$id" | "$createdAt" | "$updatedAt" | "userId">
  ) => Promise<void>;
  updateWorkspace: (
    workspaceId: string,
    updates: Partial<
      Omit<Workspace, "$id" | "$createdAt" | "$updatedAt" | "userId">
    >
  ) => Promise<void>;
  deleteWorkspace: (workspaceId: string) => Promise<void>;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

interface WorkspaceProviderProps {
  children: ReactNode;
}

export const WorkspaceProvider: React.FC<WorkspaceProviderProps> = ({
  children,
}) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load workspaces when user changes
  useEffect(() => {
    if (user) {
      refreshWorkspaces();
    } else {
      setWorkspaces([]);
      setCurrentWorkspace(null);
    }
  }, [user]);

  const refreshWorkspaces = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      let fetchedWorkspaces = await WorkspaceService.getWorkspaces(user.$id);

      // If no workspaces exist, create a default one
      if (fetchedWorkspaces.length === 0) {
        const defaultWorkspace = await WorkspaceService.createDefaultWorkspace(
          user.$id
        );
        fetchedWorkspaces = [defaultWorkspace];
      }

      setWorkspaces(fetchedWorkspaces);

      // Set current workspace to the first one if none is selected
      if (!currentWorkspace && fetchedWorkspaces.length > 0) {
        setCurrentWorkspace(fetchedWorkspaces[0]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load workspaces"
      );
      console.error("Error fetching workspaces:", err);
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async (
    workspaceData: Omit<
      Workspace,
      "$id" | "$createdAt" | "$updatedAt" | "userId"
    >
  ) => {
    if (!user) throw new Error("User not authenticated");

    setLoading(true);
    setError(null);

    try {
      const newWorkspace = await WorkspaceService.createWorkspace({
        ...workspaceData,
        userId: user.$id,
      });
      setWorkspaces((prev) => [newWorkspace, ...prev]);

      // Set as current workspace if it's the first one
      if (workspaces.length === 0) {
        setCurrentWorkspace(newWorkspace);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create workspace"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateWorkspace = async (
    workspaceId: string,
    updates: Partial<
      Omit<Workspace, "$id" | "$createdAt" | "$updatedAt" | "userId">
    >
  ) => {
    setLoading(true);
    setError(null);

    try {
      const updatedWorkspace = await WorkspaceService.updateWorkspace(
        workspaceId,
        updates
      );
      setWorkspaces((prev) =>
        prev.map((workspace) =>
          workspace.$id === workspaceId ? updatedWorkspace : workspace
        )
      );

      // Update current workspace if it's the one being updated
      if (currentWorkspace?.$id === workspaceId) {
        setCurrentWorkspace(updatedWorkspace);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update workspace"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkspace = async (workspaceId: string) => {
    setLoading(true);
    setError(null);

    try {
      await WorkspaceService.deleteWorkspace(workspaceId);
      setWorkspaces((prev) =>
        prev.filter((workspace) => workspace.$id !== workspaceId)
      );

      // If the deleted workspace was current, set to the first available workspace
      if (currentWorkspace?.$id === workspaceId) {
        const remainingWorkspaces = workspaces.filter(
          (w) => w.$id !== workspaceId
        );
        setCurrentWorkspace(
          remainingWorkspaces.length > 0 ? remainingWorkspaces[0] : null
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete workspace"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: WorkspaceContextType = {
    workspaces,
    currentWorkspace,
    loading,
    error,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    setCurrentWorkspace,
    refreshWorkspaces,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export { WorkspaceContext };
