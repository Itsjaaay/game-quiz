import React, { useState, useEffect, useCallback } from "react";
import { fetchQuestions } from "./api.js";
import "./styles.css"; // Import the CSS file

const QuizGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(10);
  const [userName, setUserName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("history"); // Default category

  const handleNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const startGame = async () => {
    if (selectedCategory && userName) {
      setScore(0);
      setGameStarted(true);
      setGameOver(false);
      try {
        const data = await fetchQuestions(selectedCategory);
        if (data && data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
          setCurrentQuestionIndex(0);
          resetTimer();
        } else {
          console.error("Invalid or empty questions array:", data);
          setGameOver(true);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setGameOver(true);
      }
    } else {
      alert("Please enter your name and select a category.");
    }
  };

  const handleAnswerClick = useCallback(
    (isCorrect) => {
      if (isCorrect) {
        setScore(score + 100);
      }

      const nextQuestionIndex = currentQuestionIndex + 1;

      if (nextQuestionIndex < questions.length) {
        setCurrentQuestionIndex(nextQuestionIndex);
        resetTimer();
      } else {
        setGameOver(true);
      }
    },
    [score, currentQuestionIndex, questions.length]
  );

  const resetTimer = () => {
    setTimer(10);
  };

  const playAgain = () => {
    setGameStarted(false);
    setGameOver(false);
    setCurrentQuestionIndex(0);
    setUserName("");
    setSelectedCategory("history"); // Reset category to default
  };

  useEffect(() => {
    let countdown;
    if (gameStarted && !gameOver) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0) {
      clearInterval(countdown);
      handleAnswerClick(false); // User ran out of time, move to the next question
    }

    return () => {
      clearInterval(countdown);
    };
  }, [timer, gameStarted, gameOver, handleAnswerClick]);

  return (
    <div className="quiz-game">
      {!gameStarted ? (
        <div className="user-input">
        <label>
          Enter your name:
          <input type="text" value={userName} onChange={handleNameChange} />
        </label>
        <label>
          Select category:
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="history">History</option>
            <option value="geography">Geography</option>
            <option value="science">Science</option>
            <option value="food_and_drink">Food and Drink</option>
          </select>
        </label>
        <button onClick={startGame}>Start Game</button>
      </div>      
      ) : (
        <div className="active-game">
          <h2>Welcome, {userName}!</h2>
          <p>Score: {score}</p>
          <div className="countdown-timer">Time left: {timer}s</div>
          {questions.length > 0 && currentQuestionIndex < questions.length && (
            <div className="question-container">
              <h3>{questions[currentQuestionIndex].question}</h3>
              <div className="answer-options">
                {questions[currentQuestionIndex].answers.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(answer.correct)}
                  >
                    {answer.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>{userName}, your final score is: {score}</p>
          <button onClick={playAgain}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default QuizGame;
