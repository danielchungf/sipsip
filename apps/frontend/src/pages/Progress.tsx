import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { entriesService } from '../services/entries.service';
import type { CoffeeEntry } from '@coffee/shared';
import AddEntryModal from '../components/AddEntryModal';

export default function Progress() {
  const { user: _user } = useAuth();
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

  // For month view, calculate the starting day of week and create a calendar grid
  const calendarGrid = viewMode === 'month' ? (() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    let startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Convert to Monday-first week (Monday = 0, Sunday = 6)
    startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    // Create array with empty slots for days before the month starts
    const grid = [];

    // Add empty slots for days before the 1st
    for (let i = 0; i < startingDayOfWeek; i++) {
      grid.push({ day: null, hasEntry: false });
    }

    // Add all days of the month
    grid.push(...daysGrid);

    return grid;
  })() : daysGrid;

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
      <h1 className="text-[60px] font-medium text-neutral-800 mb-2" style={{ fontFamily: 'Rubik, sans-serif' }}>
        {filteredEntries.length}
      </h1>

      {/* Subtitle */}
      <p className="text-[24px] text-neutral-800 mb-10" style={{ fontFamily: '"Young Serif", serif', fontWeight: 'normal' }}>
        {filteredEntries.length === 1 ? 'cup' : 'cups'} of coffee this{' '}
        <button
          onClick={() => setViewMode(viewMode === 'month' ? 'year' : 'month')}
          className="underline hover:text-neutral-600 transition-colors"
        >
          {viewMode === 'month' ? 'month' : 'year'}
        </button>
      </p>

      {/* Coffee Beans Grid */}
      {viewMode === 'month' ? (
        <div className="mb-10 flex flex-wrap justify-start gap-[2px] w-[152px]">
          {calendarGrid.map((item, idx) => (
            item.day !== null ? (
              <img
                key={idx}
                src="/bean.png"
                alt={`Day ${item.day}`}
                className="w-5 h-5"
                style={{ opacity: item.hasEntry ? 1 : 0.1 }}
              />
            ) : (
              <div key={idx} className="w-5 h-5" />
            )
          ))}
        </div>
      ) : (
        <div className="mb-10 flex flex-wrap justify-start gap-[2px] w-[350px]">
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
      )}

      {/* Log Another Sip Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-1 text-neutral-800 hover:text-neutral-600 transition-colors group"
      >
        <div className="relative w-11 h-11">
          <img
            src="/cup-empty.png"
            alt="Empty cup"
            className="w-11 h-11 absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
          />
          <img
            src="/cup-filled.png"
            alt="Filled cup"
            className="w-11 h-11 absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          />
        </div>
        <span className="text-[20px] px-1" style={{ fontFamily: '"Young Serif", serif', fontWeight: 'normal' }}>
          Log another sip
        </span>
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-6 max-w-md w-full rounded-lg bg-red-50 p-4 text-center">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Log Another Sip Modal */}
      <AddEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleEntrySuccess}
      />
    </div>
  );
}
