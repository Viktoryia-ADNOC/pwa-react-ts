const CHECK_MESSAGES_INTERVAL = 30000; // Check every 30 seconds
const MESSAGES_API_URL = '/api/messages'; // Replace with your server endpoint

// Mock fetch to resolve in one minute
const mockFetch = (url: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (url === MESSAGES_API_URL) {
        resolve({
          ok: true,
          json: async () => ({
            newMessage: true,
            title: 'Delayed Message',
            body: 'This message was delayed by one minute.',
            url: '/delayed-message',
          }),
        });
      }
    }, 60000); // 1 minute delay
  });
};

// Periodically check for new messages
self.addEventListener('install', () => {
  self.skipWaiting();
  setInterval(async () => {
    try {
      const response = await mockFetch(MESSAGES_API_URL);
      if (response.ok) {
        const data = await response.json();
        if (data.newMessage) {
          const title = data.title || 'New Message';
          const options = {
            body: data.body || 'You have a new message!',
            icon: '/logo192.png', // Path to your custom icon
            data: {
              url: data.url || '/', // URL to navigate to on click
            },
          };
          self.registration.showNotification(title, options);
        }
      }
    } catch (error) {
      console.error('Error checking for new messages:', error);
    }
  }, CHECK_MESSAGES_INTERVAL);
});

self.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json() || {};
  const title = data.title || 'Notification';
  const options = {
    body: data.body || 'You have a new message!',
    icon: '/logo192.png',
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  const url = event.notification.data?.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});