import { useState, useEffect } from 'react';
import * as api from './api';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Retrieve list of tasks
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await api.getTodos();
      console.log('Fetched todos:', response);
      // Handle both response.data and response directly
      setTodos(Array.isArray(response) ? response : (response?.data || []));
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch todos');
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  // Create new task
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      setLoading(true);
      const response = await api.createTodo(input);
      console.log('Created todo:', response);
      const newTodo = Array.isArray(response) ? response[0] : response;
      setTodos([newTodo, ...todos]);
      setInput('');
      setError('');
    } catch (err) {
      console.error('Create error:', err);
      setError('Failed to create todo');
    } finally {
      setLoading(false);
    }
  };

  // Update task details
  const handleUpdate = async (id) => {
    if (!editText.trim()) return;

    try {
      setLoading(true);
      const response = await api.updateTodo(id, editText);
      console.log('Updated todo:', response);
      const updatedTodo = Array.isArray(response) ? response[0] : response;
      setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
      setEditId(null);
      setEditText('');
      setError('');
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await api.deleteTodo(id);
      setTodos(todos.filter(todo => todo._id !== id));
      setError('');
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete todo');
    } finally {
      setLoading(false);
    }
  };

  // Update status
  const handleToggleStatus = async (id) => {
    try {
      const response = await api.toggleStatus(id);
      console.log('Toggled todo:', response);
      const updatedTodo = Array.isArray(response) ? response[0] : response;
      setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
      setError('');
    } catch (err) {
      console.error('Toggle error:', err);
      setError('Failed to toggle status');
    }
  };

  // Search tasks
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      fetchTodos();
      return;
    }

    try {
      setLoading(true);
      const response = await api.searchTodos(query);
      console.log('Search results:', response);
      setTodos(Array.isArray(response) ? response : (response?.data || []));
      setError('');
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search todos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Todo List</h1>

      {/* Error message */}
      {error && <div className="error">{error}</div>}

      {/* Create new task */}
      <form onSubmit={handleCreate}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add new todo"
        />
        <button type="submit" disabled={loading}>
          Add
        </button>
      </form>

      {/* Search tasks */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search todos"
        className="search"
      />

      {/* Loading indicator */}
      {loading && <div className="loading">Loading...</div>}

      {/* List of tasks */}
      <div className="todo-list">
        {todos && todos.length > 0 ? (
          todos.map((todo) => (
            <div key={todo._id} className="todo-item">
              {/* Update status - checkbox */}
              <input
                type="checkbox"
                checked={todo.completed || false}
                onChange={() => handleToggleStatus(todo._id)}
              />

              {/* Update task details - inline edit */}
              {editId === todo._id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => handleUpdate(todo._id)}>Save</button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span className={todo.completed ? 'completed' : ''}>
                    {todo.todo}
                  </span>
                  <button onClick={() => {
                    setEditId(todo._id);
                    setEditText(todo.todo);
                  }}>
                    Edit
                  </button>
                  {/* Delete task */}
                  <button onClick={() => handleDelete(todo._id)}>Delete</button>
                </>
              )}
            </div>
          ))
        ) : (
          !loading && <div className="empty">No todos found</div>
        )}
      </div>
    </div>
  );
}

export default App;