import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Film, Tv, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NavigationProps {
  onSearch?: (query: string) => void;
}

const Navigation = ({ onSearch }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const navItems = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/movies', label: 'Films', icon: Film },
    { href: '/series', label: 'Séries', icon: Tv },
    { href: '/search', label: 'Recherche', icon: Search }
  ];

  return (
    <nav className="bg-netflix-dark backdrop-blur-md border-b border-netflix-light sticky top-0 z-50 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-netflix-red rounded-lg flex items-center justify-center">
              <Film className="w-5 h-5 text-netflix-text-primary" />
            </div>
            <span className="text-xl font-bold text-netflix-text-primary">
              Pataflix
            </span>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-netflix-red text-white' 
                      : 'text-white hover:text-white hover:bg-netflix-light'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Recherche */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2">
            <Input
              type="search"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 bg-netflix-light border-netflix-gray text-netflix-text-primary placeholder-netflix-text-secondary"
            />
            <Button type="submit" variant="ghost" size="icon" className="text-netflix-text-secondary hover:text-netflix-text-primary">
              <Search className="w-4 h-4" />
            </Button>
          </form>

          {/* Menu Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-netflix-text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-netflix-light animate-slide-in">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-netflix-red text-white' 
                        : 'text-white hover:text-white hover:bg-netflix-light'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <form onSubmit={handleSearch} className="flex items-center space-x-2 px-3 py-2">
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-netflix-light border-netflix-gray text-netflix-text-primary placeholder-netflix-text-secondary"
                />
                <Button type="submit" variant="ghost" size="icon" className="text-netflix-text-secondary hover:text-netflix-text-primary">
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
