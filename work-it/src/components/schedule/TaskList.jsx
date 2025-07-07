// TaskList.jsx
import Task from "./Task";
function TaskList({
  tasks,
  moveTask,
  updatePriority,
  updateTaskStatus,
  onAddSubtask,
  onEditTask,
  onCopyTask,
  onDeleteTask,
  onToggleSubtasks,
  onUpdateBlockers,
  onGenerateSubtasks,
  onSuggestSolution,
  generatingSubtasks,
  solvingBlocker
}) {
  return (
    <div>
      {tasks.map((task, index) => (
        <div key={index}>
          <Task
            task={task}
            index={index}
            moveTask={moveTask}
            updatePriority={updatePriority}
            updateTaskStatus={updateTaskStatus}
            onAddSubtask={() => onAddSubtask(index)}
            onEditTask={(data) => onEditTask(index, data)}
            onCopyTask={() => onCopyTask(index)}
            onDeleteTask={() => onDeleteTask(index)}
            onToggleSubtasks={() => onToggleSubtasks(index)}
            onGenerateSubtasks={() => onGenerateSubtasks(index)}
            isGenerating={generatingSubtasks === index}
            isMainTask={true}
          />
          {task.isExpanded && task.subtasks?.length > 0 && (
            <div style={{ marginLeft: 30, marginTop: 10 }}>
              {task.subtasks.map((subtask, subIndex) => (
                <Task
                  key={subIndex}
                  task={subtask}
                  index={subIndex}
                  parentIndex={index}
                  moveTask={moveTask}
                  updatePriority={()=>{}}
                  updateTaskStatus={updateTaskStatus}
                  onAddSubtask={() => {}}
                  onEditTask={(data) => onEditTask(index, data, subIndex)}
                  onCopyTask={() => onCopyTask(index, subIndex)}
                  onDeleteTask={() => onDeleteTask(index, subIndex)}
                  onUpdateBlockers={(blockers) => onUpdateBlockers(index, subIndex, blockers)}
                  onSuggestSolution={(blockerText) => onSuggestSolution(index, subIndex, blockerText)}
                  isSolving={solvingBlocker && solvingBlocker.taskIndex === index && solvingBlocker.subtaskIndex === subIndex}
                  isMainTask={false}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
export default TaskList;
