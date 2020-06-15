import { useState, useEffect } from 'react';

function RowObserver(options, callback) {
    const [ref, setRef] = useState(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (visible !== entry.isIntersecting) {
                setVisible(entry.isIntersecting);
                if (entry.isIntersecting) {
                    console.log('callCallback')
                    // callback();
                }
            }
            
        }, options);
        if (ref) {
            observer.observe(ref);
        }

        return () => {
            if (ref) {
                observer.unobserve(ref)
            }
        }

    }, [ref, options])
    return [setRef, visible]
    
}

export default RowObserver;
