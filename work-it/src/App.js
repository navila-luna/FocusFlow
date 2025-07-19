import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskForm from "./components/schedule/TaskForm.jsx"; 
import TaskList from "./components/schedule/TaskList.jsx";
import CountdownTimer from "./components/timer/timer.js";
import ToDoCategory from './components/schedule/ToDoCategory.jsx';

function App() {
  const geminiKey = process.env.REACT_APP_GEMINI_API_KEY;
  
  // Load tasks from localStorage on component mount
  const loadTasksFromStorage = () => {
    try {
      const savedTasks = localStorage.getItem('workit-tasks');
      let tasks = savedTasks ? JSON.parse(savedTasks) : [];
      // Ensure every task has a category
      tasks = tasks.map(task => ({
        category: task.category || 'Overall',
        ...task
      }));
      return tasks;
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      return [];
    }
  };

  const [tasks, setTasks] = useState(loadTasksFromStorage);
  const [generatingSubtasks, setGeneratingSubtasks] = useState(null);
  const [solvingBlocker, setSolvingBlocker] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Overall');
  const [categories, setCategories] = useState(['Work']); // Only user categories

  const handleAddCategory = (newCat) => {
    if (newCat && !categories.includes(newCat.trim())) {
      setCategories([...categories, newCat.trim()]);
    }
  };

  const handleRemoveCategory = (categoryToRemove) => {
    // Remove the category from the list
    setCategories(categories.filter(cat => cat !== categoryToRemove));
    
    // Set all tasks with this category to 'N/A'
    setTasks(prevTasks => 
      prevTasks.map(task => ({
        ...task,
        category: task.category === categoryToRemove ? 'N/A' : task.category
      }))
    );
    
    // If the removed category was selected, switch to 'Overall'
    if (selectedCategory === categoryToRemove) {
      setSelectedCategory('Overall');
    }
  };

  // Save tasks to localStorage whenever tasks change
  const saveTasksToStorage = (updatedTasks) => {
    try {
      localStorage.setItem('workit-tasks', JSON.stringify(updatedTasks));
      setSaveStatus('Saved');
      setTimeout(() => setSaveStatus(''), 2000); // Clear status after 2 seconds
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
      setSaveStatus('Save failed');
      // If localStorage is full, try to clear old data and save again
      try {
        localStorage.clear();
        localStorage.setItem('workit-tasks', JSON.stringify(updatedTasks));
        setSaveStatus('Saved');
        setTimeout(() => setSaveStatus(''), 2000);
      } catch (retryError) {
        console.error('Failed to save tasks even after clearing localStorage:', retryError);
        setSaveStatus('Save failed');
      }
    }
  };

  // Effect to save tasks whenever they change
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Utility function to clear all tasks (useful for testing)
  const clearAllTasks = () => {
    setTasks([]);
    try {
      localStorage.removeItem('workit-tasks');
    } catch (error) {
      console.error('Error clearing tasks from localStorage:', error);
    }
  };

  const addTask = (name, description) => {
    setTasks([
      ...tasks,
      { name, description, priority: "Medium", completed: false, status: "To Do", subtasks: [], isExpanded: true, category: "Overall" },
    ]);
  };

  // In the App component
  const moveTask = (fromIndex, toIndex, parentTaskIndex = null) => {
    setTasks(prevTasks => {
      if (parentTaskIndex === null) {
        // Moving a main task
        const newTasks = [...prevTasks];
        const [movedTask] = newTasks.splice(fromIndex, 1);
        newTasks.splice(toIndex, 0, movedTask);
        return newTasks;
      } else {
        // Moving a subtask
        return prevTasks.map((task, index) => {
          if (index === parentTaskIndex) {
            const newSubtasks = [...task.subtasks];
            const [movedSubtask] = newSubtasks.splice(fromIndex, 1);
            newSubtasks.splice(toIndex, 0, movedSubtask);
            return { ...task, subtasks: newSubtasks };
          }
          return task;
        });
      }
    });
  };
  const updatePriority = (index, priority) => {
    const updated = [...tasks];
    updated[index].priority = priority;
    setTasks(updated);
  };
    
  const toggleSubtasks = (taskIndex) => {
    setTasks(prevTasks =>
      prevTasks.map((task, index) => index === taskIndex
      ? { ...task, isExpanded: !task.isExpanded }
      : task));
  };
  const updateTaskStatus = (taskIndex, newStatus, subtaskIndex = null) => {
      setTasks((prevTasks) => {
        const updatedTasks = JSON.parse(JSON.stringify(prevTasks)); // Deep copy for safe mutation
        if (subtaskIndex === null) {
          if (newStatus === "Done" && updatedTasks[taskIndex].subtasks.length > 0) {
            const allSubtasksDone = updatedTasks[taskIndex].subtasks.every((st) => st.status === "Done");
            if (!allSubtasksDone) {
              alert("All subtasks must be marked done before completing this task.");
              return prevTasks;
            }
          }
          updatedTasks[taskIndex].status = newStatus;
          updatedTasks[taskIndex].completed = newStatus === "Done";
        } else {
          updatedTasks[taskIndex].subtasks[subtaskIndex].status = newStatus;
          updatedTasks[taskIndex].subtasks[subtaskIndex].completed = newStatus === "Done";
          const allSubtasksDone = updatedTasks[taskIndex].subtasks.every((st) => st.status === "Done");
          if (allSubtasksDone) {
            updatedTasks[taskIndex].status = "Done";
            updatedTasks[taskIndex].completed = true;
          } else {
            updatedTasks[taskIndex].status = "In Progress";
            updatedTasks[taskIndex].completed = false;
          }
        }
        return updatedTasks;
      });
    };

    const addSubtask = (taskIndex) => {
      setTasks(prevTasks =>
        prevTasks.map((task, index) => {
          if (index === taskIndex) {
            const newSubtask = { name: "New Subtask", description: "Subtask description...", status: "To Do", completed: false};
            return { ...task, subtasks: [...(task.subtasks || []), newSubtask] };
          }
          return task;
        })
      );
    };

    const editTask = (taskIndex, data, subtaskIndex = null) => {
      setTasks(prevTasks =>
        prevTasks.map((task, i) => {
          if (i !== taskIndex) {
            return task;
          }
          if (subtaskIndex === null) {
            return { ...task, ...data };
          } else {
            const newSubtasks = task.subtasks.map((subtask, j) => {
              if (j !== subtaskIndex) {
                return subtask;
              }
              return { ...subtask, ...data };
            });
            return { ...task, subtasks: newSubtasks };
          }
        })
      );
    };

    const deleteTask = (taskIndex, subtaskIndex = null) => {
      setTasks(prevTasks => {
        if (subtaskIndex === null) {
          return prevTasks.filter((_, i) => i !== taskIndex);
        } else {
          return prevTasks.map((task, i) => {
            if (i !== taskIndex) {
              return task;
            }
            const newSubtasks = task.subtasks.filter((_, j) => j !== subtaskIndex);
            return { ...task, subtasks: newSubtasks };
          });
        }
      });
    };

    const updateBlockers = (taskIndex, subtaskIndex, blockers) => {
      setTasks(prevTasks => prevTasks.map((task, i) => {
          if (i === taskIndex) {
              const newSubtasks = task.subtasks.map((subtask, j) => {
                  if (j === subtaskIndex) {
                      return { ...subtask, blockers };
                  }
                  return subtask;
              });
              return { ...task, subtasks: newSubtasks };
          }
          return task;
      }));
    };

    const copyTask = (taskIndex, subtaskIndex = null) => {
      setTasks(prevTasks => {
        if (subtaskIndex === null) {
          // Copying a main task, clear blockers from its subtasks
          const originalTask = prevTasks[taskIndex];
          const taskToCopy = { 
              ...originalTask, 
              name: `${originalTask.name} (Copy)`,
              subtasks: originalTask.subtasks.map(subtask => ({ ...subtask, blockers: '' }))
          };
          const newTasks = [
            ...prevTasks.slice(0, taskIndex + 1),
            taskToCopy,
            ...prevTasks.slice(taskIndex + 1)
          ];
          return newTasks;
        } else {
          // Copying a subtask, clear its blockers
          return prevTasks.map((task, i) => {
            if (i === taskIndex) {
              const subtaskToCopy = { 
                  ...task.subtasks[subtaskIndex], 
                  name: `${task.subtasks[subtaskIndex].name} (Copy)`,
                  blockers: ''
              };
              const newSubtasks = [
                ...task.subtasks.slice(0, subtaskIndex + 1),
                subtaskToCopy,
                ...task.subtasks.slice(subtaskIndex + 1)
              ];
              return { ...task, subtasks: newSubtasks };
            }
            return task;
          });
        }
      });
    };

    /*
      Will generate subtasks by parsing the json task description 
      response and calling the Gemini API
    */
    const generateSubtasks = async (taskIndex) => {
      setGeneratingSubtasks(taskIndex);
      const mainTask = tasks[taskIndex];
      const prompt = `Based on the main task "${mainTask.name}" with the description "${mainTask.description}",
       generate a short, actionable list of subtasks. Return the list as a simple array of strings in JSON format,
        like this: ["Subtask 1", "Subtask 2", "Subtask 3"].`;
      try {
          const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
          const payload = { contents: chatHistory };
          const apiKey = geminiKey;
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
          const response = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          const result = await response.json();
          if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts.length > 0) {
              const text = result.candidates[0].content.parts[0].text;
              const jsonString = text.substring(text.indexOf('['), text.lastIndexOf(']') + 1);
              const subtaskNames = JSON.parse(jsonString);
              const newSubtasks = subtaskNames.map(name => ({
                  name,
                  description: "",
                  status: "To Do",
                  completed: false,
                  blockers: '',
                  solution: '',
              }));
              
              setTasks(prevTasks => prevTasks.map((task, i) => 
                  i === taskIndex ? { ...task, subtasks: [...task.subtasks, ...newSubtasks] } : task
              ));
          }
      } catch (error) {
          console.error("Error generating subtasks:", error);
          alert("Failed to generate subtasks. Please try again.");
      } finally {
          setGeneratingSubtasks(null);
      }
    };

    const suggestSolution = async (taskIndex, subtaskIndex, blockerText) => {
      setSolvingBlocker({ taskIndex, subtaskIndex });
      const prompt = `A subtask is blocked. The blocker is: "${blockerText}". 
      Provide a concise, actionable suggestion to solve this blocker.`;
      try {
          const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
          const payload = { contents: chatHistory };
          const apiKey = geminiKey;
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
          const response = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          const result = await response.json();
          if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts.length > 0) {
              const suggestion = result.candidates[0].content.parts[0].text;
              setTasks(prevTasks => prevTasks.map((task, i) => {
                  if (i === taskIndex) {
                      const newSubtasks = task.subtasks.map((subtask, j) => {
                          if (j === subtaskIndex) {
                              return { ...subtask, solution: suggestion };
                          }
                          return subtask;
                      });
                      return { ...task, subtasks: newSubtasks };
                  }
                  return task;
              }));
          } else {
              throw new Error("Invalid response structure from API.");
          }
      } catch (error) {
          console.error("Error suggesting solution:", error);
          alert("Failed to suggest a solution. Please try again.");
      } finally {
          setSolvingBlocker(null);
      }
    };

    return (
      <DndProvider backend={HTML5Backend}>
          <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
          <CountdownTimer />
          <ToDoCategory
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categories={categories}
            onAddCategory={handleAddCategory}
            onRemoveCategory={handleRemoveCategory}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{textAlign: 'center', margin: 0}}>🗓️ Task Scheduler</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {saveStatus && (
                <small style={{ 
                  color: saveStatus === 'Saved' ? '#28a745' : '#dc3545',
                  fontSize: '12px'
                }}>
                  {saveStatus}
                </small>
              )}
            </div>
          </div>
          <TaskForm addTask={addTask} clearAllTasks={clearAllTasks} />
          <TaskList
            tasks={selectedCategory === 'Overall' ? tasks : tasks.filter(task => task.category === selectedCategory)}
            categories={['N/A', ...categories]}
            moveTask={moveTask}
            updatePriority={updatePriority}
            updateTaskStatus={updateTaskStatus}
            onAddSubtask={addSubtask}
            onEditTask={editTask}
            onDeleteTask={deleteTask}
            onCopyTask={copyTask}
            onToggleSubtasks={toggleSubtasks}
            onUpdateBlockers={updateBlockers}
            onGenerateSubtasks={generateSubtasks}
            onSuggestSolution={suggestSolution}
            generatingSubtasks={generatingSubtasks}
            solvingBlocker={solvingBlocker}
          />
        </div>
      </DndProvider>
    );
  }

export default App;
