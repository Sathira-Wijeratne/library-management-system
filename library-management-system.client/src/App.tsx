import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import { ResponsiveProvider } from './contexts/ResponsiveContext';

function App() {
    return (
        <ResponsiveProvider> 
            <div>
                <BrowserRouter>
                <Header/>
                    <Routes>
                        <Route path='/' element={<Home/>}></Route>
                        <Route path='/login' element={<Login/>}></Route>
                        <Route path='/register' element={<Register/>}></Route>
                    </Routes>
                </BrowserRouter>
            </div>
        </ResponsiveProvider>
    );
}

export default App;