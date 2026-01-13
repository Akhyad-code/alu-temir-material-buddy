import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, FolderOpen, LayoutTemplate, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export const Header: React.FC = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { path: '/', label: 'Объекты', icon: FolderOpen },
    { path: '/templates', label: 'Шаблоны', icon: LayoutTemplate },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">ALU-TEMIR</h1>
              <p className="text-xs text-muted-foreground">Калькулятор материалов</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            <button
              onClick={toggleTheme}
              className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
              aria-label="Переключить тему"
            >
              <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute top-2 left-2 w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
