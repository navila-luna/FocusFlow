import { useState } from "react";
import "./schedule.css"; 

function TaskForm({ addTask, clearAllTasks }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (name.trim() !== "") {
      addTask(name, description);
      setName("");
      setDescription("");
    }
  };

  return (
    <div className="task-form">
      <input
        type="text"
        placeholder="Task name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="task-input"
      />
      <textarea
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="task-textarea"
      />
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start' }}>
        <button onClick={handleSubmit} className="task-button">
          Add Task
        </button>
        <button onClick={clearAllTasks} className="task-button" style={{ backgroundColor: '#dc3545' }}>
          Clear All Tasks
        </button>
      </div>
    </div>
  );
}

export default TaskForm;
