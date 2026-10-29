/* Mes départs : service worker
   - garde une copie de l'app (page + appli chiffrée) pour l'ouvrir sans réseau (mode avion, métro) ;
   - réseau d'abord : en ligne, on a toujours la dernière version ;
   - affiche les notifications du suivi de trajet. */
var CACHE='mes-departs-v1';
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(['./','app.json']).catch(function(){})}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==CACHE}).map(function(n){return caches.delete(n)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
 var r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==self.location.origin)return;
 var page=r.mode==='navigate',app=/\/app\.json$/.test(u.pathname);
 if(!page&&!app)return;
 var key=page?'./':'app.json';
 e.respondWith(fetch(r).then(function(res){if(res&&res.ok){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(key,cp)})}return res})
  .catch(function(){return caches.open(CACHE).then(function(c){return c.match(key)}).then(function(m){return m||new Response('<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width"><body style="background:#0E1730;color:#fff;font:16px system-ui;padding:40px;text-align:center">Pas de réseau, et l\'app n\'a pas encore été enregistrée sur ce téléphone. Ouvre-la une fois avec du réseau.</body>',{headers:{'Content-Type':'text/html; charset=utf-8'}})})}));
});
self.addEventListener('notificationclick',function(e){e.notification.close();e.waitUntil(self.clients.matchAll({type:'window'}).then(function(l){for(var i=0;i<l.length;i++)if('focus' in l[i])return l[i].focus();return self.clients.openWindow('./')}))});
