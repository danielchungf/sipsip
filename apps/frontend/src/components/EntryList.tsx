import { useState } from 'react';
import type { CoffeeEntry } from '@coffee/shared';
import { entriesService } from '../services/entries.service';
import CoffeeEntryForm from './CoffeeEntryForm';

interface EntryListProps {
  entries: CoffeeEntry[];
  onUpdate: () => void;
}

export default function EntryList({ entries, onUpdate }: EntryListProps) {
  const [editingEntry, setEditingEntry] = useState<CoffeeEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    setDeletingId(id);
    try {
      await entriesService.deleteEntry(id);
      onUpdate();
    } catch (err) {
      alert('Failed to delete entry');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditSuccess = () => {
    setEditingEntry(null);
    onUpdate();
  };

  const formatLabel = (value: string): string => {
    return value
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Get display name for coffee type (custom or default)
  const getTypeName = (entry: CoffeeEntry): string => {
    if (entry.customType) {
      return entry.customType.name;
    }
    if (entry.type) {
      return formatLabel(entry.type);
    }
    return 'Unknown';
  };

  const formatDateTime = (date: string): string => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No coffee entries yet. Add your first one above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-white shadow rounded-lg p-6">
          {editingEntry?.id === entry.id ? (
            <CoffeeEntryForm
              editEntry={editingEntry}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingEntry(null)}
            />
          ) : (
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getTypeName(entry)}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-coffee-100 text-coffee-800">
                    {formatLabel(entry.size)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {entry.caffeine}mg caffeine
                  </span>
                  {entry.customType && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Custom
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {formatDateTime(entry.consumedAt)}
                </p>
                {entry.companions && entry.companions.length > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-500">Shared with:</span>
                    <div className="flex flex-wrap gap-1">
                      {entry.companions.map((companion) => (
                        <span
                          key={companion.id}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {companion.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {entry.notes && (
                  <p className="text-sm text-gray-700 mt-2 italic">
                    {entry.notes}
                  </p>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => setEditingEntry(entry)}
                  className="px-3 py-1 text-sm font-medium text-coffee-600 hover:text-coffee-700 border border-coffee-600 rounded-md hover:bg-coffee-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coffee-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                  className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 border border-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {deletingId === entry.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
