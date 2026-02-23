import { useState, useEffect } from 'react';
import { Plus, Check, Trash2, ListTodo, Sparkles } from 'lucide-react';
import './App.css';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

type FilterType = 'all' | 'active' | 'completed';

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTasks(prev => [newTask, ...prev]);
    setInputValue('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(task => !task.completed));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const activeCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">
          <Sparkles className="icon-main" style={{ color: 'var(--primary)' }} />
          Tasks
        </h1>
      </header>

      <form className="input-container" onSubmit={addTask}>
        <input
          type="text"
          className="task-input"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button 
          type="submit" 
          className="add-btn"
          disabled={!inputValue.trim()}
        >
          <Plus size={24} />
        </button>
      </form>

      <div className="filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <ListTodo className="empty-icon" />
            <p>No tasks found. Time to relax or add something new!</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id} 
              className={`task-item ${task.completed ? 'completed' : ''}`}
            >
              <div className="task-content" onClick={() => toggleTask(task.id)}>
                <div className={`checkbox ${task.completed ? 'checked' : ''}`}>
                  {task.completed && <Check className="check-icon" />}
                </div>
                <span className="task-text">{task.text}</span>
              </div>
              <div className="task-actions">
                <button 
                  className="icon-btn delete"
                  onClick={() => deleteTask(task.id)}
                  aria-label="Delete task"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {tasks.length > 0 && (
        <div className="stats">
          <span>{activeCount} item{activeCount !== 1 ? 's' : ''} left</span>
          {tasks.some(t => t.completed) && (
            <button 
              className="icon-btn clear-completed"
              style={{ color: 'var(--text-muted)', fontSize: '0.9rem', width: 'auto', padding: '0' }}
              onClick={clearCompleted}
            >
              Clear completed
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
