import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, ChartBarIcon, ArrowsRightLeftIcon, 
  WalletIcon, BellIcon, UserIcon, Cog6ToothIcon 
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', to: '/', icon: HomeIcon },
  { name: 'Market', to: '/market', icon: ChartBarIcon },
  { name: 'Exchange', to: '/exchange', icon: ArrowsRightLeftIcon },
  { name: 'Wallet', to: '/wallet', icon: WalletIcon },
  { name: 'Activity', to: '/activity', icon: BellIcon },
  { name: 'Profile', to: '/profile', icon: UserIcon },
  { name: 'Settings', to: '/settings', icon: Cog6ToothIcon },
];

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white shadow-sm">
      <div className="h-full px-3 py-4">
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) => `
                flex items-center px-4 py-2 text-sm font-medium rounded-md
                ${isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};