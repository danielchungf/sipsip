import { useState } from 'react';
import type { CoffeeType, CoffeeSize, CoffeeEntry } from '@coffee/shared';
import { COFFEE_TYPES, COFFEE_SIZES } from '@coffee/shared';
import { entriesService } from '../services/entries.service';

interface CoffeeEntryFormProps {
  onSuccess: () => void;
  editEntry?: CoffeeEntry;
  onCancel?: () => void;
}

export default function CoffeeEntryForm({ onSuccess, editEntry, onCancel }: CoffeeEntryFormProps) {
  const [type, setType] = useState<CoffeeType>(editEntry?.type || 'LATTE');
  const [size, setSize] = useState<CoffeeSize>(editEntry?.size || 'MEDIUM');
  const [notes, setNotes] = useState(editEntry?.notes || '');
  const [consumedAt, setConsumedAt] = useState(
    editEntry?.consumedAt
      ? new Date(editEntry.consumedAt).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        type,
        size,
        notes: notes || undefined,
        consumedAt: new Date(consumedAt).toISOString(),
      };

      if (editEntry) {
        await entriesService.updateEntry(editEntry.id, data);
      } else {
        await entriesService.createEntry(data);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || `Failed to ${editEntry ? 'update' : 'create'} entry`);
    } finally {
      setLoading(false);
    }
  };

  const formatLabel = (value: string): string => {
    return value.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Coffee Type
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as CoffeeType)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-coffee-500 focus:border-coffee-500 sm:text-sm"
        >
          {COFFEE_TYPES.map((coffeeType) => (
            <option key={coffeeType} value={coffeeType}>
              {formatLabel(coffeeType)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="size" className="block text-sm font-medium text-gray-700">
          Size
        </label>
        <select
          id="size"
          value={size}
          onChange={(e) => setSize(e.target.value as CoffeeSize)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-coffee-500 focus:border-coffee-500 sm:text-sm"
        >
          {COFFEE_SIZES.map((coffeeSize) => (
            <option key={coffeeSize} value={coffeeSize}>
              {formatLabel(coffeeSize)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="consumedAt" className="block text-sm font-medium text-gray-700">
          Date & Time
        </label>
        <input
          type="datetime-local"
          id="consumedAt"
          value={consumedAt}
          onChange={(e) => setConsumedAt(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-coffee-500 focus:border-coffee-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={500}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-coffee-500 focus:border-coffee-500 sm:text-sm"
          placeholder="Add any notes about this coffee..."
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-coffee-600 hover:bg-coffee-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coffee-500 disabled:opacity-50"
        >
          {loading ? (editEntry ? 'Updating...' : 'Adding...') : (editEntry ? 'Update Entry' : 'Add Entry')}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coffee-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
