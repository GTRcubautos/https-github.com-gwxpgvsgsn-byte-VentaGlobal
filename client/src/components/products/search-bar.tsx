import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

export default function SearchBar({ 
  placeholder = "Buscar productos...", 
  onSearch, 
  className = "" 
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className={`flex max-w-md mx-auto ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="rounded-r-none flex-1"
        data-testid="search-input"
      />
      <Button
        type="submit"
        className="bg-primary hover:bg-primary/90 rounded-l-none"
        data-testid="search-button"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
