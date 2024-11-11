import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/common/Button';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { SearchBar } from '@/components/common/SearchBar';
import { useNotifications } from '@/hooks/useNotifications';
import { BellIcon } from '@heroicons/react/24/outline';

export const Header: React.FC = () => {
  const { address, connect, disconnect } = useWallet();
  const { unreadCount } = useNotifications();

  const handleSearch = (query: string) => {
    console.log('Search:', query);
    // Implement search functionality
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
              RWA Platform
            </Link>
            <div className="hidden md:block ml-8">
              <SearchBar onSearch={handleSearch} className="w-64" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <Link to="/notifications" className="relative">
              <BellIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>

            {address ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {`${address.slice(0, 6)}...${address.slice(-4)}`}
                </span>
                <Button variant="outline" size="sm" onClick={disconnect}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button variant="primary" size="sm" onClick={connect}>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};