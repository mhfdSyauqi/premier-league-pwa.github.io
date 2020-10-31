// #00 Load Navigasi Menu
document.addEventListener('DOMContentLoaded', function () {
	// Activate sidebar nav
	const elems = document.querySelectorAll('.sidenav');
	M.Sidenav.init(elems);
	loadNav();
	function loadNav() {
		const xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4) {
				if (this.status != 200) return;
				// Muat daftar tautan menu
				document.querySelectorAll('.topnav, .sidenav').forEach(function (elm) {
					elm.innerHTML = xhttp.responseText;
				});

				// Daftarkan event listener untuk setiap tautan menu
				document.querySelectorAll('.sidenav a, .topnav a').forEach(function (elm) {
					elm.addEventListener('click', function (event) {
						// Tutup sidenav
						const sidenav = document.querySelector('.sidenav');
						M.Sidenav.getInstance(sidenav).close();

						// Muat konten halaman yang dipanggil
						page = event.target.getAttribute('href').substr(1);
						loadPage(page);
					});
				});
			}
		};
		xhttp.open('GET', 'pages/nav.html', true);
		xhttp.send();
	}
});

// #01 Load page content
let page = window.location.hash.substr(1);
if (page == '') page = 'home';
loadPage(page);

function loadPage(page) {
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4) {
			let content = document.querySelector('#body-content');
			if (this.status == 200) {
				content.innerHTML = xhttp.responseText;
				if (page == 'home') getStandings();
				if (page == 'teams') getTeams();
				if (page == 'fav') getAllTeam();
			} else if (this.status == 404) {
				content.innerHTML = `<div class="container center mx-1">
                              <h3>Halaman tidak ditemukan.</h3>
                            </div>`;
			} else {
				content.innerHTML = `<div class="container center mx-1">
                              <h3>Ups.. halaman tidak dapat diakses.</h3>
                            </div>`;
			}
		}
	};
	xhttp.open('GET', 'pages/' + page + '.html', true);
	xhttp.send();
}

// # 02 Load API

const dataAPI = {
	url: 'https://api.football-data.org/v2',
	token: 'f5f9fd73b13c48a6a74e01f841e287e5',
	id: 2021,
};

let status = (res) => {
	if (res.status != 200) {
		console.log(`Error : ${res.status}`);
		return Promise.reject(new Error(res.statusText()));
	} else {
		return Promise.resolve(res);
	}
};

