import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BlogPostPage from './pages/BlogPostPage';

function App() {
    return (
        <>
            <div className="mx-[4rem] sm:mx-[8rem] md:mx-[12rem] lg:mx-[16rem] xl:mx-[20rem] shadow-md font-inconsolata"> 
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path="/blog/:id" element={<BlogPostPage />} />
                    </Routes>
                    <Footer />
                </Router>
            </div>
        </>
    );
}

export default App;
