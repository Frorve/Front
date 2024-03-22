import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/loginForm/LoginForm';
import MainPage from './components/main/MainPage';
import Register from './components/register/Register';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm />} /> {/* Ruta por defecto */}
          <Route path="/login" element={<LoginForm/>} />
          <Route path="/main/:username" element={<MainPage/>} />
          <Route path="/register" element={<Register/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
