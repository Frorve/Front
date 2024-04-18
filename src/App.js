import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/loginForm/LoginForm';
import MainPage from './components/main/MainPage';
import Register from './components/register/Register';
import MainPage2 from './components/main/pruebas/MainPage2';
import LoginForm2 from './components/loginForm/LoginForm2';
import Register2 from './components/register/Register2';
import AboutContact from './components/main/pruebas/AboutContact';
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
          <Route path="/main2/" element={<MainPage2/>} />
          <Route path="/login2/" element={<LoginForm2/>} />
          <Route path="/register2/" element={<Register2/>} />
          <Route path="/about" element={<AboutContact/>} />
          <Route path="/recuperar" element={<Forget/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
