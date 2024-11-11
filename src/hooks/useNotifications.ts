import { useState, useEffect } from 'react';
import { useWallet } from './useWallet';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export const useNotifications = () => {
  const { address } = useWallet();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!address) {
      setNotifications([]);
      return;
    }

    // Load notifications from localStorage
    const stored = localStorage.getItem(`notifications_${address}`);
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
  }, [address]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      read: false,
    };

    setNotifications((prev) => {
      const updated = [newNotification, ...prev];
      if (address) {
        localStorage.setItem(`notifications_${address}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => 
        n.id === id ? { ...n, read: true } : n
      );
      if (address) {
        localStorage.setItem(`notifications_${address}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    if (address) {
      localStorage.removeItem(`notifications_${address}`);
    }
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    clearNotifications,
    unreadCount: notifications.filter((n) => !n.read).length,
  };
};