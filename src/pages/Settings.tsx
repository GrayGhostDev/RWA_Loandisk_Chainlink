import React from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Switch } from '@headlessui/react';
import { useTheme } from '@/hooks/useTheme';
import { useNotifications } from '@/hooks/useNotifications';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { clearNotifications } = useNotifications();
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(true);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

      <Card>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Dark Mode</p>
            <p className="text-sm text-gray-500">Toggle dark mode theme</p>
          </div>
          <Switch
            checked={theme === 'dark'}
            onChange={toggleTheme}
            className={`${
              theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Toggle dark mode</span>
            <span
              className={`${
                theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive email updates</p>
            </div>
            <Switch
              checked={emailNotifications}
              onChange={setEmailNotifications}
              className={`${
                emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Enable email notifications</span>
              <span
                className={`${
                  emailNotifications ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Push Notifications</p>
              <p className="text-sm text-gray-500">Receive push notifications</p>
            </div>
            <Switch
              checked={pushNotifications}
              onChange={setPushNotifications}
              className={`${
                pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Enable push notifications</span>
              <span
                className={`${
                  pushNotifications ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>

          <div className="pt-4">
            <Button
              variant="outline"
              onClick={clearNotifications}
              className="w-full"
            >
              Clear All Notifications
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;