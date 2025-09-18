import { useState, useEffect } from "react";
// import questions from "../data/questions";
import QuestionCard from "./questionCard";
import { fetchQuestions } from "../api/openai";
import Result from "./result";
export default function Quiz({ user, onRestart, topic }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [finished, setFinished] = useState(false);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [spinnerProgress, setSpinnerProgress] = useState(0);

  useEffect(() => {
    if (
      finished ||
      !questions.length ||
      (currentQ === questions.length - 1 && selectedAnswer)
    )
      return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSkipQuestion(); // Time's up - skip question
          return 30; // Reset timer
        }
        const newTime = prev - 1;
        const progress = ((30 - newTime) / 30) * 360;
        setSpinnerProgress(progress);
        return newTime;
      });
      // setSpinnerRotation((prev) => (prev + 12) % 360); // 360/30 = 12 degrees per second
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQ, finished, questions.length, selectedAnswer]);

  // Skip question function
  const handleSkipQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(null);
      setTimeLeft(30); // Reset timer for next question
      // setSpinnerRotation(0); // Reset spinner on new question
      setSpinnerProgress(0); // Reset spinner progress
    } else {
      setFinished(true);
    }
  };

  // Modify handleAnswer to reset timer
  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    if (answer === questions[currentQ].correctAnswer) {
      setScore((prev) => prev + 1);
    }
    setTimeLeft(30); // Reset timer for next question
    setSpinnerProgress(0); // Reset spinner progress

    // setSpinnerRotation(0); // Reset spinner on answer
  };
  useEffect(() => {
    if (selectedAnswer && currentQ < questions.length - 1) {
      const timer = setTimeout(() => {
        setCurrentQ(currentQ + 1);
        setSelectedAnswer(null);
      }, 1000); // 1 second delay

      return () => clearTimeout(timer);
    }
  }, [selectedAnswer, currentQ, questions.length]);
  const handleShowResult = () => {
    setFinished(true);
    localStorage.setItem("quizScore", score);
    // Clear any remaining timers
    setTimeLeft(0);
    setSpinnerProgress(0);
  };
  const handleRestart = () => {
    setCurrentQ(0);
    setScore(0);
    setSelectedAnswer(null);
    setFinished(false);
    localStorage.removeItem("quizScore");
  };

  async function loadQuestions(topic) {
    if (isQuizLoading) return;
    setIsQuizLoading(true);
    const q = await fetchQuestions(topic);
    setQuestions(q);
    setLoading(false);
    setIsQuizLoading(false);
  }

  useEffect(() => {
    if (!mounted) setMounted(true);
  }, []);

  useEffect(() => {
    if (topic && mounted) loadQuestions(topic);
  }, [topic, mounted]);

  if (loading) return <p>Loading questions...</p>;
  if (finished)
    return <Result user={user} score={score} onRestart={onRestart} />;
  return (
    <>
      <div>
        <h2>
          Question {currentQ + 1} of {questions.length}
        </h2>
        <div className="timer-container">
          <div
            className="timer"
            // style={{ position: "relative", display: "none" }}
          >
            Time left: {timeLeft} seconds
          </div>
          <div className="spinner-container">
            <div
              className="spinner"
              style={{ "--progress": `${spinnerProgress}deg` }}

              // style={{ transform: `rotate(${spinnerRotation}deg)` }}
            ></div>
          </div>
        </div>
        <QuestionCard
          question={questions[currentQ].question}
          options={questions[currentQ].options}
          correctAnswer={questions[currentQ].correctAnswer}
          onAnswer={handleAnswer}
          selectedAnswer={selectedAnswer}
        />
        {selectedAnswer && currentQ === questions.length - 1 && (
          <button onClick={handleShowResult}>See Result</button>
        )}
      </div>
    </>
  );
}
