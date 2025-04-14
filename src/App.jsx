import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BlogPostPage from './pages/BlogPostPage';
import { ThemeProvider } from './context/ThemeContext';

function App() {
    return (
        <ThemeProvider>
            <div className="font-inconsolata mx-4 sm:mx-6 md:mx-8 lg:mx-12 my-8 sm:my-10 md:my-12">
                <Router basename='/'>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path="/:id" element={<BlogPostPage />} />
                    </Routes>
                </Router>
            </div>
        </ThemeProvider>
    );
}

export default App;
