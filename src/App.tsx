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

  return (
    <div>
      <h1>Browser Notifications</h1>
      <button onClick={showNotification}>Show Notification</button>
    </div>
  );
};

export default App;
