import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { blogPostPaths, metadataPaths } from '../constants';
import FooterLinks from '../components/FooterLinks';
import { useTheme } from '../context/ThemeContext';

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
  const { darkMode, toggleDarkMode } = useTheme();

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
    <div className="min-h-screen bg-primary">
      <div className="flex flex-col lg:flex-row max-w-[2400px] mx-auto px-4 sm:px-8 md:px-12 lg:px-24 xl:px-32">
        {/* Left Column - Static */}
        <div className="w-full lg:w-1/3 lg:fixed lg:h-screen p-4 sm:p-8 md:p-12 lg:p-16 xl:p-20">
          <div className="h-full flex flex-col justify-between">
            {/* Profile Section */}
            <div>
              <h1 className="text-4xl font-bold mb-2 text-primary">Stijn Woestenborghs</h1>
              <p className="text-xl mb-6 text-primary">ML & Embedded Software Engineer</p>
              <p className="text-secondary mb-8 max-w-sm">
                I design complex algorithms and make them run on tiny devices.
                I like to think about a great user experience.
              </p>

              {/* Back Button */}
              <Link to="/" className="flex items-center text-primary mb-8 hover-primary transform transition-transform duration-200 hover:translate-x-1">
                <svg className="w-6 h-6 mr-2 text-current hover:text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H3m0 0l6-6m-6 6l6 6" />
                </svg>
                Back to Home
              </Link>
            </div>

            {/* Footer with Contact Links */}
            <div className="pt-2">
              <FooterLinks darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </div>
          </div>
        </div>

        {/* Right Column - Scrollable */}
        <div className="w-full lg:w-2/3 lg:ml-[33.333333%] p-4 sm:p-8 md:p-12 lg:p-16 xl:p-20">
          <div className="mb-8">
            <div className="text-gray-500 text-sm mb-1">
              {metadata.date}, by {metadata.authors.join(' and ')}
            </div>
            <h1 className="text-4xl font-bold mb-2 uppercase">{metadata.title}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <img src="./assets/category.svg" alt="Category" className="w-4 h-4" />
                <span>{metadata.topic}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
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
        </div>
      </div>
    </div>
  );
}

export default BlogPostPage;