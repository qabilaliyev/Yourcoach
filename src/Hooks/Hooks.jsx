// src/hooks/Hooks.jsx
import { useState, useEffect } from 'react';

export function useHasPlan() {
    const [hasPlan, setHasPlan] = useState(false);

    const checkPlan = () => {
        try {
            const data = sessionStorage.getItem('calcData');
            setHasPlan(!!data && data !== 'null');
        } catch {
            setHasPlan(false);
        }
    };

    useEffect(() => {
        checkPlan();

        const handleStorage = () => checkPlan();
        window.addEventListener('storage', handleStorage);

        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return { hasPlan, refresh: checkPlan };
}