
import './App.css';
import { BrowserRouter as Router ,Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Navbar from './components/navbar';


function App() {
  return (
    <div className="App">
      <Navbar/>
      <Router>
        <Routes>
        <Route exact path="/register" element={<Register/>}></Route>
        <Route exact path="/login" element={<Login/>}></Route>
        </Routes>
    </Router>
    </div>
  );
}

export default App;
