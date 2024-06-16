import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
    return (
        <>
            <div className="mx-[4rem] sm:mx-[8rem] md:mx-[12rem] lg:mx-[16rem] xl:mx-[20rem] font-inconsolata"> 
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path='/' element={<Home />} />
                    </Routes>
                </Router>
            </div>
        </>
    );
}

export default App;
