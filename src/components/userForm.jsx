import { useState } from "react";
export default function UserForm({ onStart }) {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem("name", name);
      localStorage.setItem("topic", topic);
      onStart(name, topic);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="form">
        {" "}
        <div className="circle">
          <h2 className="quiz">Quiz</h2>
          <h3 className="khelo">Khelo</h3>
        </div>
        <div className="name-input-container">
          <label htmlFor="name" className="label">
            Enter your name to start
          </label>
          <input
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="name-input"
          />
          <label htmlFor="topic" className="label">
            Enter a quiz topic.
          </label>
          <input
            type="text"
            placeholder="Enter a quiz topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="name-input"
          />
        </div>
        <div className="example">
          <h5>Examples Topics:</h5>
          <p>History, Geography, Sports</p>
          <p>Art, Music, Literature</p>
          <p>Mathematics, Science, Technology</p>
        </div>
        <div className="start">
          <button type="submit" className="start-button">
            Start Quiz
          </button>
        </div>
      </form>
    </>
  );
}
