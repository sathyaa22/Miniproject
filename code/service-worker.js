self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
  event.waitUntil(self.clients.claim());
});
self.addEventListener('push', event => {
  console.log('[Service Worker] Push Received.');
  const title = 'Pantry Alert!';
  const options = {
    body: 'Something might be expiring!',
    icon: 'icon.png', 
    badge: 'badge.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification click Received.');
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url === '/' && 'focus' in client) { 
          return client.focus();
        }
      }
      if (clients.openWindow) { 
        return clients.openWindow('/');
      }
    })
  );
});

console.log('Service Worker Loaded');