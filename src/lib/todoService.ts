import { databases } from "./appwrite";
import { ID, Query } from "appwrite";

// Database and Collection Configuration
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "todo_db";
const COLLECTION_ID =
  import.meta.env.VITE_APPWRITE_TODO_COLLECTION_ID || "todos";

export interface Todo {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  userId: string;
  workspaceId: string;
}

export class TodoService {
  // Create a new todo
  static async createTodo(
    todo: Omit<Todo, "$id" | "$createdAt" | "$updatedAt">
  ): Promise<Todo> {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        todo
      );
      return response as unknown as Todo;
    } catch (error) {
      console.error("Failed to create todo:", error);
      throw error;
    }
  }

  // Get all todos for a user
  static async getTodos(userId: string, workspaceId: string): Promise<Todo[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal("userId", userId),
          Query.equal("workspaceId", workspaceId),
          Query.orderDesc("$createdAt"),
          Query.limit(100),
        ]
      );
      return response.documents as unknown as Todo[];
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      throw error;
    }
  }

  // Update a todo
  static async updateTodo(
    todoId: string,
    updates: Partial<Omit<Todo, "$id" | "$createdAt" | "$updatedAt" | "userId">>
  ): Promise<Todo> {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        todoId,
        updates
      );
      return response as unknown as Todo;
    } catch (error) {
      console.error("Failed to update todo:", error);
      throw error;
    }
  }

  // Delete a todo
  static async deleteTodo(todoId: string): Promise<void> {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, todoId);
    } catch (error) {
      console.error("Failed to delete todo:", error);
      throw error;
    }
  }

  // Toggle todo completion status
  static async toggleTodo(todoId: string, completed: boolean): Promise<Todo> {
    return this.updateTodo(todoId, { completed });
  }

  // Get todos by completion status
  static async getTodosByStatus(
    userId: string,
    workspaceId: string,
    completed: boolean
  ): Promise<Todo[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal("userId", userId),
          Query.equal("workspaceId", workspaceId),
          Query.equal("completed", completed),
          Query.orderDesc("$createdAt"),
        ]
      );
      return response.documents as unknown as Todo[];
    } catch (error) {
      console.error("Failed to fetch todos by status:", error);
      throw error;
    }
  }

  // Get todos by priority
  static async getTodosByPriority(
    userId: string,
    workspaceId: string,
    priority: Todo["priority"]
  ): Promise<Todo[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal("userId", userId),
          Query.equal("workspaceId", workspaceId),
          Query.equal("priority", priority),
          Query.orderDesc("$createdAt"),
        ]
      );
      return response.documents as unknown as Todo[];
    } catch (error) {
      console.error("Failed to fetch todos by priority:", error);
      throw error;
    }
  }
}
