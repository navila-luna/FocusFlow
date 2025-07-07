import "./schedule.css";

function TaskFeatures({
    isMainTask,
    task,
    index,
    updatePriority,
    updateTaskStatus,
    onAddSubtask,
    onEditTask,
    onDeleteTask,
    onCopyTask,
    onGenerateSubtasks,
    isGenerating
  }) {
    return (
      <div className="task-options">
        <div className="task-select-group">
          <select
            value={task.status}
            onChange={updateTaskStatus}
            className="task-status-select"
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
  
          {isMainTask && (
            <select
              value={task.priority}
              onChange={(e) => updatePriority(index, e.target.value)}
              className={`task-select priority-${task.priority.toLowerCase()}`}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          )}
        </div>
  
        <div className="container">
          <span
            className="material-symbols-outlined"
            style={{ cursor: "pointer" }}
            onClick={onEditTask}
          >
            edit
          </span>
          <span
            className="material-symbols-outlined"
            style={{ cursor: "pointer" }}
            onClick={onCopyTask}
          >
            content_copy
          </span>
          <span
            className="material-symbols-outlined"
            style={{ cursor: "pointer" }}
            onClick={onDeleteTask}
          >
            delete
          </span>
        </div>
  
        {isMainTask && (
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <button onClick={onAddSubtask} className="task-button">
                <span className="material-symbols-outlined">add_circle</span>
                Add Subtask
            </button>
            <button onClick={onGenerateSubtasks} disabled={isGenerating} className="ai-button">
                 ✨ {isGenerating ? 'Generating...' : 'Generate Subtasks'}
            </button>
        </div>
      )}
    </div>
    );
  }
  
export default TaskFeatures;
