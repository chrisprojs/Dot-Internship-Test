import React, { useEffect, useState } from 'react'
import axios from 'axios';
import "./Quiz.css"
import { Link, useNavigate } from 'react-router-dom';
import { clear } from '@testing-library/user-event/dist/clear';

function QuizFinalize() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [totalPoint, setTotalPoint] = useState(0);
  const navigate = useNavigate()

  useEffect(() => {
    // fetch questions from local storage
    const fetchQuestions = () => {
        const cachedQuestions = localStorage.getItem('questions');
        if (cachedQuestions){
          setQuestions(JSON.parse(cachedQuestions))
          setLoading(false)
        }
    };

    // fetch answers from local storage
    const fetchAnswer = () => {
      const cachedAnswers = localStorage.getItem('answers');
      if (cachedAnswers){
        const parsedAnswers = JSON.parse(cachedAnswers);
        setSelectedAnswers(parsedAnswers)
      }
    }

    fetchAnswer()
    fetchQuestions();
  }, []);

  useEffect(() => {
    // Calculate the total score
    if (questions.length > 0 && Object.keys(selectedAnswers).length > 0) {
      let correctAnswers = 0;
      questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correct_answer) {
          correctAnswers++;
        }
      });
      setTotalPoint(correctAnswers);
    }
  }, [questions, selectedAnswers]);

  const getAnswer = (question, answer, index) => {
    const isCorrectAnswer = answer === question.correct_answer;
    const isSelectedAnswer = selectedAnswers[index] === answer;

    if (isSelectedAnswer && !isCorrectAnswer) { // if is selected answer and is not a correct then add red bg danger
      return 'quiz-incorrect-answer';
    } else if (isCorrectAnswer) { // if isCorrectAnswer then add green bg success
      return 'quiz-correct-answer';
    }
    return '';
  };

  const handleBackToHome = () => {
    // When go back to home, make sure all storage is clean
    localStorage.clear();
    navigate('/')
  }

  if (loading){ // loading while fetching the questions
    return (
      <div className='loading-container'>
        Loading...
      </div>
    )
  }
  else{
    const score = (totalPoint / questions.length) * 100;
    return (
      <div className='quiz-container'>
        {questions.map((question, index) => (
            <div className='quiz-box' key={index}>
                <h2>{index+1}. <span dangerouslySetInnerHTML={{ __html: question.question }} /></h2>
                <ul className='quiz-choices'>
                    {question.allAnswers.map((answer, i) => (
                        <li className={`quiz-choice ${getAnswer(question, answer, index)}`} key={i}><input
                        type="radio"
                        name={`question-${index}`}
                        value={answer}
                        checked={selectedAnswers[index] === answer}  /* if the selected answer 
                        equal to answer then the radio is pointed */
                      /><span dangerouslySetInnerHTML={{ __html: answer }} /></li>
                    ))}
                </ul>
            </div>
        ))}
        <div className='score-box'>
          <p className='score-text'>Score</p>
          <p className='score-value'>{score}</p>
          <button className='quiz-button score-button' onClick={handleBackToHome} >Back To Home</button>
        </div>
      </div>
    )
  }
}

export default QuizFinalize