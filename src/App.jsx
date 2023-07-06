import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import localforage from 'localforage';
import { useEffect, useState } from 'react';

function App() {
  const [task, setTask] = useState({ name: '', completed: false });
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    localforage.getItem('tasks', (err, storedTasks) => {
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        setTasks(parsedTasks);
      }
    });
  }, []);

  const storeTasks = (tasks) => {
    setTasks(tasks);
    const stringifiedTasks = JSON.stringify(tasks);
    localforage.setItem('tasks', stringifiedTasks, (err) => {
      if (err) {
        console.error('Error storing tasks:', err);
      } else {
        console.log('Tasks stored successfully!');
      }
    });
  };

  const getTasks = () => {
    return tasks.map((task, index) => (
      <li
        key={index}
        className={
          task.completed
            ? 'list-group-item list-group-item-success'
            : 'list-group-item list-group-item-danger'
        }
        onClick={() => {
          updateTask(index);
        }}
        onDoubleClick={() => {
          deleteTask(index);
        }}
      >
        {task.name}
      </li>
    ));
  };

  const updateTask = (i) => {
    const newTasks = [...tasks];
    newTasks.splice(i, 1, {
      name: newTasks[i].name,
      completed: !newTasks[i].completed,
    });
    storeTasks(newTasks);
  };

  const deleteTask = (i) => {
    const newTasks = [...tasks];
    newTasks.splice(i, 1);
    storeTasks(newTasks);
  };

  const addTask = (t) => {
    if (t) {
      const newTasks = [...tasks];
      newTasks.push({ name: t, completed: false });
      storeTasks(newTasks);
      setTask({ name: '', completed: false });
    } else {
      alert('enter a valid value');
    }
  };

  return (
    <div className="App">
      <input
        className="form-control"
        type="text"
        onChange={(e) => {
          setTask({ ...task, name: e.target.value });
        }}
        value={task.name}
        placeholder="enter the task"
      />
      <button
        className="btn btn-success w-100"
        onClick={() => {
          addTask(task.name);
        }}
      >
        Change
      </button>
      <ul className="list-group">{getTasks()}</ul>
    </div>
  );
}

export default App;
