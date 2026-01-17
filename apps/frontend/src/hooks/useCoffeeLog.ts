import { useState } from 'react';

type CupState = 'empty' | 'logging' | 'filled';

export function useCoffeeLog() {
  const [cupState, setCupState] = useState<CupState>('empty');

  const fillCup = () => {
    if (cupState === 'logging') return; // Prevent duplicate clicks

    setCupState('logging');

    // Simulate filling animation, then show filled state
    setTimeout(() => {
      setCupState('filled');
    }, 800);
  };

  const resetCup = () => {
    setCupState('empty');
  };

  return {
    cupState,
    fillCup,
    resetCup,
  };
}
