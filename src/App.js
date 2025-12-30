import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tasks, setTasks] = useState([]);

  const priorityOrder = {
    high: 1,
    medium: 2,
    low: 3,
  };

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    setTasks([
      {
        id: Date.now(),
        text: task,
        priority,
        completed: false,
        createdAt: new Date().toISOString(),
      },
      ...tasks,
    ]);

    setTask("");
    setPriority("medium");
  };

  const completeTask = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: true } : t
      )
    );
  };

  const deleteTask = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.add("fade-out");
      setTimeout(() => {
        setTasks(tasks.filter((t) => t.id !== id));
      }, 300);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="container">
      <h1 className="title">YAP</h1>

      <form onSubmit={addTask} className="form">
        <input
          className="input"
          type="text"
          placeholder="Görev Ekle..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <select
          className="select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="high"> Yüksek</option>
          <option value="medium"> Orta</option>
          <option value="low"> Düşük</option>
        </select>

        <button className="button">Ekle</button>
      </form>

      <ul className="list">
        {[...tasks]
          .sort(
            (a, b) =>
              priorityOrder[a.priority] - priorityOrder[b.priority]
          )
          .map((t) => (
            <li
              key={t.id}
              id={t.id}
              className={`item fade-in ${t.priority} ${t.completed ? "completed" : ""
                }`}
            >
              <div className="task-content">
                <span className="task-text">{t.text}</span>
                <span className="task-date">
                  🕒 {formatDate(t.createdAt)}
                </span>
              </div>

              <div className="actions">
                {!t.completed && (
                  <button
                    className="completeBtn"
                    onClick={() => completeTask(t.id)}
                  >
                    ✅
                  </button>
                )}

                <button
                  className="deleteBtn"
                  onClick={() => deleteTask(t.id)}
                >
                  ❌
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
