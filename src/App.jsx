import { useBoard } from "./boardStore";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

const columns = [
  { id: "todo", label: "To Do" },
  { id: "doing", label: "In Progress" },
  { id: "done", label: "Done" }
];

export default function App() {
  const {
    user,
    login,
    tasks,
    addTask,
    removeTask,
    moveTask
  } = useBoard();

  const [input, setInput] = useState("");

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { draggableId, destination, source } = result;

    if (source.droppableId !== destination.droppableId) {
      moveTask(draggableId, destination.droppableId);
    }
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const name = e.target.username.value.trim();
            if (name) login(name);
          }}
          className="bg-white p-6 rounded shadow w-80"
        >
          <h1 className="text-xl font-bold mb-4 text-center">
            Simple Kanban
          </h1>

          <input
            name="username"
            placeholder="Enter username"
            className="border w-full p-2 mb-3 rounded"
          />

          <button className="bg-blue-600 text-white w-full p-2 rounded">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" />

      <div className="flex justify-between mb-6">
        <h2 className="font-semibold">Welcome, {user}</h2>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="New task"
            className="border p-2 rounded"
          />

          <button
            onClick={() => {
              if (input.trim()) {
                addTask(input);
                setInput("");
              }
            }}
            className="bg-blue-600 text-white px-4 rounded"
          >
            Add
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid md:grid-cols-3 gap-4">
          {columns.map((column) => (
            <Droppable droppableId={column.id} key={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white p-4 rounded shadow min-h-[300px]"
                >
                  <h3 className="font-bold mb-3">
                    {column.label}
                  </h3>

                  {tasks
                    .filter(task => task.status === column.id)
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-gray-100 p-2 rounded mb-2 flex justify-between items-center"
                          >
                            <span>{task.text}</span>

                            <button
                              onClick={() => removeTask(task.id)}
                              className="text-red-500 text-sm"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
