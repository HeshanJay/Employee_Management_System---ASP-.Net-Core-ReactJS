import './App.css';
import EmpCRUD from './Components/EmpCRUD';
import DepCRUD from './Components/DepCRUD';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route exact path="/"
            element={<EmpCRUD />} />
          <Route exact path="/departments"
            element={<DepCRUD />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
