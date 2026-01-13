import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { entriesService } from '../services/entries.service';

type CupState = 'empty' | 'logging' | 'filled';

export function useCoffeeLog() {
  const [cupState, setCupState] = useState<CupState>('empty');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const logCoffee = async () => {
    if (cupState === 'logging') return; // Prevent duplicate clicks

    setCupState('logging');
    setError(null);

    try {
      await entriesService.createEntry({
        type: 'LATTE',
        size: 'MEDIUM',
        consumedAt: new Date().toISOString(),
      });

      setCupState('filled');

      // Show "Sip logged!" message for 3 seconds before redirecting
      setTimeout(() => {
        navigate('/progress');
      }, 3000);
    } catch (err: any) {
      setCupState('empty');
      setError(err.response?.data?.error || 'Failed to log coffee. Please try again.');
    }
  };

  return {
    cupState,
    error,
    logCoffee,
  };
}
