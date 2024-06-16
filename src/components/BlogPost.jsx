import React from 'react';
import { Link } from 'react-router-dom';

function BlogPost({ id, date, topic, authors, title, shortIntro }) {
    return (
        <Link to={`/blog/${id}`} className="block px-4 py-6 mx-50px hover:bg-gray-100 transition duration-300">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-sm text-gray-600 mb-2">{date} - <span className="italic">topic:</span> {topic}</p>
            <p className="text-sm text-gray-800 mb-4">{shortIntro}</p>
        </Link>
    );
}

export default BlogPost;