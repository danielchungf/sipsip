import { useState, useEffect } from 'react';
import type { CoffeeType, CoffeeSize, CustomCoffeeType, Companion } from '@coffee/shared';
import { COFFEE_TYPES } from '@coffee/shared';
import { entriesService } from '../services/entries.service';
import { customTypesService } from '../services/customTypes.service';
import { companionsService } from '../services/companions.service';
import SelectWithCreate from './SelectWithCreate';
import MultiSelectWithCreate from './MultiSelectWithCreate';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddEntryModal({ isOpen, onClose, onSuccess }: AddEntryModalProps) {
  const [typeValue, setTypeValue] = useState<string>('LATTE');
  const [size, setSize] = useState<CoffeeSize>('MEDIUM');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [companionIds, setCompanionIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  // Fetch custom types and companions when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setDataLoading(true);
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
  }, [isOpen]);

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

  const resetForm = () => {
    setTypeValue('LATTE');
    setSize('MEDIUM');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setCompanionIds([]);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create ISO string from selected date (at noon)
      const selectedDate = new Date(date + 'T12:00:00');

      // Parse type value to determine if it's a default type or custom type
      const isCustomType = typeValue.startsWith('custom:');

      await entriesService.createEntry({
        type: isCustomType ? undefined : (typeValue as CoffeeType),
        customTypeId: isCustomType ? typeValue.replace('custom:', '') : undefined,
        size,
        consumedAt: selectedDate.toISOString(),
        notes: notes || undefined,
        companionIds: companionIds.length > 0 ? companionIds : undefined,
      });

      resetForm();
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-[#FEFAF4]">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-medium mb-6 text-neutral-800" style={{ fontFamily: '"Young Serif", serif' }}>
          Log another cup of coffee
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          {/* Size field - commented out for now
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
          */}

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-coffee-500 focus:border-coffee-500 sm:text-sm"
            />
          </div>

          {/* Notes field - commented out for now
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              rows={2}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-coffee-500 focus:border-coffee-500 sm:text-sm"
              placeholder="Add any notes..."
            />
          </div>
          */}

          <MultiSelectWithCreate
            id="companions"
            label="Shared with (optional)"
            options={companionOptions}
            selectedValues={companionIds}
            onChange={setCompanionIds}
            onCreateNew={handleCreateCompanion}
            placeholder="Who did you share this coffee with?"
          />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
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
