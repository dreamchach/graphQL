import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Movie from "./routes/Movie";
import Movies from "./routes/Movies";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Movies />} />
        <Route path='/movies/:id' element={<Movie/>}/>
      </Routes>
    </Router>
  );
}

export default App;
