import TaskFeatures from "./TaskFeatures";
import "./schedule.css";

function Subtask({ subtask, subIndex, parentIndex, updateSubStatus, updateBlockers, toggleSubComplete }) {
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    updateSubStatus(parentIndex, subIndex, newStatus);
    toggleSubComplete(parentIndex, subIndex, newStatus === "Done");
  };

  <input
  type="text"
  placeholder="Task name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="task-input" 
/>
// <textarea
//   placeholder="Task description"
//   value={description}
//   onChange={(e) => setDescription(e.target.value)}
//   className="task-textarea"
// />
  return (
    <div className={`subtask ${subtask.completed ? "task-completed" : ""}`}>
      <div className="task-info">
         <input
            type="text"
            placeholder= "Subtask"
            value={subtask.name}
            onChange={(e) => setName(e.target.value)}
            className="task-input" 
         />
        {/* <strong>{subtask.name}</strong> */}
        <small>{subtask.description}</small>
        <textarea
          placeholder="Blockers..."
          value={subtask.blockers}
          onChange={(e) => updateBlockers(parentIndex, subIndex, e.target.value)}
        />
      </div>
      <div className="task-select-group">
        <TaskFeatures
          isMainTask={false}
          task={subtask}
          index={subIndex}
          updateTaskStatus={(i, status) => updateSubStatus(parentIndex, i, status)}
          toggleComplete={(i, isDone) => toggleSubComplete(parentIndex, i, isDone)}
          onAddSubtask={() => console.log("Add nested subtask (if supported)")}
        />
      </div>
    </div>
  );
}

export default Subtask;