export default function Result({ user, score, onRestart }) {
  return (
    <>
      <h2>
        Hi {user}, your score is {score} out of 5 🎉
      </h2>
      <button onClick={onRestart}>Play Again</button>
    </>
  );
}
