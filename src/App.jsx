import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BlogPostPage from './pages/BlogPostPage';

function App() {
    return (
        <>
            <div className="font-inconsolata"> 
                <Router basename='/control-limited/'>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path="/:id" element={<BlogPostPage />} />
                    </Routes>
                </Router>
            </div>
        </>
    );
}

export default App;
