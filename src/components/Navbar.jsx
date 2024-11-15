import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <>
            <nav className="bg-white p-4">
                <div className="container mx-auto flex items-center">
                    <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-black">
                        <img src={`./assets/ctrl-logo.svg`} alt="Home" className="w-10 h-10" />
                        <span>Control</span>
                    </Link>
                    <div className="flex ml-auto space-x-4">
                        <a href="https://www.linkedin.com/in/stijnwoestenborghs/" target="_blank" rel="noopener noreferrer">
                            <img src={`./assets/linkedin-logo.svg`} alt="LinkedIn" className="w-10 h-10" />
                        </a>
                        <a href="https://github.com/StijnWoestenborghs" target="_blank" rel="noopener noreferrer">
                            <img src={`./assets/github-logo.svg`} alt="GitHub" className="w-10 h-10" />
                        </a>
                    </div>
                </div>
            </nav>
            <hr className="border-gray-200 mt-2 mx-4" />
        </>
    );
}

export default Navbar;
