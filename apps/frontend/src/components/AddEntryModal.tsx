import { useState } from 'react';
import { entriesService } from '../services/entries.service';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddEntryModal({ isOpen, onClose, onSuccess }: AddEntryModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create ISO string from selected date
      const selectedDate = new Date(date + 'T12:00:00');

      await entriesService.createEntry({
        type: 'LATTE',
        size: 'MEDIUM',
        consumedAt: selectedDate.toISOString(),
      });

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-medium mb-6 text-neutral-800" style={{ fontFamily: '"Young Serif", serif' }}>
          Add coffee entry
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-neutral-700 mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-neutral-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-neutral-800 text-white rounded-md hover:bg-neutral-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Adding...' : 'Add entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
