import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get all todos
export const getTodos = async () => {
  try {
    const response = await axios.get(`${API_URL}/todos`);
    console.log('getTodos response:', response.data);
    return response.data.data || [];
  } catch (error) {
    console.error('getTodos error:', error);
    throw error;
  }
};

// Create new todo
export const createTodo = async (todo) => {
  try {
    const response = await axios.post(`${API_URL}/todos`, { todo });
    console.log('createTodo response:', response.data);
    return response.data.data || {};
  } catch (error) {
    console.error('createTodo error:', error);
    throw error;
  }
};

// Update todo
export const updateTodo = async (id, todo) => {
  try {
    const response = await axios.put(`${API_URL}/todos/${id}`, { todo });
    console.log('updateTodo response:', response.data);
    return response.data.data || {};
  } catch (error) {
    console.error('updateTodo error:', error);
    throw error;
  }
};

// Delete todo
export const deleteTodo = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/todos/${id}`);
    console.log('deleteTodo response:', response.data);
    return response.data;
  } catch (error) {
    console.error('deleteTodo error:', error);
    throw error;
  }
};

// Toggle complete status
export const toggleStatus = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/todos/${id}/toggle`);
    console.log('toggleStatus response:', response.data);
    return response.data.data || {};
  } catch (error) {
    console.error('toggleStatus error:', error);
    throw error;
  }
};

// Search todos
export const searchTodos = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/todos/search`, {
      params: { query }
    });
    console.log('searchTodos response:', response.data);
    return response.data.data || [];
  } catch (error) {
    console.error('searchTodos error:', error);
    throw error;
  }
};