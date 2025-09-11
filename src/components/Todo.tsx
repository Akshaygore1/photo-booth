import React, { useState } from "react";
import {
  Plus,
  Search,
  Calendar,
  Clock,
  Trash2,
  Edit3,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useTodos } from "../hooks/useTodos";
import { type Todo as TodoType } from "../lib/todoService";
import EditTodoModal from "./EditTodoModal";

interface TodoFormData {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
}

const Todo: React.FC = () => {
  const {
    todos,
    loading,
    error,
    createTodo,
    deleteTodo,
    toggleTodo,
    filterTodos,
  } = useTodos();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoType | null>(null);
  const [filter, setFilter] = useState<
    "all" | "completed" | "pending" | "high" | "medium" | "low"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<TodoFormData>({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });

  const filteredTodos = filterTodos(filter).filter(
    (todo) =>
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (todo.description &&
        todo.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      await createTodo({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
        completed: false,
      });
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const handleEditTodo = (todo: TodoType) => {
    setEditingTodo(todo);
  };

  const handleCloseEditModal = () => {
    setEditingTodo(null);
  };

  const handleToggle = async (todoId: string, completed: boolean) => {
    try {
      await toggleTodo(todoId, !completed);
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const handleDelete = async (todoId: string) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      try {
        await deleteTodo(todoId);
      } catch (error) {
        console.error("Error deleting todo:", error);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && dueDate;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background px-6 py-6 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                My Writing Tasks
              </h1>
              <p className="text-white/70 mt-1">
                Capture ideas, organize thoughts, and track your creative
                progress
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add Writing Task
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"
                size={20}
              />
              <input
                type="text"
                placeholder="Search your writing tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={filter}
              onChange={(e) =>
                setFilter(
                  e.target.value as
                    | "all"
                    | "completed"
                    | "pending"
                    | "high"
                    | "medium"
                    | "low"
                )
              }
              className="px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Add Todo Form */}
        {showAddForm && (
          <div className="bg-background border border-border rounded-lg p-6 mb-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter task title..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter description (optional)..."
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          priority: e.target.value as "low" | "medium" | "high",
                        })
                      }
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Check size={16} />
                  {loading ? "Creating..." : "Create Task"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({
                      title: "",
                      description: "",
                      priority: "medium",
                      dueDate: "",
                    });
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-white/70 mt-2">Loading tasks...</p>
          </div>
        )}

        {/* Todo List */}
        {!loading && (
          <div className="space-y-4">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12">
                <Circle className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  {searchTerm || filter !== "all"
                    ? "No matching tasks"
                    : "No writing tasks yet"}
                </h3>
                <p className="text-white/70">
                  {searchTerm || filter !== "all"
                    ? "Try adjusting your search or filter"
                    : "Create your first writing task to get started"}
                </p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo.$id}
                  className={`bg-background border rounded-lg p-4 transition-all duration-200 ${
                    todo.completed
                      ? "border-green-500/30 bg-green-900/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggle(todo.$id!, todo.completed)}
                      className="mt-1 flex-shrink-0"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-white/50 hover:text-white" />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3
                            className={`font-medium ${
                              todo.completed
                                ? "text-white/70 line-through"
                                : "text-white"
                            }`}
                          >
                            {todo.title}
                          </h3>
                          {todo.description && (
                            <p
                              className={`text-sm mt-1 ${
                                todo.completed
                                  ? "text-white/50 line-through"
                                  : "text-white/70"
                              }`}
                            >
                              {todo.description}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditTodo(todo)}
                            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors"
                            title="Edit task"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(todo.$id!)}
                            className="p-2 text-white/50 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Meta Information */}
                      <div className="flex items-center gap-4 mt-3 text-xs text-white/50">
                        {/* Priority */}
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${getPriorityColor(
                              todo.priority
                            )}`}
                          ></div>
                          <span className="capitalize">{todo.priority}</span>
                        </div>

                        {/* Due Date */}
                        {todo.dueDate && (
                          <div
                            className={`flex items-center gap-1 ${
                              isOverdue(todo.dueDate) && !todo.completed
                                ? "text-red-400"
                                : ""
                            }`}
                          >
                            <Calendar size={12} />
                            <span>{formatDate(todo.dueDate)}</span>
                            {isOverdue(todo.dueDate) && !todo.completed && (
                              <span className="text-red-400">(Overdue)</span>
                            )}
                          </div>
                        )}

                        {/* Created Date */}
                        {todo.$createdAt && (
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>Created {formatDate(todo.$createdAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Statistics */}
        {!loading && todos.length > 0 && (
          <div className="mt-8 bg-background border border-border rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-3">Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">
                  {todos.length}
                </div>
                <div className="text-sm text-white/70">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {todos.filter((t) => t.completed).length}
                </div>
                <div className="text-sm text-white/70">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">
                  {todos.filter((t) => !t.completed).length}
                </div>
                <div className="text-sm text-white/70">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {
                    todos.filter(
                      (t) => t.dueDate && isOverdue(t.dueDate) && !t.completed
                    ).length
                  }
                </div>
                <div className="text-sm text-white/70">Overdue</div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Todo Modal */}
        <EditTodoModal
          isOpen={!!editingTodo}
          onClose={handleCloseEditModal}
          todo={editingTodo}
        />
      </div>
    </div>
  );
};

export default Todo;
