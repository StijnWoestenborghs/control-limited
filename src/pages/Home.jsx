import React from 'react';

function Home() {
    return (
        <div className="container mx-auto p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start">
                <div className="md:w-2/4 md:pr-8">
                    <h1 className="text-5xl font-bold mb-4 flex items-center">
                        Hello World! 
                        <img src="/icons/waving_hand_animated.gif" alt="wave" className="w-12 h-12 ml-2 inline" />
                    </h1>
                    <p className="text-lg mb-4">
                        Perhaps you agree that it is the task of an engineer to perceive, understand and <strong>control</strong> his environment. However, reality remains unpredictable, <strong>noisy</strong> and full of unexpected influences. So how can we manipulate a system to <strong>the best of our ability?</strong> An interesting question with many answers.
                    </p>
                    <p className="text-lg mb-4">
                        My name is <strong>Stijn Woestenborghs</strong>. I am an engineer at Sony with a MSc in Control Engineering and Automation. I am genuinely passionate about the myriad of advanced technologies that exist today and I get excited to see how they affect the lives of others.
                    </p>
                    <p className="text-lg mb-4">
                        With this site I would like to share with you what I have learned or what inspires me. I want to touch upon the subjects that interest me most and go deep into the implementation that lies at the core of a solution.
                    </p>
                    <p className="text-lg mb-4">
                        After all, something remains <em>just a theory</em> before it gets actually <strong>deployed</strong>. <span role="img" aria-label="rocket">🚀</span>
                    </p>
                    <div className="flex space-x-4 mt-6">
                        <button className="bg-black text-white px-6 py-2 rounded-full">Read</button>
                        <button className="border border-black text-black px-6 py-2 rounded-full">Contact</button>
                    </div>
                </div>
                <div className="md:w-1/3 mt-8 md:mt-0 flex items-center justify-center">
                    <img src="/profile.jpg" alt="Stijn Woestenborghs" className="rounded-lg w-full max-w-sm"/>
                </div>
            </div>
        </div>
    );
}

export default Home;
