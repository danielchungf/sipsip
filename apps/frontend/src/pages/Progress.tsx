import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { entriesService } from '../services/entries.service';
import type { CoffeeEntry } from '@coffee/shared';
import AddEntryModal from '../components/AddEntryModal';

export default function Progress() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<CoffeeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  const fetchEntries = async () => {
    try {
      setError('');
      const data = await entriesService.getEntries();
      setEntries(data.entries);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Get current date info
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Filter entries based on view mode
  const filteredEntries = viewMode === 'month'
    ? entries.filter(entry => {
        const entryDate = new Date(entry.consumedAt);
        return entryDate.getFullYear() === currentYear && entryDate.getMonth() === currentMonth;
      })
    : entries.filter(entry => {
        const entryDate = new Date(entry.consumedAt);
        return entryDate.getFullYear() === currentYear;
      });

  // Calculate number of days to display
  const totalDays = viewMode === 'month'
    ? new Date(currentYear, currentMonth + 1, 0).getDate()
    : 365;

  // Create array of days with their entry status
  const daysGrid = Array.from({ length: totalDays }, (_, i) => {
    const dayNumber = i + 1;

    if (viewMode === 'month') {
      const hasEntry = filteredEntries.some(entry => {
        const entryDate = new Date(entry.consumedAt);
        return entryDate.getDate() === dayNumber;
      });
      return { day: dayNumber, hasEntry };
    } else {
      // For year view, check if this day of year has an entry
      const hasEntry = filteredEntries.some(entry => {
        const entryDate = new Date(entry.consumedAt);
        const startOfYear = new Date(currentYear, 0, 1);
        const dayOfYear = Math.floor((entryDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return dayOfYear === dayNumber;
      });
      return { day: dayNumber, hasEntry };
    }
  });

  const handleEntrySuccess = () => {
    fetchEntries();
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFAF4]">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FEFAF4] px-6 py-12">
      {/* Count Display */}
      <h1 className="text-[60px] font-bold text-neutral-800 mb-2" style={{ fontFamily: '"Young Serif", serif' }}>
        {filteredEntries.length}
      </h1>

      {/* Subtitle */}
      <p className="text-[24px] text-neutral-800 mb-10" style={{ fontFamily: '"Young Serif", serif', fontWeight: 400 }}>
        cups of coffee this{' '}
        <button
          onClick={() => setViewMode(viewMode === 'month' ? 'year' : 'month')}
          className="underline hover:text-neutral-600 transition-colors"
        >
          {viewMode === 'month' ? 'month' : 'year'}
        </button>
      </p>

      {/* Coffee Beans Grid */}
      <div className="mb-10 flex flex-wrap justify-start w-[320px]">
        {daysGrid.map(({ day, hasEntry }) => (
          <img
            key={day}
            src="/bean.png"
            alt={`Day ${day}`}
            className="w-5 h-5"
            style={{ opacity: hasEntry ? 1 : 0.1 }}
          />
        ))}
      </div>

      {/* Add Entry Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 text-[20px] text-neutral-800 underline hover:text-neutral-600 transition-colors"
        style={{ fontFamily: '"Young Serif", serif', fontWeight: 400 }}
      >
        <img
          src="/cup-filled.png"
          alt="Add entry"
          className="w-11 h-11"
        />
        Add entry
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-6 max-w-md w-full rounded-lg bg-red-50 p-4 text-center">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Add Entry Modal */}
      <AddEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleEntrySuccess}
      />
    </div>
  );
}
