import logo from './logo.svg';
import './App.css';
import {
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Home from './page/Home/Home';
import Login from './page/Login/Login';
import Quiz from './page/Quiz/Quiz';
import QuizFinalize from './page/Quiz/QuizFinalize';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Route path */}
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/quiz" element={<Quiz/>}></Route>
          <Route path="/quiz/finalize" element={<QuizFinalize/>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
