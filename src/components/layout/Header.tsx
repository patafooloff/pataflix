import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Film, Tv, Home } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when location changes
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background shadow-md' : 'bg-gradient-to-b from-black/90 to-transparent'
    }`}>
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <Film className="w-8 h-8 text-primary mr-2" />
          <span className="text-xl font-bold">StreamFlix</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" icon={<Home className="w-4 h-4 mr-2" />} label="Home" />
          <NavLink to="/movies" icon={<Film className="w-4 h-4 mr-2" />} label="Movies" />
          <NavLink to="/series" icon={<Tv className="w-4 h-4 mr-2" />} label="TV Series" />
        </nav>

        {/* Search & Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleSearchClick}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <button 
            className="md:hidden p-2 rounded-full hover:bg-secondary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container py-4 flex flex-col space-y-4">
            <MobileNavLink to="/" icon={<Home className="w-5 h-5 mr-3" />} label="Home" />
            <MobileNavLink to="/movies" icon={<Film className="w-5 h-5 mr-3" />} label="Movies" />
            <MobileNavLink to="/series" icon={<Tv className="w-5 h-5 mr-3" />} label="TV Series" />
          </div>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
        isActive ? 'text-primary' : 'text-foreground/70'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
};

const MobileNavLink: React.FC<NavLinkProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center py-2 text-lg font-medium ${
        isActive ? 'text-primary' : 'text-foreground/70'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
};

export default Header;