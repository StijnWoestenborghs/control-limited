import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function BlogPost({ id, date, topic, title, shortIntro }) {
    return (
        <Link to={`/${id}`} className="block px-4 py-6 mx-50px hover:bg-gray-100 transition duration-300">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-sm text-gray-600 mb-2">{date} - <span className="italic">topic:</span> {topic}</p>
            <p className="text-sm text-gray-800 mb-4">{shortIntro}</p>
        </Link>
    );
}

BlogPost.propTypes = {
    id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    topic: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    shortIntro: PropTypes.string.isRequired,
};

export default BlogPost;
