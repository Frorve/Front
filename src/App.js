import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/loginForm/LoginForm';
import MainPage from './components/main/MainPage';
import Register from './components/register/Register';
import AboutContact from './components/main/about/AboutContact';
import Forget from './components/forget/Forget'
import 'tailwindcss/tailwind.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm/>} />
          <Route path="/react-project" element={<LoginForm/>} />
          <Route path="/main/:username" element={<MainPage/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/about" element={<AboutContact/>} />
          <Route path="/recuperar" element={<Forget/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
