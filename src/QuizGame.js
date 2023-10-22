import React, { useState, useEffect } from 'react';
import { fetchQuestions } from './api';
import './index.css'; // Import the CSS file

const QuizGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [userName, setUserName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [gameOver, setGameOver] = useState(true);
  const [timer, setTimer] = useState(10);

  const getRandomQuestion = (questions) => {
    if (questions && questions.length > 0) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      return questions[randomIndex];
    } else {
      console.error('Invalid or empty questions array:', questions);
      return null;
    }
  };

  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 100);
    }

    const nextQuestion = getRandomQuestion(questions);

    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      resetTimer();
    } else {
      setGameOver(true);
    }
  };

  const resetTimer = () => {
    setTimer(10);
  };

  const startGame = async () => {
    if (selectedCategory && userName) {
      setScore(0);
      setGameOver(false);
      try {
        const data = await fetchQuestions(selectedCategory);
        if (data && data.questions && data.questions.length > 0) {
          const randomQuestion = getRandomQuestion(data.questions);
          setQuestions(data.questions);
          setCurrentQuestion(randomQuestion);
        } else {
          console.error('Invalid or empty questions array:', data);
          setGameOver(true);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        setGameOver(true);
      }
      resetTimer();
    } else {
      alert('Please enter your name and select a category.');
    }
  };

  useEffect(() => {
    let countdown;
    if (!gameOver) {
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
  }, [timer, gameOver]);

  useEffect(() => {
    if (gameOver) {
      setCurrentQuestion(null);
    }
  }, [gameOver]);

  return (
    <div className="quiz-game">
      {gameOver ? (
        <div className="start-game-container">
          <label>
            Enter your name:
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
          </label>
          <label>
            Select category:
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">Select Category</option>
              <option value="history">History</option>
              <option value="geography">Geography</option>
              <option value="science">Science</option>
              <option value="food_and_drink">Food and Drink</option>
            </select>
          </label>
          <button onClick={startGame}>Start Game</button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {userName}!</h2>
          <p>Score: {score}</p>
          <div className="countdown-timer">Time left: {timer}s</div>
          {currentQuestion && (
            <div className="question-container">
              <h3>{currentQuestion.question}</h3>
              <div className="answer-options">
                {currentQuestion.answers.map((answer, index) => (
                  <button key={index} onClick={() => handleAnswerClick(answer.correct)}>
                    {answer.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizGame;
