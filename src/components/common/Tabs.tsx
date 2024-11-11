import React from 'react';
import { Tab } from '@headlessui/react';

interface TabItem {
  key: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, className = '' }) => {
  return (
    <Tab.Group>
      <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
        {items.map((item) => (
          <Tab
            key={item.key}
            className={({ selected }) => `
              w-full rounded-lg py-2.5 text-sm font-medium leading-5
              ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400
              focus:outline-none focus:ring-2
              ${selected
                ? 'bg-white text-blue-700 shadow'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              }
            `}
          >
            {item.label}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-2">
        {items.map((item) => (
          <Tab.Panel
            key={item.key}
            className={`rounded-xl bg-white p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 ${className}`}
          >
            {item.content}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};