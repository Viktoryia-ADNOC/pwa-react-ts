import React from 'react';

const App: React.FC = () => {
  const showNotification = async () => {
    if (!('Notification' in window)) {
      console.error('This browser does not support notifications.');
      return;
    }

    // Request permission if not already granted or denied
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    // Show notification if permission is granted
    if (Notification.permission === 'granted') {
      new Notification('Hello!', {
        body: 'This is a browser notification.',
        icon: '/logo192.png',
      });
    } else {
      console.error('Notifications are blocked or denied.');
    }
  };

  const handleNotification = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setTimeout(() => {
            new Notification('Reminder', {
              body: 'This is your notification after 1 minute!',
            });
          }, 60000); // 1 minute = 60000 ms
        } else {
          console.error('Notification permission denied');
        }
      });
    } else {
      console.error('Notifications are not supported in this browser');
    }
  };

  return (
    <div>
      <h1>Browser Notifications</h1>
      <button onClick={showNotification}>Show Notification</button>
      <button onClick={handleNotification}>Show Notification in 1 Minute</button>
    </div>
  );
};

export default App;