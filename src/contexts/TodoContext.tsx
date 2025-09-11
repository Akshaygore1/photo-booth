import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type Todo, TodoService } from "../lib/todoService";
import { useAuth } from "../hooks/useAuth";
import { useWorkspaces } from "../hooks/useWorkspaces";

interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  createTodo: (
    todo: Omit<
      Todo,
      "$id" | "$createdAt" | "$updatedAt" | "userId" | "workspaceId"
    >
  ) => Promise<void>;
  updateTodo: (
    todoId: string,
    updates: Partial<
      Omit<Todo, "$id" | "$createdAt" | "$updatedAt" | "userId" | "workspaceId">
    >
  ) => Promise<void>;
  deleteTodo: (todoId: string) => Promise<void>;
  toggleTodo: (todoId: string, completed: boolean) => Promise<void>;
  refreshTodos: () => Promise<void>;
  filterTodos: (
    filter: "all" | "completed" | "pending" | "high" | "medium" | "low"
  ) => Todo[];
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspaces();

  // Load todos when user or workspace changes
  useEffect(() => {
    if (user && currentWorkspace) {
      refreshTodos();
    } else {
      setTodos([]);
    }
  }, [user, currentWorkspace]);

  const refreshTodos = async () => {
    if (!user || !currentWorkspace) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedTodos = await TodoService.getTodos(
        user.$id,
        currentWorkspace.$id!
      );
      setTodos(fetchedTodos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load todos");
      console.error("Error fetching todos:", err);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (
    todoData: Omit<
      Todo,
      "$id" | "$createdAt" | "$updatedAt" | "userId" | "workspaceId"
    >
  ) => {
    if (!user || !currentWorkspace)
      throw new Error("User not authenticated or no workspace selected");

    setLoading(true);
    setError(null);

    try {
      const newTodo = await TodoService.createTodo({
        ...todoData,
        userId: user.$id,
        workspaceId: currentWorkspace.$id!,
      });
      setTodos((prev) => [newTodo, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create todo");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (
    todoId: string,
    updates: Partial<
      Omit<Todo, "$id" | "$createdAt" | "$updatedAt" | "userId" | "workspaceId">
    >
  ) => {
    setLoading(true);
    setError(null);

    try {
      const updatedTodo = await TodoService.updateTodo(todoId, updates);
      setTodos((prev) =>
        prev.map((todo) => (todo.$id === todoId ? updatedTodo : todo))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update todo");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (todoId: string) => {
    setLoading(true);
    setError(null);

    try {
      await TodoService.deleteTodo(todoId);
      setTodos((prev) => prev.filter((todo) => todo.$id !== todoId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete todo");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (todoId: string, completed: boolean) => {
    setLoading(true);
    setError(null);

    try {
      const updatedTodo = await TodoService.toggleTodo(todoId, completed);
      setTodos((prev) =>
        prev.map((todo) => (todo.$id === todoId ? updatedTodo : todo))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle todo");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const filterTodos = (
    filter: "all" | "completed" | "pending" | "high" | "medium" | "low"
  ) => {
    switch (filter) {
      case "completed":
        return todos.filter((todo) => todo.completed);
      case "pending":
        return todos.filter((todo) => !todo.completed);
      case "high":
      case "medium":
      case "low":
        return todos.filter((todo) => todo.priority === filter);
      default:
        return todos;
    }
  };

  const value: TodoContextType = {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    refreshTodos,
    filterTodos,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export { TodoContext };
