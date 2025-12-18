"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Trash2, Edit2, Check, X } from "lucide-react"

// Interface to define the structure of a task
interface Todo {
  id: string
  text: string
  completed: boolean
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos")
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos))
    }
  }, [])

  // Save tasks to localStorage on every change
  useEffect(() => {
    if (todos.length > 0 || localStorage.getItem("todos")) {
      localStorage.setItem("todos", JSON.stringify(todos))
    }
  }, [todos])

  // Add a new task
  const addTodo = () => {
    if (inputValue.trim() === "") return

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputValue,
      completed: false,
    }

    setTodos([...todos, newTodo])
    setInputValue("")
  }

  // Delete a task
  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  // Toggle task completion status
  const toggleComplete = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  // Start editing a task
  const startEdit = (id: string, text: string) => {
    setEditingId(id)
    setEditValue(text)
  }

  // Save task edits
  const saveEdit = () => {
    if (editValue.trim() === "") return

    setTodos(todos.map((todo) => (todo.id === editingId ? { ...todo, text: editValue } : todo)))
    setEditingId(null)
    setEditValue("")
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null)
    setEditValue("")
  }

  // Handle Enter key to add a task
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo()
    }
  }

  // Handle Enter key to save edit
  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit()
    } else if (e.key === "Escape") {
      cancelEdit()
    }
  }

  return (
    <Card className="p-6 bg-white shadow-xl">
      {/* Task addition section */}
      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={addTodo} className="bg-blue-600 hover:bg-blue-700">
          Add
        </Button>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No tasks yet. Add one to get started!</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* Checkbox to mark as completed */}
              <button
                onClick={() => toggleComplete(todo.id)}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  todo.completed ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-green-500"
                }`}
              >
                {todo.completed && <Check className="w-4 h-4 text-white" />}
              </button>

              {/* Task text or edit field */}
              {editingId === todo.id ? (
                <Input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleEditKeyPress}
                  className="flex-1"
                  autoFocus
                />
              ) : (
                <span className={`flex-1 ${todo.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                  {todo.text}
                </span>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                {editingId === todo.id ? (
                  <>
                    <Button onClick={saveEdit} size="sm" className="bg-green-600 hover:bg-green-700">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button onClick={cancelEdit} size="sm" variant="outline">
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => startEdit(todo.id, todo.text)} size="sm" variant="outline">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deleteTodo(todo.id)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistics */}
      {todos.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-600 text-center">
          {todos.filter((todo) => todo.completed).length} / {todos.length} tasks completed
        </div>
      )}
    </Card>
  )
}
