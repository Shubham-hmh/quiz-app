// src/QuizApp.js
import React, { useState, useEffect } from 'react';
import questionsData from './questions.json';
import './QuizApp.css';

function QuizApp() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(10); // Set timer to 10 seconds

  useEffect(() => {
    // Randomize the order of questions
    const randomizedQuestions = [...questionsData].sort(() => Math.random() - 0.5);
    setQuestions(randomizedQuestions);
    setStartTime(Date.now());
    startTimer(); // Start the timer when the component mounts
  }, []);

  useEffect(() => {
    if (timeRemaining === 0) {
      handleAnswerSubmit(); // Auto-submit when timer reaches 0
    }
  }, [timeRemaining]);

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimeRemaining(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval); // Clean up interval on component unmount
  };

  const handleAnswerChange = (option) => {
    setSelectedOption(option);
  };

  const handleAnswerSubmit = () => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setTimeRemaining(10); // Reset timer for the next question
    } else {
      setEndTime(Date.now());
      setShowScore(true);
    }
  };

  const calculateTimeTaken = () => {
    return ((endTime - startTime) / 1000).toFixed(2);
  };

  return (
    <div className="quiz-container">
      <div className="progress-bar">
        <div className="progress" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
      </div>

      {showScore ? (
        <div className="score-section">
          <h2>Your Score: {score}</h2>
          <p>Total Time Taken: {calculateTimeTaken()} seconds</p>
          <p>{score === questions.length ? "Congratulations! You got all questions correct!" : "Good job!"}</p>
        </div>
      ) : (
        <div className="question-section">
          <h2>Question {currentQuestion + 1}</h2>
          <div className="question-text">
            {questions[currentQuestion]?.question}
          </div>
          <div className="time-remaining">
            Time Remaining: {timeRemaining} seconds
          </div>
          <div className="answer-options">
            {questions[currentQuestion]?.options.map((option, index) => (
              <div key={index} className="option">
                <input
                  type="radio"
                  id={`option${index}`}
                  name="options"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => handleAnswerChange(option)}
                />
                <label htmlFor={`option${index}`}>{option}</label>
              </div>
            ))}
          </div>
          <button
            className="submit-button"
            onClick={handleAnswerSubmit}
            disabled={!selectedOption}
          >
            Submit Answer
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizApp;
