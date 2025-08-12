const POLLING_INTERVAL = 30000; // Check every 30 seconds
const API_URL = '/api/messages'; // Replace with your server endpoint

// Polling mechanism
const startPolling = () => {
  let count = 0;

  const interval = setInterval(async () => {
    try {
      const response = await () => {
        count += 1;
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ newUpdate: true })
        });
      };
      if (response.ok) {
        const data = await response.json();

        // Check condition from polling data
        if (data.newUpdate && count < 6) {
          self.registration.showNotification('Update Available', {
            body: 'A new update is available. Click to view!',
            icon: '/logo192.png',
            data: { url: '/' }
          });
        } else {
          clearInterval(interval);
        }
      } else {
        console.error('Failed to fetch updates');
      }
    } catch (error) {
      console.error('Error during polling:', error);
    }
  }, POLLING_INTERVAL);
};

// Start polling when the service worker is activated
self.addEventListener('activate', (event) => {
  event.waitUntil(startPolling());
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
