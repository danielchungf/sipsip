import { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectWithCreateProps {
  id: string;
  label: string;
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  onCreateNew: (name: string) => Promise<string>; // Returns the new option value
  placeholder?: string;
}

export default function MultiSelectWithCreate({
  id,
  label,
  options,
  selectedValues,
  onChange,
  onCreateNew,
  placeholder = 'Add companions...',
}: MultiSelectWithCreateProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const handleCreate = async () => {
    if (!newValue.trim()) return;

    setCreating(true);
    setError('');
    try {
      const newOptionValue = await onCreateNew(newValue.trim());
      // Auto-select the newly created companion
      onChange([...selectedValues, newOptionValue]);
      setNewValue('');
      setIsCreating(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create');
    } finally {
      setCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreate();
    } else if (e.key === 'Escape') {
      setIsCreating(false);
      setNewValue('');
      setError('');
    }
  };

  const selectedOptions = options.filter((o) => selectedValues.includes(o.value));
  const unselectedOptions = options.filter((o) => !selectedValues.includes(o.value));

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* Selected chips */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedOptions.map((option) => (
            <span
              key={option.value}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-sm bg-coffee-100 text-coffee-800"
            >
              {option.label}
              <button
                type="button"
                onClick={() => toggleOption(option.value)}
                className="ml-1.5 text-coffee-600 hover:text-coffee-800 focus:outline-none"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Add new inline */}
      {isCreating ? (
        <div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="New companion name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-coffee-500 focus:border-coffee-500"
              autoFocus
            />
            <button
              type="button"
              onClick={handleCreate}
              disabled={creating || !newValue.trim()}
              className="px-3 py-2 bg-coffee-600 text-white rounded-md hover:bg-coffee-700 disabled:opacity-50 text-sm"
            >
              {creating ? '...' : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setNewValue('');
                setError('');
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {unselectedOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleOption(option.value)}
              className="px-2.5 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 text-gray-700"
            >
              + {option.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="px-2.5 py-1 text-sm border border-dashed border-gray-400 rounded-full hover:bg-gray-50 text-gray-600"
          >
            + New companion
          </button>
        </div>
      )}

      {selectedOptions.length === 0 && !isCreating && (
        <p className="mt-2 text-sm text-gray-500">{placeholder}</p>
      )}
    </div>
  );
}
