import { useAuth } from '../context/AuthContext';
import { getGreetingText } from '../utils/greetings';
import { useCoffeeLog } from '../hooks/useCoffeeLog';

export default function Home() {
  const { user } = useAuth();
  const { cupState, error, logCoffee } = useCoffeeLog();

  const cupImage = cupState === 'filled' ? '/cup-filled.png' : '/cup-empty.png';
  const isInteractive = cupState !== 'logging';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FEFAF4] px-6">
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
      <p className="text-[24px] text-neutral-800 text-center mb-8 transition-all duration-700 ease-in-out" style={{ fontFamily: '"Young Serif", serif', fontWeight: 400 }}>
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
