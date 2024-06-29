import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { blogPostPaths, metadataPaths } from '../constants';

// Fetch Markdown content
async function fetchMarkdown(filePath) {
  const response = await fetch(filePath);
  const text = await response.text();
  return text;
}

// Fetch JSON metadata
async function fetchJson(filePath) {
  const response = await fetch(filePath);
  const json = await response.json();
  return json;
}

function BlogPostPage() {
  const { id } = useParams();
  const [blogContent, setBlogContent] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [copyStatus, setCopyStatus] = useState({});

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

  const handleCopy = (content, index) => {
    navigator.clipboard.writeText(content);
    setCopyStatus((prevStatus) => ({
      ...prevStatus,
      [index]: 'Copied!'
    }));
    setTimeout(() => {
      setCopyStatus((prevStatus) => ({
        ...prevStatus,
        [index]: 'Copy'
      }));
    }, 3000);
  };

  const components = {
    h1({ children }) { return <h1 className="text-4xl font-bold mb-2">{children}</h1>; },
    h2({ children }) { return <h2 className="text-3xl font-bold mb-2">{children}</h2>; },
    h3({ children }) { return <h3 className="text-2xl font-bold mb-2">{children}</h3>; },
    h4({ children }) { return <h4 className="text-xl font-bold mb-2">{children}</h4>; },
    h5({ children }) { return <h5 className="text-lg font-bold mb-2">{children}</h5>; },
    h6({ children }) { return <h6 className="text-base font-bold mb-2">{children}</h6>; },
    ul({ children }) { return <ul className="list-disc pl-5">{children}</ul>; },
    ol({ children }) { return <ol className="list-decimal pl-5">{children}</ol>; },
    a({ href, children }) { return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 hover:underline">{children}</a>},
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const index = node.position.start.line;
      return !inline ? (
        <div className="relative my-4">
          <button
            className="absolute top-2 right-2 bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded hover:bg-gray-300 transition duration-200"
            onClick={() => handleCopy(String(children).trim(), index)}
          >
            {copyStatus[index] || 'Copy'}
          </button>
          <SyntaxHighlighter style={atomDark} language={match ? match[1] : null} PreTag="div" {...props}>
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  if (!metadata) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <div className="text-gray-500 text-sm mb-1">
          {metadata.date}, by {metadata.authors.join(' and ')}
        </div>
        <h1 className="text-4xl font-bold mb-2 uppercase">{metadata.title}</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <img src="/icons/category.svg" alt="Category" className="w-4 h-4" />
            <span>{metadata.topic}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <img src="/icons/github-logo.svg" alt="GitHub" className="w-4 h-4" />
            <a href={metadata.githubRepo} target="_blank" rel="noopener noreferrer">
              {metadata.githubRepo}
            </a>
          </div>
        </div>
      </div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkEmoji]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {blogContent}
      </ReactMarkdown>
      <Link to="/" className="text-gray-600 hover:text-black mt-4 inline-block">
        <img src="/icons/left-arrow-home.svg" alt="Back" className="w-6 h-6 inline mr-2" />
        Back to Home
      </Link>
    </div>
  );
}

export default BlogPostPage;