const getStandings = () => {
	showLoader();
	if ('caches' in window) {
		caches.match(`${dataAPI.url}/competitions/${dataAPI.id}/standings`).then((res) => {
			if (res) {
				res
					.json()
					.then((data) => {
						let stanVal = '';
						data = data.standings[0].table;

						data.forEach((teamVal) => {
							let urlTeamImage = teamVal.team.crestUrl;
							urlTeamImage = urlTeamImage.replace(/^http:\/\//i, 'https://');
							stanVal += `
											<tr>
													<td>${teamVal.position}</td>
													<td>
														<img src="${urlTeamImage}" alt="${teamVal.team.name}" class="responsive-img" width="30px">
													</td>
													<td>${teamVal.team.name}</td>
													<td>${teamVal.points}</td>
													<td>${teamVal.playedGames}</td>
													<td>${teamVal.won}</td>
													<td>${teamVal.draw}</td>
													<td>${teamVal.lost}</td>
													<td>${teamVal.goalsFor}</td>
													<td>${teamVal.goalsAgainst}</td>
													<td>${teamVal.goalDifference}</td>
											</tr>
											`;
						});
						document.getElementById('standings').innerHTML = stanVal;
						hideLoader();
					})
					.catch((err) => console.log(err));
			}
		});
	}
	fetch(`${dataAPI.url}/competitions/${dataAPI.id}/standings`, {
		headers: {
			'X-Auth-Token': dataAPI.token,
		},
	})
		.then(status)
		.then((res) => res.json())
		.then((data) => {
			let stanVal = '';
			data = data.standings[0].table;

			data.forEach((teamVal) => {
				let urlTeamImage = teamVal.team.crestUrl;
				urlTeamImage = urlTeamImage.replace(/^http:\/\//i, 'https://');
				stanVal += `
					<tr>
							<td>${teamVal.position}</td>
							<td><img src="${urlTeamImage}" alt="${teamVal.team.name}" class="responsive-img" width="30"></td>
							<td width="15%">${teamVal.team.name}</td>
							<td>${teamVal.points}</td>
							<td>${teamVal.playedGames}</td>
							<td>${teamVal.won}</td>
							<td>${teamVal.draw}</td>
							<td>${teamVal.lost}</td>
							<td>${teamVal.goalsFor}</td>
							<td>${teamVal.goalsAgainst}</td>
							<td>${teamVal.goalDifference}</td>
					</tr>
					`;
			});
			document.getElementById('standings').innerHTML = stanVal;
			hideLoader();
		})
		.catch((err) => console.log(err));
};

const getTeams = () => {
	showLoader();
	if ('caches' in window) {
		caches.match(`${dataAPI.url}/competitions/${dataAPI.id}/teams`).then((res) => {
			if (res) {
				res.json().then((data) => {
					let teamVal = '';
					data = data.teams;
					data.forEach((team) => {
						let urlTeamImage = team.crestUrl;
						urlTeamImage = urlTeamImage.replace(/^http:\/\//i, 'https://');
						teamVal += `
											<div class="col s12 m12 l4">
												<div class="card">
													<div class="card-image waves-effect waves-block waves-light">
														<img class="activator" src="${urlTeamImage}" alt="${team.name}" width="250px" height="250px">
													</div>
													<div class="card-content">
														<span class="card-title activator grey-text text-darken-4">${team.shortName}<i class="material-icons right">more_vert</i></span>
														<div class="epl">
															<button onclick="addFavTeam(${team.id},'${urlTeamImage}','${team.name}','${team.venue}','${team.website}','${team.founded}','${team.shortName}','${team.address}')" class="waves-effect waves-light btn pink accent-2">Favorite<i class="large material-icons left">add</i></button>
														</div>
													</div>
													<div class="card-reveal">
														<span class="card-title grey-text text-darken-4">${team.name}<i class="material-icons right">close</i></span>
														<br/>
														<br/>
														<p><b>${team.address}</b></p>
														<p><b>Website</b> : <a href="${team.website}">${team.website}</a></p>
														<p><b>Venue</b> : ${team.venue}</p>
														<p><b>Founded</b> : ${team.founded}</p>
													</div>
												</div>
											</div>
											`;
					});
					document.getElementById('teams').innerHTML = teamVal;
					hideLoader();
				});
			}
		});
	}
	fetch(`${dataAPI.url}/competitions/${dataAPI.id}/teams`, {
		headers: {
			'X-Auth-Token': dataAPI.token,
		},
	})
		.then(status)
		.then((res) => res.json())
		.then((data) => {
			let teamVal = '';
			data = data.teams;
			data.forEach((team) => {
				let urlTeamImage = team.crestUrl;
				urlTeamImage = urlTeamImage.replace(/^http:\/\//i, 'https://');
				teamVal += `
					<div class="col s12 m12 l4">
						<div class="card">
							<div class="card-image waves-effect waves-block waves-light">
								<img class="activator" src="${urlTeamImage}" alt="${team.name}" width="250px" height="250px">
							</div>
							<div class="card-content">
								<span class="card-title activator grey-text text-darken-4">${team.shortName}<i class="material-icons right">more_vert</i></span>
								<div class="epl">
									<button onclick="addFavTeam(${team.id},'${urlTeamImage}','${team.name}','${team.venue}','${team.website}','${team.founded}','${team.shortName}','${team.address}')" class="waves-effect waves-light btn pink accent-2">Favorite<i class="large material-icons left">add</i></button>
								</div>
							</div>
							<div class="card-reveal">
								<span class="card-title grey-text text-darken-4">${team.name}<i class="material-icons right">close</i></span>
								<br/>
								<br/>
								<p><b>${team.address}</b></p>
								<p><b>Website</b> : <a href="${team.website}">${team.website}</a></p>
								<p><b>Venue</b> : ${team.venue}</p>
								<p><b>Founded</b> : ${team.founded}</p>
							</div>
						</div>
					</div>
					`;
			});
			document.getElementById('teams').innerHTML = teamVal;
			hideLoader();
		})
		.catch((err) => console.log(err));
};

// #03 Loader Page

const showLoader = () => {
	document.getElementById('body-content').style.display = 'none';
	const loading = `<div class="row" style="padding: 30% 15%; height: 50%;">
											<div class="preloader-wrapper big active">
												<div class="spinner-layer spinner-layer ">
													<div class="circle-clipper left">
														<div class="circle"></div>
													</div><div class="gap-patch">
														<div class="circle"></div>
													</div><div class="circle-clipper right">
														<div class="circle"></div>
													</div>
												</div>
											</div>
                		</div>`;
	document.getElementById('loader').innerHTML = loading;
};

const hideLoader = () => {
	document.getElementById('loader').innerHTML = '';
	document.getElementById('body-content').style.display = 'block';
};

// #04 IndexedDB

let dbPromise = idb.open('PremierLeague', 1, (upgradeDB) => {
	if (!upgradeDB.objectStoreNames.contains('teams')) {
		upgradeDB.createObjectStore('teams');
	}
});

const addTeam = ({ id, logo, name, venue, website, founded, shortName, address }) => {
	dbPromise
		.then((db) => {
			let tx = db.transaction('teams', 'readwrite');
			let store = tx.objectStore('teams');
			let item = {
				id: id,
				logo: logo,
				name: name,
				venue: venue,
				website: website,
				founded: founded,
				shortName: shortName,
				address: address,
				created: new Date().getTime(),
			};
			store.put(item, id); //menambahkan id team fav
			return tx.complete;
		})
		.then(() => console.log('Berhasil Menyimpan Tim', name))
		.catch(() => console.log('Gagal Menyimpan Tim'));
};

const deleteTeam = (id) => {
	dbPromise
		.then((db) => {
			let tx = db.transaction('teams', 'readwrite');
			let store = tx.objectStore('teams');
			store.delete(id);
			return tx.complete;
		})
		.then(() => console.log('Item Deleted'));
};

const getTeam = () => {
	return dbPromise
		.then((db) => {
			let tx = db.transaction('teams', 'readonly');
			let store = tx.objectStore('teams');

			return store.getAll();
		})
		.then((data) => data);
};

const getAllTeam = () => {
	//Get All Fav Team From Database
	getTeam().then((data) => {
		let teamsList = '';
		data.forEach((team) => {
			teamsList += `
							<div class="col s12 m12 l12">
								<div class="card">
									<div class="card-image waves-effect waves-block waves-light">
										<img
											class="activator"
											src="${team.logo}"
											alt="${team.name}"
											width="250px"
											height="250px"
										/>
									</div>
									<div class="card-content">
										<span class="card-title activator grey-text text-darken-4">${team.shortName}<i class="material-icons right">more_vert</i></span										>
										<div class="epl">
										<button onclick="deleteFavTeam(${team.id},'${team.name}')" class="waves-effect waves-light btn red accent-3">Remove</button>
										</div>
									</div>
									<div class="card-reveal">
										<span class="card-title grey-text text-darken-4">${team.name}<i class="material-icons right">close</i></span>
										<br />
										<br />
										<p><b>${team.address}</b></p>
										<p><b>Website</b> : <a href="${team.website}">${team.website}</a></p>
										<p><b>Venue</b> : ${team.venue}</p>
										<p><b>Founded</b> : ${team.founded}</p>
									</div>
								</div>
							</div>
							`;
		});
		//insert All Team in Database to DOM
		document.getElementById('fav').innerHTML = teamsList;
	});
};

const addFavTeam = (id, logo, name, venue, website, founded, shortName, address) => {
	//Add To Database
	addTeam({ id, logo, name, venue, website, founded, shortName, address });
	//Display Toast
	M.toast({ html: `${name} Ur Favorite Team`, classes: 'rounded' });
};

const deleteFavTeam = (id, name) => {
	//Conform Delete ?
	let delAlert = confirm(
		`Apakah Anda Yakin ingin menghapus ${name} dari Daftar Favorit ?`
	);
	if (delAlert) {
		//Delete Team From Database
		deleteTeam(id);
		//Fetch All Team
		getAllTeam();
		//Display Toast
		M.toast({ html: `Berhasil Menghapus ${name}`, classes: 'rounded' });
	}
};

// #05 Push Notification

self.addEventListener('push', (event) => {
	let body;
	if (event.data) {
		body = event.data.text();
	} else {
		body = 'Push message no payload';
	}
	let options = {
		body: body,
		icon: 'img/notification.png',
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1,
		},
	};
	event.waitUntil(self.registration.showNotification('Push Notification', options));
});

if ('PushManager' in window) {
	navigator.serviceWorker.getRegistration().then((registration) => {
		registration.pushManager
			.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(
					'BKGkaUJxmteTc9rNJsFhUD76rIQuXjG8Mmng8s-pLtXdvJ4hfeAILqLsbIRuLYJXzt5WShDwM2ryJLNLLIcWYSQ'
				),
			})
			.then((subscribe) => {
				console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
				console.log(
					'Berhasil melakukan subscribe dengan p256dh key: ',
					btoa(
						String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('p256dh')))
					)
				);
				console.log(
					'Berhasil melakukan subscribe dengan auth key: ',
					btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('auth'))))
				);
			})
			.catch((e) => {
				console.error('Tidak dapat melakukan subscribe ', e.message);
			});
	});
}

const urlBase64ToUint8Array = (base64String) => {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
};
