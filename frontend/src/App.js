import './App.css';
import Nav from './Nav';
import Home from './Home';
import Activity from './Activity';
import Graph from './Graph'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path="/" element={<Nav />} /> 
        <Route path="/home" element={<Home />} /> 
        <Route path="/activity" element={<Activity />} /> 
        <Route path="/graph" element={<Graph />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
