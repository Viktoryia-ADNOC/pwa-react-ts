const POLLING_INTERVAL = 30000; // Check every 30 seconds

// Polling mechanism
const startPolling = () => {
  let count = 0;

  const interval = setInterval(async () => {
    try {
      const response = await Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ newUpdate: true })
      });

      if (response.ok) {
        const data = await response.json();

        // Check condition from polling data
        if (data.newUpdate && count < 5) {
          count += 1;
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
      clearInterval(interval); // Stop polling on error
    }
  }, POLLING_INTERVAL);
};

// Start polling when the service worker is activated
self.addEventListener('activate', (event) => {
  event.waitUntil(startPolling());
});

self.addEventListener('push', (event) => {
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

self.addEventListener('notificationclick', (event) => {
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
