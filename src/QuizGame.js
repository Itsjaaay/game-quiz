import React, { useState, useEffect } from "react";
import { fetchQuestions } from "./api.js";
import "./styles.css"; // Import the CSS file

const QuizGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [userName, setUserName] = useState("");
  const [answer, setAnswer] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Load leaderboard data from local storage on component mount
    const storedLeaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    setLeaderboard(storedLeaderboard);
  }, []);

  const updateLeaderboard = () => {
    const newEntry = { name: userName, score };
    const updatedLeaderboard = [...leaderboard, newEntry].sort((a, b) => b.score - a.score);
    setLeaderboard(updatedLeaderboard);
    localStorage.setItem("leaderboard", JSON.stringify(updatedLeaderboard));
  };

  const fetchNewQuestion = async () => {
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setAnswer(questions[nextQuestionIndex].answer);
    } else {
      // End of questions, end the game
      setGameOver(true);
    }
  };

  const handleAnswerSubmit = (userAnswer) => {
    if (userAnswer.toLowerCase() === answer.toLowerCase()) {
      // Correct answer logic - add points
      setScore(score + 100);
      // Fetch the next question
      fetchNewQuestion();
    } else {
      // Incorrect answer logic - deduct points
      setScore(Math.max(0, score - 50)); // Deduct 50 points for incorrect answers
      // End the game if the answer is wrong
      setGameOver(true);
    }
  };

  const startGame = async () => {
    setScore(0);
    setGameStarted(true);
    setGameOver(false);
    try {
      const data = await fetchQuestions("geography"); // Set category to geography
      if (data && data.length > 0) {
        setQuestions(data);
        setCurrentQuestionIndex(0);
        setAnswer(data[0].answer);
      } else {
        console.error("Invalid or empty questions array:", data);
        setGameOver(true);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setGameOver(true);
    }
  };

  const handleDeleteEntry = (index) => {
    const updatedLeaderboard = leaderboard.filter((_, i) => i !== index);
    setLeaderboard(updatedLeaderboard);
    localStorage.setItem("leaderboard", JSON.stringify(updatedLeaderboard));
  };

  return (
    <div className="quiz-game">
      {!gameStarted ? (
        <div className="user-input">
          <label>
            Enter your name:
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
          </label>
          <button onClick={startGame}>Start Game</button>
        </div>
      ) : (
        <div className="active-game">
          <h2>Welcome, {userName}!</h2>
          <p>Score: {score}</p>
          {questions.length > 0 && currentQuestionIndex < questions.length && (
            <div className="question-container">
              <h3>{questions[currentQuestionIndex].question}</h3>
              <input type="text" placeholder="Your answer..." />
              <button onClick={() => handleAnswerSubmit(document.getElementsByTagName("input")[0].value)}>
                Submit Answer
              </button>
            </div>
          )}
        </div>
      )}

      {/* Leaderboard */}
      <div className="leaderboard">
        <h2>Leaderboard</h2>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index} className="leaderboard-entry">
                <td>{index + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.score}</td>
                <td>
                  <button onClick={() => handleDeleteEntry(index)}>X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Game Over */}
      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>
            {userName}, your final score is: {score}
          </p>
          <button
            onClick={() => {
              updateLeaderboard();
              setGameStarted(false);
              setGameOver(false);
              setCurrentQuestionIndex(0);
              setUserName("");
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizGame;
