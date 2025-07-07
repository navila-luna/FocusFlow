// Task.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDrag, useDrop } from "react-dnd";
import "./schedule.css";
import TaskFeatures from "./TaskFeatures";

function Task({
  task,
  index,
  parentIndex = null,
  moveTask,
  updatePriority,
  updateTaskStatus,
  onAddSubtask,
  onEditTask,
  onCopyTask,
  onDeleteTask,
  isMainTask = true,
  onToggleSubtasks,
  onUpdateBlockers,
  onGenerateSubtasks,
  onSuggestSolution,
  isGenerating,
  isSolving
}) {
  const type = isMainTask ? "TASK" : "SUBTASK";
  const dndRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedBlockers, setEditedBlockers] = useState(task.blockers || '');

  useEffect(() => {
    setEditedName(task.name);
    setEditedDescription(task.description);
    setEditedBlockers(task.blockers || '');
  }, [task.name, task.description, task.blockers]);
  
  const [{ isDragging }, drag] = useDrag({
    type,
    item: () => ({ index, parentIndex }), // Use a function to ensure fresh data
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: type,
    hover(item, monitor) {
      if (!dndRef.current) {
        return;
      }
      // Don't replace items with themselves
      if (item.index === index && item.parentIndex === parentIndex) {
        return;
      }
      
      // Dragging logic
      if (isMainTask) {
        // Can't drag a subtask into the main task list
        if (item.parentIndex !== null) return;
        moveTask(item.index, index);
      } else {
        // Can't drag a main task into a subtask list or a subtask from another parent
        if (item.parentIndex !== parentIndex) return;
        moveTask(item.index, index, parentIndex);
      }
      
      // Note: we're mutating the monitor item here for performance.
      item.index = index;
    },
  });

  drag(drop(dndRef));

  const handleEdit = () => setIsEditing(true);
  
  const handleSave = () => {
    if (editedName !== task.name || editedDescription !== task.description) {
      onEditTask({ name: editedName, description: editedDescription });
    }
    setIsEditing(false);
  };
  
  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
        handleSave();
    }
  };
  
  const handleBlockersBlur = () => {
      if(onUpdateBlockers && editedBlockers !== task.blockers) {
          onUpdateBlockers(editedBlockers);
      }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    const taskIdx = isMainTask ? index : parentIndex;
    const subtaskIdx = isMainTask ? null : index;
    updateTaskStatus(taskIdx, newStatus, subtaskIdx);
  };
  
  const completedSubtasks = isMainTask && task.subtasks ? task.subtasks.filter(st => st.completed).length : 0;
  const totalSubtasks = isMainTask && task.subtasks ? task.subtasks.length : 0;
  const totalBlockers = isMainTask && task.subtasks ? task.subtasks.filter(st => st.blockers && st.blockers.trim() !== '').length : 0;


  return (
    <div ref={dndRef} style={{ opacity: isDragging ? 0.5 : 1 }} className={isMainTask ? 'task' : 'subtask'}>
      <div className="task-content">
        <div className={`task-info ${task.completed ? "task-completed" : ""}`}>
          {isEditing ? (
            <div onBlur={handleBlur}>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                autoFocus
                className="task-input"
              />
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="task-textarea"
              />
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 {isMainTask && totalSubtasks > 0 && (
                    <span
                      className="material-symbols-outlined"
                      style={{ cursor: 'pointer', fontSize: '24px' }}
                      onClick={onToggleSubtasks}
                    >
                      {task.isExpanded ? 'expand_more' : 'chevron_right'}
                    </span>
                 )}
                <strong>{task.name}</strong>
              </div>
              <small style={{ paddingLeft: isMainTask && totalSubtasks > 0 ? '32px' : '0' }}>{task.description}</small>
              {isMainTask && totalSubtasks > 0 && (
                <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#555', fontWeight: 'bold', paddingLeft: '32px' }}>
                  {completedSubtasks} of {totalSubtasks} subtasks completed
                </div>
              )}
               {isMainTask && totalBlockers > 0 && (
                <div style={{ marginTop: '5px', fontSize: '0.9em', color: '#D32F2F', fontWeight: 'bold', paddingLeft: '32px' }}>
                  Blockers: {totalBlockers}
                </div>
              )}
            </>
          )}
           {!isMainTask && (
            <div style={{ marginTop: '10px', width: '100%' }}>
                <strong style={{ fontSize: '0.9em', color: '#333' }}>Blockers:</strong>
                <textarea
                    placeholder="Describe any blockers..."
                    value={editedBlockers}
                    onChange={(e) => setEditedBlockers(e.target.value)}
                    onBlur={handleBlockersBlur}
                    className="task-textarea"
                    style={{ marginTop: '4px', height: '60px' }}
                />
                <button onClick={() => onSuggestSolution(editedBlockers)} disabled={isSolving || !editedBlockers} className="ai-button">
                    ✨ {isSolving ? 'Solving...' : 'Suggest Solution'}
                 </button>
                 {task.solution && (
                     <div style={{marginTop: '10px'}}>
                        <strong style={{ fontSize: '0.9em', color: '#333' }}>Suggested Solution:</strong>
                        <textarea
                            readOnly
                            value={task.solution}
                            className="task-textarea solution-textarea"
                        />
                     </div>
                 )}
            </div>
          )}
        </div>
      </div>
      <div className="priorities">
        <TaskFeatures
          isMainTask={isMainTask}
          task={task}
          index={index}
          updatePriority={updatePriority}
          updateTaskStatus={handleStatusChange}
          onAddSubtask={onAddSubtask}
          onEditTask={handleEdit}
          onCopyTask={onCopyTask}
          onDeleteTask={onDeleteTask}
          onGenerateSubtasks={onGenerateSubtasks}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}


export default Task;
