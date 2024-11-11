import React from 'react';
import { Switch as HeadlessSwitch } from '@headlessui/react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
}) => {
  return (
    <HeadlessSwitch.Group>
      <div className="flex items-center justify-between">
        {(label || description) && (
          <div>
            {label && (
              <HeadlessSwitch.Label className="text-sm font-medium text-gray-700">
                {label}
              </HeadlessSwitch.Label>
            )}
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
        )}
        <HeadlessSwitch
          checked={checked}
          onChange={onChange}
          className={`${
            checked ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              checked ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </HeadlessSwitch>
      </div>
    </HeadlessSwitch.Group>
  );
};