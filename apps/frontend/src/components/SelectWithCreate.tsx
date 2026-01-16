import { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectWithCreateProps {
  id: string;
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  onCreateNew: (name: string) => Promise<string>; // Returns the new option value
  placeholder?: string;
  createLabel?: string;
  isLoading?: boolean;
}

export default function SelectWithCreate({
  id,
  label,
  options,
  value,
  onChange,
  onCreateNew,
  placeholder = 'Select...',
  createLabel = 'Add new...',
  isLoading = false,
}: SelectWithCreateProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue === '__create__') {
      setIsCreating(true);
      setError('');
    } else {
      onChange(selectedValue);
    }
  };

  const handleCreate = async () => {
    if (!newValue.trim()) return;

    setCreating(true);
    setError('');
    try {
      const newOptionValue = await onCreateNew(newValue.trim());
      onChange(newOptionValue);
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

  if (isCreating) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`New ${label.toLowerCase()}`}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-coffee-500 focus:border-coffee-500 sm:text-sm"
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
    );
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={handleSelectChange}
        disabled={isLoading}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-coffee-500 focus:border-coffee-500 sm:text-sm"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        <option value="__create__">{createLabel}</option>
      </select>
    </div>
  );
}
