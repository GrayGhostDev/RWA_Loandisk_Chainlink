import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export const NotificationCenter: React.FC = () => {
  const { 
    notifications, 
    markAsRead, 
    clearNotifications, 
    unreadCount 
  } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <Card className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              {unreadCount} new
            </span>
          )}
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearNotifications}
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg ${
              notification.read ? 'bg-gray-50' : 'bg-blue-50'
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="flex justify-between items-start">
              <h3 className={`text-sm font-medium ${
                notification.type === 'error' ? 'text-red-800' :
                notification.type === 'warning' ? 'text-yellow-800' :
                notification.type === 'success' ? 'text-green-800' :
                'text-gray-900'
              }`}>
                {notification.title}
              </h3>
              <span className="text-xs text-gray-500">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {notification.message}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};