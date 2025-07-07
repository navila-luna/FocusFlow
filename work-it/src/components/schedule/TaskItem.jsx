// TaskItem.js
import React from "react";

const TaskItem = ({
  task,
  index,
  updateTaskStatus,
  onAddSubtask,
  onEditTask,
  onDeleteTask,
  onCopyTask,
  isEditing,
  setEditText,
  editText,
  setEditingTask,
  parentIndex,
}) => {
  const handleEditClick = () => {
    setEditingTask({ index, parentIndex });
    setEditText(task.name);
  };

  const handleSaveClick = () => {
    onEditTask(index, { name: editText }, parentIndex);
    setEditingTask({ index: null, parentIndex: null });
    setEditText("");
  };

  return (
    <div style={{ border: "1px solid gray", padding: "10px", marginBottom: "8px" }}>
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSaveClick}
          autoFocus
        />
      ) : (
        <span>{task.name}</span>
      )}

      <button onClick={() => updateTaskStatus(index, task.status === "Done" ? "To Do" : "Done", parentIndex)}>
        {task.status === "Done" ? "Undo" : "Done"}
      </button>
      <button onClick={handleEditClick}>✏️</button>
      <button onClick={() => onCopyTask(index, parentIndex)}>📄</button>
      <button onClick={() => onDeleteTask(index, parentIndex)}>🗑️</button>
      {parentIndex === null && <button onClick={() => onAddSubtask(index)}>➕ Subtask</button>}
    </div>
  );
};

export default TaskItem;
