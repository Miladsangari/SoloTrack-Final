import React, { useState } from "react";
import { getToken } from "./api";
import Login from "./components/Login";
import Register from "./components/Register";
import IncidentList from "./components/IncidentList";

function App() {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null
  );
  const [view, setView] = useState(() => (getToken() ? "incidents" : "login"));

  const handleLogin = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    setView("incidents");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setView("login");
  };

  return (
    <div className="app">
      <header className="header">
        <h1>SoloTrack</h1>
        <nav>
          {user ? (
            <>
              <button onClick={() => setView("incidents")}>Incidents</button>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setView("login")}>Login</button>
              <button onClick={() => setView("register")}>Register</button>
            </>
          )}
        </nav>
      </header>

      <main>
        {!user && view === "login" && <Login onSuccess={handleLogin} />}
        {!user && view === "register" && (
          <Register onRegistered={() => setView("login")} />
        )}
        {user && view === "incidents" && <IncidentList />}
      </main>
    </div>
  );
}

export default App;
