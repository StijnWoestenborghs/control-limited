import React, { useState, useEffect } from 'react';

const CoffeeCounter = () => {
    const [displayCount, setDisplayCount] = useState(0);
    
    // Calculate total coffee consumption based on birth year (1998)
    const calculateTotalCoffee = () => {
        const birthYear = 1998;
        const currentYear = new Date().getFullYear();
        const yearsDrinking = currentYear - (birthYear + 15); // Assuming started at 15
        const daysDrinking = yearsDrinking * 365;
        const cupsPerDay = 2;
        
        // Total in liters
        return (daysDrinking * cupsPerDay);
    };

    useEffect(() => {
        const totalCoffee = calculateTotalCoffee();
        let currentCount = 0;
        const duration = 2000; // Animation duration in ms
        const steps = 60; // Number of steps in animation
        const increment = totalCoffee / steps;
        const interval = duration / steps;

        const timer = setInterval(() => {
            currentCount += increment;
            if (currentCount >= totalCoffee) {
                currentCount = totalCoffee;
                clearInterval(timer);
            }
            setDisplayCount(currentCount);
        }, interval);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="pb-6">
            <a 
                href="https://buymeacoffee.com/stijnwoestenborghs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-secondary skill hover:text-primary transition-colors duration-200 cursor-pointer inline-flex items-center"
            >
                <img src="./assets/coffee.png" alt="coffee" className="inline w-4 h-4 mr-1" /> {displayCount.toFixed(0)} cups of coffee
            </a>
        </div>
    );
};

export default CoffeeCounter; 