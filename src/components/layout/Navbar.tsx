import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Sun, Moon, Users, Activity } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar = ({ activeTab, setActiveTab }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { name: 'Toss Analysis', icon: <BarChart3 size={18} /> },
    { name: 'Match Phase Analysis', icon: <Users size={18} /> },
    { name: 'Player Performance', icon: <Activity size={18} /> }
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-ipl-bg-card/80 backdrop-blur-lg border-b border-ipl-border shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ipl-primary to-ipl-primary-dark flex items-center justify-center shadow-lg shadow-ipl-primary/20">
            <span className="font-extrabold text-white text-xl tracking-tighter">IPL</span>
          </div>
          <span className="font-bold text-lg hidden sm:block text-ipl-text">MATCH ANALYTICS</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-full border border-ipl-border">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`relative px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-colors ${
                activeTab === item.name ? 'text-white' : 'text-ipl-text-muted hover:text-ipl-text'
              }`}
            >
              {activeTab === item.name && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-ipl-primary/20 rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {item.icon}
                <span className="hidden md:block">{item.name}</span>
              </span>
            </button>
          ))}
          
          <button 
            onClick={toggleTheme}
            className="ml-2 p-2 rounded-full text-ipl-text-muted hover:text-ipl-text hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
};
