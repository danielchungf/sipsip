import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGreetingText } from '../utils/greetings';
import { useCoffeeLog } from '../hooks/useCoffeeLog';
import { entriesService } from '../services/entries.service';

export default function Home() {
  const { user } = useAuth();
  const { cupState, error, logCoffee } = useCoffeeLog();
  const navigate = useNavigate();

  useEffect(() => {
    const checkTodaysCoffee = async () => {
      try {
        // Get today's date range (start and end of day)
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();

        // Check if user has logged coffee today
        const response = await entriesService.getEntries({
          limit: 1,
          startDate: startOfDay,
          endDate: endOfDay,
        });

        // If user has already logged coffee today, redirect to progress
        if (response.entries.length > 0) {
          navigate('/progress', { replace: true });
        }
      } catch (err) {
        // If there's an error checking, just stay on home page
        console.error('Error checking today\'s coffee:', err);
      }
    };

    checkTodaysCoffee();
  }, [navigate]);

  const cupImage = cupState === 'filled' ? '/cup-filled.png' : '/cup-empty.png';
  const isInteractive = cupState !== 'logging';

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FEFAF4] px-6 overflow-hidden">
      {/* Greeting */}
      <h1 className="text-[36px] text-neutral-800 mb-5 text-center" style={{ fontFamily: '"Young Serif", serif', fontWeight: 500 }}>
        {getGreetingText(user?.username || 'Friend')}
      </h1>

      {/* Cup Image */}
      <button
        onClick={logCoffee}
        disabled={!isInteractive}
        className="mb-5 transition-all duration-500 ease-in-out hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none"
        aria-label="Log coffee"
      >
        <img
          src={cupImage}
          alt={cupState === 'filled' ? 'Filled coffee cup' : 'Empty coffee cup'}
          className="w-80 h-80 object-contain transition-opacity duration-700 ease-in-out"
        />
      </button>

      {/* CTA Text */}
      <p className="text-[24px] text-neutral-800 text-center mb-8 transition-all duration-700 ease-in-out" style={{ fontFamily: '"Young Serif", serif', fontWeight: 'normal' }}>
        {cupState === 'logging'
          ? 'Filling your cup...'
          : cupState === 'filled'
          ? 'Sip logged!'
          : 'Tap to fill today\'s cup of coffee'}
      </p>

      {/* Error Message */}
      {error && (
        <div className="max-w-md w-full rounded-lg bg-red-50 p-4 text-center">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
