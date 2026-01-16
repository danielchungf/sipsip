import { useState, useEffect } from 'react';
import type { CoffeeType, CoffeeSize, CoffeeEntry, CustomCoffeeType, Companion } from '@coffee/shared';
import { COFFEE_TYPES, COFFEE_SIZES } from '@coffee/shared';
import { entriesService } from '../services/entries.service';
import { customTypesService } from '../services/customTypes.service';
import { companionsService } from '../services/companions.service';
import SelectWithCreate from './SelectWithCreate';
import MultiSelectWithCreate from './MultiSelectWithCreate';

interface CoffeeEntryFormProps {
  onSuccess: () => void;
  editEntry?: CoffeeEntry;
  onCancel?: () => void;
}

export default function CoffeeEntryForm({ onSuccess, editEntry, onCancel }: CoffeeEntryFormProps) {
  // Determine initial type value: custom type ID or default type
  const getInitialTypeValue = () => {
    if (editEntry?.customTypeId) {
      return `custom:${editEntry.customTypeId}`;
    }
    return editEntry?.type || 'LATTE';
  };

  const [typeValue, setTypeValue] = useState<string>(getInitialTypeValue());
  const [size, setSize] = useState<CoffeeSize>(editEntry?.size || 'MEDIUM');
  const [notes, setNotes] = useState(editEntry?.notes || '');
  const [consumedAt, setConsumedAt] = useState(
    editEntry?.consumedAt
      ? new Date(editEntry.consumedAt).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );
  const [companionIds, setCompanionIds] = useState<string[]>(
    editEntry?.companions?.map((c) => c.id) || []
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Data for dropdowns
  const [customTypes, setCustomTypes] = useState<CustomCoffeeType[]>([]);
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Helper to format enum values for display
  const formatLabel = (value: string): string => {
    return value
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Fetch custom types and companions on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [types, comps] = await Promise.all([
          customTypesService.getCustomTypes(),
          companionsService.getCompanions(),
        ]);
        setCustomTypes(types);
        setCompanions(comps);
      } catch (err) {
        console.error('Failed to fetch dropdown data:', err);
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  // Build type options: default types + custom types
  const typeOptions = [
    ...COFFEE_TYPES.map((t) => ({
      value: t,
      label: formatLabel(t),
    })),
    ...customTypes.map((ct) => ({
      value: `custom:${ct.id}`,
      label: ct.name,
    })),
  ];

  // Build companion options
  const companionOptions = companions.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const handleCreateCustomType = async (name: string): Promise<string> => {
    const newType = await customTypesService.createCustomType({ name });
    setCustomTypes((prev) => [...prev, newType].sort((a, b) => a.name.localeCompare(b.name)));
    return `custom:${newType.id}`;
  };

  const handleCreateCompanion = async (name: string): Promise<string> => {
    const newCompanion = await companionsService.createCompanion({ name });
    setCompanions((prev) => [...prev, newCompanion].sort((a, b) => a.name.localeCompare(b.name)));
    return newCompanion.id;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Parse type value to determine if it's a default type or custom type
      const isCustomType = typeValue.startsWith('custom:');
      const data = {
        type: isCustomType ? undefined : (typeValue as CoffeeType),
        customTypeId: isCustomType ? typeValue.replace('custom:', '') : undefined,
        size,
        notes: notes || undefined,
        consumedAt: new Date(consumedAt).toISOString(),
        companionIds: companionIds.length > 0 ? companionIds : undefined,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <SelectWithCreate
        id="type"
        label="Coffee Type"
        options={typeOptions}
        value={typeValue}
        onChange={setTypeValue}
        onCreateNew={handleCreateCustomType}
        placeholder="Select a coffee type..."
        createLabel="+ Add custom type..."
        isLoading={dataLoading}
      />

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

      <MultiSelectWithCreate
        id="companions"
        label="Shared with (optional)"
        options={companionOptions}
        selectedValues={companionIds}
        onChange={setCompanionIds}
        onCreateNew={handleCreateCompanion}
        placeholder="Who did you share this coffee with?"
      />

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
