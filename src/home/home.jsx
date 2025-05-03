import React, { useState, useEffect } from "react";
import axiosInstance from "../expirychecker/expirychecker"; // Custom axios
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch all todos on mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:5004/todos/gettodos", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTodos(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching todos:", error);
        setMessage("Failed to fetch todos. Please try again.");
      }
    };

    fetchTodos();
  }, []);

  // Add a new todo
  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const response = await axiosInstance.post(
        "http://localhost:5004/todos/createtodos",
        { title: newTodo },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTodos([...todos, response.data.data]);
      setNewTodo("");
      setMessage("Todo added successfully!");
    } catch (error) {
      console.error("Error adding todo:", error);
      setMessage("Failed to add todo. Please try again.");
    }
  };

  // Update todo title
  const updateTodo = async (id, updatedTitle) => {
    try {
      const response = await axiosInstance.put(
        `http://localhost:5004/todos/updatetodos/${id}`,
        { title: updatedTitle },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTodos(todos.map((todo) => (todo._id === id ? response.data.data : todo)));
      setMessage("Todo updated successfully!");
    } catch (error) {
      console.error("Error updating todo:", error);
      setMessage("Failed to update todo. Please try again.");
    }
  };

  // Delete single todo
  const deleteTodo = async (id) => {
    try {
      await axiosInstance.delete(`http://localhost:5004/todos/deletetodos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setTodos(todos.filter((todo) => todo._id !== id));
      setMessage("Todo deleted successfully!");
    } catch (error) {
      console.error("Error deleting todo:", error);
      setMessage("Failed to delete todo. Please try again.");
    }
  };

  // Delete all todos
  const deleteAllTodos = async () => {
    try {
      await axiosInstance.delete("http://localhost:5004/todos/deletealltodos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setTodos([]);
      setMessage("All todos deleted successfully!");
    } catch (error) {
      console.error("Error deleting all todos:", error);
      setMessage("Failed to delete all todos. Please try again.");
    }
  };

  // Logout
  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Todo Manager</h1>

      {message && (
        <p
          className={`mb-4 ${
            message.includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      {/* Input Field */}
      <div className="flex items-center mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a new todo"
          className="border p-2 rounded-l w-64"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Add Todo
        </button>
      </div>

      {/* Todo List */}
      <div className="w-full max-w-md bg-white p-4 rounded shadow">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <div
              key={todo._id}
              className="flex justify-between items-center border-b py-2"
            >
              <input
                type="text"
                value={todo.title}
                onChange={(e) => updateTodo(todo._id, e.target.value)}
                className="border p-2 rounded w-3/4"
              />
              <button
                onClick={() => deleteTodo(todo._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No todos found.</p>
        )}
      </div>

      {/* Delete All Todos */}
      {todos.length > 0 && (
        <button
          onClick={deleteAllTodos}
          className="mt-6 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
        >
          Delete All Todos
        </button>
      )}

      {/* Logout */}
      <button
        onClick={logOut}
        className="mt-6 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
      >
        Logout
      </button>
    </div>
  );
}
