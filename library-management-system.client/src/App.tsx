import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home/>}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;