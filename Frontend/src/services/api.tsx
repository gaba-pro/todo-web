import axios from "axios";

const API_BASE = "http://localhost:8080/api";

export const fetchTodos = (token: string) =>
  axios.get(`${API_BASE}/todos`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const fetchUsers = (token: string) =>
  axios.get(`${API_BASE}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createTodo = (data: any, token: string) =>
  axios.post(`${API_BASE}/todos`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateTodo = (id: number, data: any, token: string) =>
  axios.put(`${API_BASE}/todos/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteTodo = (id: number, token: string) =>
  axios.delete(`${API_BASE}/todos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateStatus = (id: number, status: boolean, token: string) =>
  axios.put(
    `${API_BASE}/todos/${id}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
