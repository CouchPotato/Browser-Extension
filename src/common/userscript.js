// ==UserScript==
// @name CouchPotato
// @include http://*
// @include https://*
// @require library/css.js
// @require library/helpers.js
// @require library/mousetrap.js
// @require style.js
// ==/UserScript==

var close_alert = null;

Mousetrap.bind('c o u c h', function() {
	if(close_alert){
		close_alert();
	}
	else {
		kango.invokeAsync('extension.openSidebar');
	}
});

kango.addMessageListener('checkApi', function() {
	kango.dispatchMessage('setApi', document.body.getAttribute('data-api'));
});

kango.addMessageListener('alert', function(event) {
	alert(event.data);
});

// Create popup to add movie
kango.addMessageListener('showSidebar', function(){

	if(close_alert){
		close_alert();
		return;
	}

	var popup = createPopup();

	Scaffold(popup.element,
		['div.loading.transition',
			['div.message', 'Loading movie info']
		],
		['div.movie.transition2.hide',
			['div.popup_background'],
			['div.popup_background.popup_background_overlay'],
			['div.popup_info',
				['h1.title',
					['span.year']
				],
				['p.plot'],
				['div.in_wanted'],
				['div.form.transition',
					['select.select.title_select'],
					['select.select.category_select',
						['option', 'No category']
					],
					['select.select.profile_select'],
					['a.add_button ', 'Add']
				],
				['div.success.transition']
			]
		]
	);

	var $c = function(sel){
		return popup.element.getElementsByClassName(random+sel)[0];
	};

	var url = window.location.href;

	queryApi({
		'url': 'userscript.add_via_url/?url=' + escape(url),
		'onComplete': function(data){
			var type = 'movie',
				media = data[type];

			if(!media){
				$c('message').textContent = 'Failed getting movie info, check your CouchPotato logs for more info.';
				return;
			}

			// Create background
			var has_images = media && media.images,
				image = has_images && media.images.poster_original.length > 0 ? media.images.poster_original[0] : null;
			if(!image && has_images && media.images.backdrop.length > 0){
				image = media.images.backdrop[0];
			}

			if(image){
				$c('popup_background').setAttribute('style', 'background-image: url(\''+image+'\')');
			}

			// Title
			$c('title').insertBefore(document.createTextNode(media.original_title), $c('year'));

			// Year
			if(media.year){
				$c('year').appendChild(document.createTextNode(media.year));
			}


			// Plot
			if(media.plot){
				$c('plot').appendChild(document.createTextNode(media.plot));
			}


			// Already exists
			var in_library = [];
			if(media.in_library){
				media.in_library.releases.forEach(function(release){
					in_library.push(release.quality || release.quality.label);
				});
			}

			if(media.in_wanted && media.in_wanted.profile_id){

				$c('in_wanted').appendChild(document.createTextNode('Already in wanted list'));
			}
			else if (in_library.length > 0){
				$c('in_wanted').appendChild(document.createTextNode('Already in library: ' + in_library.join(', ')));
			}
			else {
				addClass($c('in_wanted'), 'hidden');
			}

			if(media.titles.length === 1){
				addClass($c('title_select'), 'hidden');
			}

			var title_select = $c('title_select');
			media.titles.forEach(function(t){
				var opt_text = document.createTextNode(t),
					opt = document.createElement('option');

				opt.setAttribute('value', t);
				opt.appendChild(opt_text);

				title_select.appendChild(opt);
			});


			if(!media.imdb){
				$c('form').textContent = 'Can\'t find enough data to add this.';
				return;
			}


			// Get categories
			queryApi({
				'url': 'category.list/',
				'onComplete': function(data){
					var categories = data.categories || [];

					if(categories.length === 0){
						addClass($c('category_select'), 'hidden');
						return;
					}

					var category_select = $c('category_select');
					categories.forEach(function(cat){
						var opt_text = document.createTextNode(cat.label),
							opt = document.createElement('option');

						opt.setAttribute('value', (cat._id || cat.id));
						opt.appendChild(opt_text);


						category_select.appendChild(opt);
					});

				}
			});


			// Get profiles
			queryApi({
				'url': 'profile.list/',
				'onComplete': function(data){
					var profiles = data.list || [],
						profile_select = $c('profile_select'),
						profile_count = 0;

					profiles.forEach(function(profile){
						if(profile.hide) return;

						var opt_text = document.createTextNode(profile.label),
							opt = document.createElement('option');

						opt.setAttribute('value', (profile._id || profile.id));
						opt.appendChild(opt_text);

						profile_select.appendChild(opt);
						profile_count++;
					});

					if(profile_count === 1){
						addClass($c('profile_select'), 'hidden');
					}

				}
			});


			// Add button
			$c('add_button').addEventListener('click', function(){

				var params = {'identifier': media.imdb};
					params.title = $c('title_select').value;

				if($c('category_select').value && $c('category_select').value != 'No category'){
					params.category_id = $c('category_select').value;
				}
				if($c('profile_select').value){
					params.profile_id = $c('profile_select').value;
				}

				var message = document.createTextNode('Adding movie...');
				$c('success').appendChild(message);

				addClass($c('form'), 'hide');
				addClass($c('success'), 'show');

				queryApi({
					'url': 'movie.add/',
					'params': params,
					'onComplete': function(data){
						message.textContent = data.success ? 'Movie added successfully!' : 'Failed adding movie. Check logs.';
					}
				});


			}, false);


			// Hide loading, show movie
			addClass($c('loading'), 'hide');
			removeClass($c('movie'), 'hide');

		}

	});

});

var queryApi = function(options){
	options = options || {};

	kango.invokeAsync('extension.getApi', null, function(api) {

		var details = {
			method: 'GET',
			url: api + options.url,
			async: true,
			params: options.params || {},
			contentType: 'json'
		};

		kango.xhr.send(details, function(data) {
			if(data.status == 200 && data.response !== null) {
				if(options.onComplete){
					options.onComplete(data.response);
				}
			}
			else {
				alert('Something went wrong: ' + data.status);
			}
		});
	});

};


/*
 * Create popup on the edge of the screen
 */
var createPopup = function(){
	var body = document.body,
		html = body.parentNode;

	addStyle();

	// Overlay box
	Scaffold(body,
		['div.overlay.transition2']
	);
	var overlay = $('.overlay');

	// Popup box
	Scaffold(html,
		['div.popup.transition',
			['div.popup_inner']
		]
	);
	var popup = $('.popup');

	addClass(body, 'transition');
	setTimeout(function(){
		addClass(html, 'active');
	}, 100);

	close_alert = function(event){

		// Click, Esc, ENTER
		if(!event || event.keyCode === undefined || event.type === 'click' || event.keyCode === 27 || event.keyCode === 13){
			if(event && event.preventDefault){
				event.preventDefault();
				event.stopPropagation();
			}

			removeClass(html, 'active');

			setTimeout(function(){
				destroy(popup);
				destroy(overlay);

				removeClass(body, 'transition');
				removeClass(body, 'active');
			}, 400);

			document.removeEventListener('keyup', close_alert);
			body.removeEventListener('click', close_alert);
			overlay.removeEventListener('click', close_alert);

			close_alert = null;
		}

	};

	// Close alerts
	document.addEventListener('keyup', close_alert, false);
	body.addEventListener('click', close_alert, false);
	overlay.addEventListener('click', close_alert, false);

	return {
		'element': popup,
		'close': close_alert
	};

};
