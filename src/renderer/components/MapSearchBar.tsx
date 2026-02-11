import React, { useState } from 'react';

interface MapSearchBarProps {
  onSearch: (query: string) => void;
}

const MapSearchBar: React.FC<MapSearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] w-96">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜尋地點..."
          className="w-full px-4 py-3 pr-12 text-sm border border-slate-300 dark:border-border-dark rounded-lg bg-white dark:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-primary shadow-xl"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-slate-500 hover:text-primary transition-colors"
        >
          <span className="material-icons text-xl">search</span>
        </button>
      </form>
    </div>
  );
};

export default MapSearchBar;
