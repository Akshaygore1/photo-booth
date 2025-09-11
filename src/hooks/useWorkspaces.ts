import { useContext } from "react";
import { WorkspaceContext } from "../contexts/WorkspaceContext";

export const useWorkspaces = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspaces must be used within a WorkspaceProvider");
  }
  return context;
};
