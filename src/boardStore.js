import { create } from "zustand";
import toast from "react-hot-toast";
import { createTask, updateTask, deleteTask } from "./fakeServer";

export const useBoard = create((set, get) => ({
  user: localStorage.getItem("kanban_user") || null,
  tasks: [],

  login: (name) => {
    localStorage.setItem("kanban_user", name);
    set({ user: name });
  },

  addTask: async (text) => {
    const previous = [...get().tasks];

    const newTask = {
      id: Date.now().toString(),
      text,
      status: "todo"
    };

    // Optimistic update
    set({ tasks: [...previous, newTask] });

    try {
      await createTask(newTask);
    } catch (err) {
      set({ tasks: previous });
      toast.error("Failed to add task");
    }
  },

  moveTask: async (id, newStatus) => {
    const previous = [...get().tasks];

    const updated = previous.map(task =>
      task.id === id ? { ...task, status: newStatus } : task
    );

    set({ tasks: updated });

    try {
      await updateTask();
    } catch (err) {
      set({ tasks: previous });
      toast.error("Move failed");
    }
  },

  removeTask: async (id) => {
    const previous = [...get().tasks];

    set({ tasks: previous.filter(task => task.id !== id) });

    try {
      await deleteTask();
    } catch (err) {
      set({ tasks: previous });
      toast.error("Delete failed");
    }
  }
}));
