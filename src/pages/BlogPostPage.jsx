import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { blogPostPaths, metadataPaths } from '../constants';


async function fetchMarkdown(filePath) {
    const response = await fetch(filePath);
    const text = await response.text();
    return text;
}
  
async function fetchJson(filePath) {
    const response = await fetch(filePath);
    const json = await response.json();
    return json;
}


function BlogPostPage() {
    const { id } = useParams();
    const [blogContent, setBlogContent] = useState('');
    const [metadata, setMetadata] = useState(null);
  
    useEffect(() => {
      const loadContent = async () => {
        const filePath = blogPostPaths[id];
        const metadataPath = metadataPaths[id];
        if (filePath && metadataPath) {
          const content = await fetchMarkdown(filePath);
          const metadata = await fetchJson(metadataPath);
          setBlogContent(content);
          setMetadata(metadata);
        } else {
          setBlogContent('Blog post not found');
        }
      };
  
      loadContent();
    }, [id]);
  
    if (!metadata) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="container mx-auto p-8">
        <div className="mb-8">
          <div className="text-gray-500 text-sm mb-1">
            {metadata.date}, by {metadata.authors.join(' and ')}
          </div>
          <h1 className="text-4xl font-bold mb-2">{metadata.title}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-gray-600">
              <span className="material-icons">list</span>
              <span>{metadata.topic}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <span className="material-icons">code</span>
              <a href={metadata.githubRepo} target="_blank" rel="noopener noreferrer">
                {metadata.githubRepo}
              </a>
            </div>
          </div>
        </div>
        <ReactMarkdown>{blogContent}</ReactMarkdown>
        <Link to="/" className="text-gray-600 hover:text-black mt-4 inline-block">
          <span className="material-icons">arrow_back</span> Back to Home
        </Link>
      </div>
    );
  }
  
  export default BlogPostPage;
