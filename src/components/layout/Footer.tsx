import React from 'react';
import { Film, Tv, Search, Github, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Film className="w-6 h-6 text-primary mr-2" />
              <span className="text-lg font-bold">StreamFlix</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your one-stop destination for streaming movies and TV series.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Navigate</h3>
            <ul className="space-y-2">
              <FooterLink to="/" icon={<Home className="w-4 h-4" />} label="Home" />
              <FooterLink to="/movies" icon={<Film className="w-4 h-4" />} label="Movies" />
              <FooterLink to="/series" icon={<Tv className="w-4 h-4" />} label="TV Series" />
              <FooterLink to="/search" icon={<Search className="w-4 h-4" />} label="Search" />
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Genres</h3>
            <ul className="space-y-2">
              <li><Link to="/movies?genre=28" className="text-sm text-muted-foreground hover:text-primary">Action</Link></li>
              <li><Link to="/movies?genre=35" className="text-sm text-muted-foreground hover:text-primary">Comedy</Link></li>
              <li><Link to="/movies?genre=18" className="text-sm text-muted-foreground hover:text-primary">Drama</Link></li>
              <li><Link to="/movies?genre=27" className="text-sm text-muted-foreground hover:text-primary">Horror</Link></li>
              <li><Link to="/movies?genre=10749" className="text-sm text-muted-foreground hover:text-primary">Romance</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">DMCA</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 StreamFlix. All rights reserved.
          </p>
          <div className="flex items-center mt-4 md:mt-0">
            <span className="text-sm text-muted-foreground flex items-center">
              Made with <Heart className="w-4 h-4 mx-1 text-primary" /> using TMDB API
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface FooterLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, icon, label }) => {
  return (
    <li>
      <Link to={to} className="text-sm text-muted-foreground hover:text-primary flex items-center">
        <span className="mr-2">{icon}</span> {label}
      </Link>
    </li>
  );
};

const Home = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

export default Footer;