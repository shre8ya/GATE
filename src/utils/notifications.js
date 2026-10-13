// Native Web Notifications API + Audio Chime Engine

import { playBell } from './audio';

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch (err) {
    return 'denied';
  }
}

export function sendNotification(title, options = {}) {
  // Play subtle bell
  if (options.playSound !== false) {
    playBell();
  }

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      const notif = new Notification(title, {
        icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        ...options
      });
      notif.onclick = () => {
        window.focus();
        notif.close();
      };
      return notif;
    } catch (e) {
      console.warn("Desktop notification trigger failed:", e);
    }
  }
  return null;
}
