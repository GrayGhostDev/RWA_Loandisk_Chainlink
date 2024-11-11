import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useNotifications } from '@/hooks/useNotifications';
import { useWallet } from '@/hooks/useWallet';

vi.mock('@/hooks/useWallet');

describe('useNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    (useWallet as any).mockReturnValue({ address: '0x123' });
  });

  it('adds notification', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification({
        type: 'success',
        title: 'Test',
        message: 'Test message'
      });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0]).toMatchObject({
      type: 'success',
      title: 'Test',
      message: 'Test message'
    });
  });

  it('marks notification as read', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification({
        type: 'info',
        title: 'Test',
        message: 'Test message'
      });
    });

    const notificationId = result.current.notifications[0].id;

    act(() => {
      result.current.markAsRead(notificationId);
    });

    expect(result.current.notifications[0].read).toBe(true);
  });

  it('clears all notifications', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification({
        type: 'success',
        title: 'Test 1',
        message: 'Test message 1'
      });
      result.current.addNotification({
        type: 'error',
        title: 'Test 2',
        message: 'Test message 2'
      });
    });

    act(() => {
      result.current.clearNotifications();
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('calculates unread count correctly', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.addNotification({
        type: 'success',
        title: 'Test 1',
        message: 'Test message 1'
      });
      result.current.addNotification({
        type: 'error',
        title: 'Test 2',
        message: 'Test message 2'
      });
    });

    expect(result.current.unreadCount).toBe(2);

    act(() => {
      result.current.markAsRead(result.current.notifications[0].id);
    });

    expect(result.current.unreadCount).toBe(1);
  });
});