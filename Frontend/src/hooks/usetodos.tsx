import { useEffect, useState } from "react";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  updateStatus,
} from "../services/api";
import { Todo } from "../types";

export const useTodos = (token: string) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTodos = async () => {
    setLoading(true);
    try {
      const res = await fetchTodos(token);
      setTodos(res.data);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (data: any) => {
    await createTodo(data, token);
    await loadTodos();
  };

  const editTodo = async (id: number, data: any) => {
    await updateTodo(id, data, token);
    await loadTodos();
  };

  const removeTodo = async (id: number) => {
    await deleteTodo(id, token);
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const toggleStatus = async (id: number, status: boolean) => {
    await updateStatus(id, status, token);
    await loadTodos();
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return {
    todos,
    loading,
    addTodo,
    editTodo,
    removeTodo,
    toggleStatus,
  };
};
