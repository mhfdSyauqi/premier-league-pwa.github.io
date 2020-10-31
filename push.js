var webPush = require('web-push');

const vapidKeys = {
	publicKey:
		'BKGkaUJxmteTc9rNJsFhUD76rIQuXjG8Mmng8s-pLtXdvJ4hfeAILqLsbIRuLYJXzt5WShDwM2ryJLNLLIcWYSQ',
	privateKey: 'Fl9PDNClx54SusR5IgkMcESPKYsbHRAQAU9SXtCynCk',
};

webPush.setVapidDetails(
	'mailto:example@yourdomain.org',
	vapidKeys.publicKey,
	vapidKeys.privateKey
);
var pushSubscription = {
	endpoint:
		'https://fcm.googleapis.com/fcm/send/ezgcPpg8z6Y:APA91bEHgXLG_E6LK2XH0PSSlo45cChtzs1rdfNjTI_nxyHuxn8-iFKs2OnPwtVtfwH_W-8RnoQX17MzK3LVmJbAeNH_tKIyeXjZd-0HNG_r2fBpgOXH-gb9GOEfzpUAIyv1cVr9UVY0',
	keys: {
		p256dh:
			'BA+SnrEUeoThaWdgx+L17BedPyKAlrMShv1gX5LlKYXgxVXHjfQskuIKQaXTDI2U8TkfmRqaJn6nJnoemrTRq0g=',
		auth: 'ruUuI94gBGNHjz100zi7XQ==',
	},
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi dan workbox!';

var options = {
	gcmAPIKey: '209439383829',
	TTL: 60,
};
webPush.sendNotification(pushSubscription, payload, options);
