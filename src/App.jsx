import { useState, useEffect } from "react";

import "./App.css";
import UserForm from "./components/userForm";
import Quiz from "./components/quiz";

function App() {
  const [user, setUser] = useState(localStorage.getItem("name") || "");
  const [topic, setTopic] = useState(localStorage.getItem("topic") || "");

  const handleRestart = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("quizScore");
    localStorage.removeItem("questions"); // clear cache
    setUser("");
    setTopic("");
  };
  const handleStart = (name, topic) => {
    setUser(name);
    setTopic(topic);
  };
  return (
    <>
      <div className="App">
        {!user ? (
          <UserForm onStart={handleStart} />
        ) : (
          <Quiz user={user} onRestart={handleRestart} topic={topic} />
        )}
      </div>
    </>
  );
}

export default App;
