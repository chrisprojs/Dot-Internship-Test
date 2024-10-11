import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Quiz.css";
import { type } from "@testing-library/user-event/dist/type";
import { useNavigate } from "react-router-dom";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0); // State for remaining time
  const [timerActive, setTimerActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // fetch the questions
    const fetchQuestions = async () => {
      const cachedQuestions = localStorage.getItem("questions");
      // if questions is saved in local storage then no need to get questions from api anymore, else request the questions
      if (cachedQuestions) {
        setQuestions(JSON.parse(cachedQuestions));
        setLoading(false);
      } else {
        try { 
          // fetch all questions then shuffle all answers
          const response = await axios.get(
            "https://opentdb.com/api.php?amount=10&type=multiple"
          );
          const fetchedQuestions = response.data.results.map((question) => {
            const allAnswers = [
              ...question.incorrect_answers,
              question.correct_answer,
            ];
            // shuffle all answers
            question.allAnswers = shuffleArray(allAnswers); // Shuffle answers
            return question;
          });

          // set questions to local storage
          setQuestions(fetchedQuestions);
          localStorage.setItem(
            "questions",
            JSON.stringify(response.data.results)
          );
          setLoading(false);
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      }
    };

    const fetchAnswer = () => {
      // fetch all answered questions from local storage
      const cachedAnswers = localStorage.getItem("answers");
      if (cachedAnswers) {
        const parsedAnswers = JSON.parse(cachedAnswers);
        setSelectedAnswers(parsedAnswers);
      }
    };

    fetchAnswer();
    fetchQuestions();
  }, []);

  useEffect(() => {
    // get the quiz end time then set remaining time
    const fetchTimer = () => {
      const endTime = localStorage.getItem("end-time");
      if (endTime) {
        const remaining = endTime - Date.now(); // formula: endTime - now
        if (remaining > 0) {
          setRemainingTime(remaining);
          setTimerActive(true);
        } else {
          // After remaining is less equal to 0 then automatically finalize the quiz
          alert("Time's up!");
          navigate("/quiz/finalize");
        }
      }
    };

    fetchTimer();
  }, [timerActive, remainingTime]);

  useEffect(() => {
    // Timer update logic
    if (timerActive) {
      const timerId = setInterval(() => {
        setRemainingTime((prevTime) => {
          const newTime = prevTime - 1000; // Decrease by 1 second
          if (newTime <= 0) {
            clearInterval(timerId);
            alert("Time's up!");
            // After remaining is less equal to 0 then automatically finalize the quiz
            navigate("/quiz/finalize");
            return 0;
          }
          return newTime;
        });
      }, 1000); // Update every second

      return () => clearInterval(timerId); // Cleanup on unmount
    }
  }, [timerActive]);

  const shuffleArray = (array) => {
    // shuffle questions answer
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // random index
      [array[i], array[j]] = [array[j], array[i]]; // swap
    }
    return array;
  };

  const handleAnswerSelect = (index, answer) => {
    // add selected answer to local storage
    const newSelectedAnswers = { ...selectedAnswers, [index]: answer };
    setSelectedAnswers(newSelectedAnswers);
    localStorage.setItem("answers", JSON.stringify(newSelectedAnswers));
  };

  // next question
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // prev question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // submit answers
  const handleSubmit = () => {
    navigate("/quiz/finalize");
  };

  if (loading) { // loading while fetching the questions
    return <div className="loading-container">Loading...</div>;
  } else if (!questions || questions.length === 0) { // if questions cannot be loaded then display error
    return <div className="quiz-error">No questions available.</div>;
  } else {
    const currentQuestion = questions[currentQuestionIndex];
    return (
      <div className="quiz-container">
        {/* remaining time left */}
        <div className="quiz-timer">
          <h2>Time Remaining: {Math.floor(remainingTime / 1000)} seconds</h2>
        </div>
        <div className="quiz-box" key={currentQuestionIndex}>
          <h2>
            {currentQuestionIndex + 1}.{" "}
            <span
              dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
            />
          </h2>
          <ul className="quiz-choices">
            {/* display current questions */}
            {currentQuestion.allAnswers
              .map((answer, i) => (
                <li className="quiz-choice" key={i}>
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={answer}
                    checked={selectedAnswers[currentQuestionIndex] === answer} /* if the selected answer 
                    equal to answer then the radio is pointed */
                    onChange={() =>
                      handleAnswerSelect(currentQuestionIndex, answer)
                    } // Update answer selection
                  />
                  <span dangerouslySetInnerHTML={{ __html: answer }} />
                </li>
              ))}
          </ul>
        </div>

        {/* command quiz buttons */}
        <div className="quiz-buttons">
          {/* button for previous question */}
          <button
            className={`quiz-button quiz-prev ${
              currentQuestionIndex === 0 ? "quiz-button-invisible" : ""
            }`}
            onClick={handlePrevious}
          >
            Previous
          </button>
          {/* button for next question */}
          <button
            className={`quiz-button quiz-next ${
              currentQuestionIndex === questions.length - 1
                ? "quiz-button-invisible"
                : ""
            }`}
            onClick={handleNext}
          >
            Next
          </button>
          {/* button for submit answer */}
          <button className={`quiz-button quiz-submit`} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default Quiz;
