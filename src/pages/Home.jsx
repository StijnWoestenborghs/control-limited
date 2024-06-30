import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import BlogPost from '../components/BlogPost';
import { blogIds } from '../constants';


function Home() {
    const [blogs, setBlogs] = useState([]);

    async function fetchJson(filePath) {
        const response = await fetch(filePath);
        const json = await response.json();
        return json;
    }

    useEffect(() => {
      const fetchMetadata = async () => {
        const blogData = await Promise.all(
          blogIds.map(async id => {
            const metadata = await fetchJson(`/blogs/${id}/metadata.json`);
            return { id, ...metadata };
          })
        );
        setBlogs(blogData);
      };
  
      fetchMetadata();
    }, []);

    return (
        <div className="container mx-auto p-8">
            <div className="flex flex-col md:flex-row items-start md:space-x-8">
                <div className="md:w-1/2 md:pl-8">  {/* Added padding-left for more space */}
                    <h1 className="text-5xl font-bold mb-4 flex items-center">
                        Hello World! 
                        <img src="/icons/waving_hand_animated.gif" alt="wave" className="w-12 h-12 ml-2 inline" />
                    </h1>
                    <p className="text-l mb-4">
                        Perhaps you agree that it is the task of an engineer to perceive, understand and <strong>control</strong> his environment. However, reality remains unpredictable, <strong>noisy</strong> and full of unexpected influences. So how can we manipulate a system to <strong>the best of our ability?</strong> An interesting question with many answers.
                    </p>
                    <p className="text-l mb-4">
                        My name is <a href="https://www.linkedin.com/in/stijnwoestenborghs/" target="_blank" rel="noopener noreferrer"><strong>Stijn Woestenborghs</strong></a>. I am an engineer at Sony with a MSc in Control Engineering and Automation. I am genuinely passionate about the myriad of advanced technologies that exist today and I get excited to see how they affect the lives of others.
                    </p>
                    <p className="text-l mb-4">
                        With this site I would like to share with you what I have learned or what inspires me. I want to touch upon the subjects that interest me most and go deep into the implementation that lies at the core of a solution.
                    </p>
                    <p className="text-l mb-4">
                        After all, something remains <em>just a theory</em> before it gets actually <strong>deployed</strong>. <span role="img" aria-label="rocket">🚀</span>
                    </p>
                    <div className="flex space-x-4 mt-6">
                        <ScrollLink to="blog-posts" smooth={true} duration={500}>
                            <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-400 transition duration-300"><b>Read</b></button>
                        </ScrollLink>
                        <ScrollLink to="footer" smooth={true} duration={500}>
                            <button className="border border-black text-black px-6 py-2 rounded-full hover:bg-gray-400 hover:border-gray-400 hover:text-white transition duration-300"><b>Contact</b></button>
                        </ScrollLink>
                    </div>
                </div>
                <div className="md:w-1/2 mt-8 md:mt-0 flex items-center justify-center">
                    <img src="/profile.jpg" alt="Stijn Woestenborghs" className="rounded-lg w-full max-w-sm"/>
                </div>
            </div>
            <div className="mt-8" id="blog-posts">
                {blogs.map((blog, index) => (
                    <React.Fragment key={index}>
                        <BlogPost
                            id={blog.id}
                            date={blog.date}
                            topic={blog.topic}
                            title={blog.title}
                            shortIntro={blog.shortIntro}
                        />
                        {index < blogs.length - 1 && <hr className="border-gray-200 mt-2 mx-4" />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default Home;
