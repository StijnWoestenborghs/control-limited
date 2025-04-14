import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function BlogPost({ id, date, topic, title, shortIntro, image }) {

    return (
        <Link 
            to={`/${id}`} 
            className="group grid grid-cols-[80px_1fr] gap-4 p-4 rounded-lg transition-colors cursor-pointer hover:[background-color:var(--color-background-secondary)]"
        >
            {/* Image Column */}
            <div className="w-[80px] h-[80px] rounded-lg overflow-hidden">
                <img 
                    src={image} 
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content Column */}
            <div>
                {/* Title */}
                <h2 className="text-xl font-medium text-primary group-hover:[color:var(--color-primary)]">
                    {title}
                </h2>

                {/* Date and Topic */}
                <div className="flex items-center gap-3">
                    <div className="text-sm text-secondary uppercase tracking-wider">
                        {date}
                    </div>
                    <span className="px-3 py-1 text-sm rounded-full text-primary skill">
                        {topic}
                    </span>
                </div>

                {/* Short Intro */}
                <p className="text-secondary leading-relaxed">
                    {shortIntro}
                </p>
            </div>
        </Link>
    );
}

BlogPost.propTypes = {
    id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    topic: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    shortIntro: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
};

export default BlogPost;
