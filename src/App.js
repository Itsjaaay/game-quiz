// App.js
import React from 'react';
import QuizGame from './QuizGame';
import Leaderboard from './Leaderboard';

const App = () => {
  return (
    <div className="app">
      <QuizGame />
      <Leaderboard />
    </div>
  );
};

export default App;
