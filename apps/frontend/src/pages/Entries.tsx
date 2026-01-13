import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CoffeeEntry } from '@coffee/shared';
import { useAuth } from '../context/AuthContext';
import { entriesService } from '../services/entries.service';
import CoffeeEntryForm from '../components/CoffeeEntryForm';
import EntryList from '../components/EntryList';

export default function Entries() {
  const [entries, setEntries] = useState<CoffeeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEntrySuccess = () => {
    fetchEntries();
  };

  return (
    <div className="min-h-screen bg-[#FEFAF4]">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Sipsip</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Add Coffee Entry
              </h2>
              <CoffeeEntryForm onSuccess={handleEntrySuccess} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Coffee History
              </h2>
              <p className="text-sm text-gray-600">
                Total entries: {entries.length}
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-6">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading entries...</p>
              </div>
            ) : (
              <EntryList entries={entries} onUpdate={fetchEntries} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
