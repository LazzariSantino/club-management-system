import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:3000";

function App() {
  // Login state
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  // Students
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [stats, setStats] = useState({ totalStudents: 0 });

  // Edit
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");

  // LOAD DATA
  const loadStudents = () => {
    fetch(`${API}/students`)
      .then(res => res.json())
      .then(setStudents);
  };

  const loadStats = () => {
    fetch(`${API}/stats`)
      .then(res => res.json())
      .then(setStats);
  };

  useEffect(() => {
    if (logged) {
      loadStudents();
      loadStats();
    }
  }, [logged]);

  // LOGIN
  const login = () => {
  console.log("Trying login:", user, pass);

  fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: user, password: pass })
  })
    .then(res => {
      if (!res.ok) throw new Error("Login failed");
      return res.json();
    })
    .then(data => {
      console.log("Login success:", data);
      setLogged(true);
    })
    .catch(err => {
      alert("Usuario o contraseña incorrectos");
      console.error(err);
    });
};

  // ADD
  const addStudent = () => {
    fetch(`${API}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, age })
    }).then(() => {
      setName("");
      setAge("");
      loadStudents();
      loadStats();
    });
  };

  // DELETE
  const deleteStudent = (id) => {
    fetch(`${API}/students/${id}`, { method: "DELETE" })
      .then(() => {
        loadStudents();
        loadStats();
      });
  };

  // UPDATE
  const updateStudent = () => {
    fetch(`${API}/students/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, age: editAge })
    }).then(() => {
      setEditingId(null);
      loadStudents();
      loadStats();
    });
  };

  // LOGIN SCREEN
  if (!logged) {
  return (
    <div className="container">
      <h1>Login</h1>
      <input 
        placeholder="Username" 
        onChange={e => setUser(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        onChange={e => setPass(e.target.value)} 
      />
      <button onClick={login}>Login</button>
    </div>
  );
}
  return (
    <div className="container">
      <h1>Club Management System</h1>

      {/* DASHBOARD */}
      <div className="card">
        <h2>Dashboard</h2>
        <p>Total students: <b>{stats.totalStudents}</b></p>
      </div>

      {/* ADD STUDENT */}
      <div className="card">
        <h2>Add Student</h2>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} />
        <button onClick={addStudent}>Add</button>
      </div>

      {/* EDIT STUDENT */}
      {editingId && (
        <div className="card">
          <h2>Edit Student</h2>
          <input value={editName} onChange={e => setEditName(e.target.value)} />
          <input type="number" value={editAge} onChange={e => setEditAge(e.target.value)} />
          <button onClick={updateStudent}>Save</button>
          <button onClick={() => setEditingId(null)}>Cancel</button>
        </div>
      )}

      {/* LIST */}
      <div className="card">
        <h2>Students</h2>
        <ul>
          {students.map(s => (
            <li key={s.id}>
              {s.name} - {s.age} years
              <button onClick={() => deleteStudent(s.id)}>Delete</button>
              <button onClick={() => {
                setEditingId(s.id);
                setEditName(s.name);
                setEditAge(s.age);
              }}>
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;