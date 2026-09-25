// sw.js - Handles Android Notification Action Buttons
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => self.clients.claim());

// Handle notification button clicks (Accept / Reject)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const taskId = event.notification.data ? event.notification.data.taskId : null;
  const action = event.action; // 'accept' or 'reject'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.postMessage({
            type: 'NOTIFICATION_ACTION',
            action: action || 'open',
            taskId: taskId
          });
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./index.html?action=' + (action || 'open') + '&taskId=' + taskId);
      }
    })
  );
});
