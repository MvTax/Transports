/* Mes départs : service worker minimal, seulement pour afficher les notifications du suivi de trajet (aucun cache). */
self.addEventListener('install',function(){self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim())});
self.addEventListener('notificationclick',function(e){e.notification.close();e.waitUntil(self.clients.matchAll({type:'window'}).then(function(l){for(var i=0;i<l.length;i++)if('focus' in l[i])return l[i].focus();return self.clients.openWindow('./')}))});
