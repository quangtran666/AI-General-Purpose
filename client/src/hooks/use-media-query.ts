import { useState, useEffect } from 'react';

const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        
        // Set initial value
        setMatches(media.matches);

        // Create event listener
        const listener = () => setMatches(media.matches);
        
        // Add listener
        media.addEventListener('change', listener);
        
        // Clean up
        return () => media.removeEventListener('change', listener);
    }, [query]);

    return matches;
};

export default useMediaQuery; 