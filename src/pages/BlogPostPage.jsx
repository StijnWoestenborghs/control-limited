import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';


const blogPostPaths = {
  'the-future-of-time-series-forecasting': '/blogs/the-future-of-time-series-forecasting/content.md',
  'sim2real-transfer-in-mechatronic-systems': '/blogs/sim2real-transfer-in-mechatronic-systems/content.md',
  'python-cpp-lets-talk': '/blogs/python-cpp-lets-talk/content.md',
  'unlocking-the-car-batterys-full-potential': '/blogs/unlocking-the-car-batterys-full-potential/content.md',
  'mojo-does-give-superpowers': '/blogs/mojo-does-give-superpowers/content.md',
};


async function fetchMarkdown(filePath) {
    const response = await fetch(filePath);
    const text = await response.text();
    return text;
}


function BlogPostPage() {
  const { id } = useParams();
  const [blogContent, setBlogContent] = useState('');

  useEffect(() => {
    const loadContent = async () => {
      const filePath = blogPostPaths[id];
      if (filePath) {
        const content = await fetchMarkdown(filePath);
        setBlogContent(content);
      } else {
        setBlogContent('Blog post not found');
      }
    };

    loadContent();
  }, [id]);

  return (
    <div className="container mx-auto p-8">
      <ReactMarkdown>{blogContent}</ReactMarkdown>
    </div>
  );
}

export default BlogPostPage;
