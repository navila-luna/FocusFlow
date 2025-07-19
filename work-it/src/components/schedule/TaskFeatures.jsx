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
    isGenerating,
    category, // new prop
    onCategoryChange, // new prop
    categories = ['Overall', 'Work'] // new prop, default for safety
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
          {/* Category Dropdown */}
          {isMainTask && (
            <select
              value={category || 'N/A'}
              onChange={onCategoryChange}
              className="task-select"
              style={{ minWidth: '90px' }}
            >
              <option value="N/A">N/A</option>
              {categories.map((cat) => (
                cat !== 'N/A' && <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
  
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
