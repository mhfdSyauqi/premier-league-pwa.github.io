importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

let urlsToCache = [
	{ url: './', revision: '1' },
	{ url: './index.html', revision: '1' },
	{ url: './icon-512x512.png', revision: '1' },
	{ url: './icon-384x384.png', revision: '1' },
	{ url: './icon-256x256.png', revision: '1' },
	{ url: './icon-192x192.png', revision: '1' },
	{ url: './img/epl-logo.svg', revision: '1' },
	{ url: './css/style.css', revision: '1' },
	{ url: './css/materialize.min.css', revision: '1' },
	{ url: './css/materialize-social.css', revision: '1' },
	{ url: './css/style.css', revision: '1' },
	{ url: './js/main.js', revision: '1' },
	{ url: './js/idb.js', revision: '1' },
	{ url: './js/materialize.min.js', revision: '1' },
	{ url: './manifest.json', revision: '1' },
];

if (workbox) {
	console.log(`Workbox berhasil dimuat`);
	workbox.precaching.precacheAndRoute(urlsToCache);
	// Chace Asset
	workbox.routing.registerRoute(
		/.*(?:png|gif|jpg|jpeg|svg)$/,
		workbox.strategies.cacheFirst({
			cacheName: 'images-cache',
			plugins: [
				new workbox.cacheableResponse.Plugin({
					statuses: [0, 200],
				}),
				new workbox.expiration.Plugin({
					maxEntries: 100,
					maxAgeSeconds: 30 * 24 * 60 * 60,
				}),
			],
		})
	);
	// Cache FootballApi
	workbox.routing.registerRoute(
		new RegExp('https://api.football-data.org/v2/'),
		workbox.strategies.staleWhileRevalidate({
			cacheName: 'api-football',
		})
	);
	// Caching Google Fonts
	workbox.routing.registerRoute(
		/.*(?:googleapis|gstatic)\.com/,
		workbox.strategies.staleWhileRevalidate({
			cacheName: 'google-fonts-stylesheets',
		})
	);
	// Caching Pages
	workbox.routing.registerRoute(
		new RegExp('./pages/'),
		workbox.strategies.staleWhileRevalidate({
			cacheName: 'pages',
		})
	);
	// Caching Font Awsome
	workbox.routing.registerRoute(
		/^https:\/\/maxcdn\.bootstrapcdn\.com\/font-awesome\/4\.7\.0\/css\//,
		workbox.strategies.staleWhileRevalidate({
			cacheName: 'fontawesome-fonts-stylesheets',
		})
	);
} else {
	console.log(`Workbox gagal dimuat`);
}

self.addEventListener('push', function (event) {
	var body;
	if (event.data) {
		body = event.data.text();
	} else {
		body = 'Push message no payload';
	}
	var options = {
		body: body,
		icon: './icon-192x192.png',
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1,
		},
	};
	event.waitUntil(self.registration.showNotification('Push Notification', options));
});
