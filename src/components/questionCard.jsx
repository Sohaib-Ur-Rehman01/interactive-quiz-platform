export default function QuestionCard({
  question,
  options,
  correctAnswer,
  onAnswer,
  selectedAnswer,
}) {
  return (
    <>
      <div className="question-container">
        <h3>{question}</h3>
      </div>
      <div className="question-card">
        <div className="options">
          {options.map((option, idx) => {
            let className = "option";
            if (selectedAnswer) {
              // HIGHLIGHTED UPDATE: Added this condition to show correct answer in green
              if (option === correctAnswer) {
                className += " correct";
              } else if (
                option === selectedAnswer &&
                option !== correctAnswer
              ) {
                className += " wrong";
              }
              // REMOVED: The extra 's;' line that was causing issues
            }
            return (
              <>
                <button
                  key={idx}
                  className={className}
                  onClick={() => onAnswer(option)}
                  disabled={!!selectedAnswer}
                >
                  {option}
                </button>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}
