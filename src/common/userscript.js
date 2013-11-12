// ==UserScript==
// @name CouchPotato
// @include http://*
// @include https://*
// @require css.js
// @require helpers.js
// @require style.js
// ==/UserScript==

var html_el = document.documentElement,
	close_alert = null;

kango.addMessageListener('checkApi', function(event) {
	kango.dispatchMessage('setApi', document.body.getAttribute('data-api'));
});

// Create popup to add movie
kango.addMessageListener('showSidebar', function(event){

	if($(addRandom('.popup'))){
		if(close_alert)
			close_alert();
		return;
	}

	var popup = createPopup();

	kango.invokeAsync('kango.storage.getItem', 'api', function(api) {
		var url = window.location.href;

		queryApi({
			'url': 'userscript.add_via_url/?url=' + escape(url),
			'onComplete': function(data){
				var type = 'movie',
					media = data[type];


				// Create background
				var image = media.images.poster_original.length > 0 ? media.images.poster_original[0] : null;
				if(!image && media.images.backdrop.length > 0)
					image = media.images.backdrop[0];

				if(image){
					var bg = create('div', {
						'className': 'popup_background',
						'style': 'background-image: url(\''+image+'\')'
					});
					popup.element.appendChild(bg);
				}


				// Overlay background
				var bg_overlay = create('div', {
					'className': 'popup_background popup_background_overlay'
				});
				popup.element.appendChild(bg_overlay);


				// Inner element
				var inner = create('div', {
					'className': 'popup_info'
				});
				popup.element.appendChild(inner);


				// Title
				var title = create('h1', {
					'className': 'title',
					'textContent': media.original_title
				});
				inner.appendChild(title);

				if(media.year){
					title.appendChild(create('span', {
						'className': 'title_year',
						'textContent': media.year
					}));
				}


				// Plot
				if(media.plot){
					var plot = create('p', {
						'className': 'plot',
						'textContent': media.plot
					});
					inner.appendChild(plot);
				}


				// Already exists
				if(media.in_library){
					var in_library = [];
					media.in_library.releases.forEach(function(release){
						in_library.push(release.quality.label)
					});
				}

				var exists = media.in_wanted && media.in_wanted.profile_id ? create('div', {
					'className': 'in_wanted',
					'textContent': 'Already in wanted list: ' + media.in_wanted.profile.label
				}) : (in_library ? create('div', {
					'className': 'in_wanted in_library',
					'textContent': 'Already in library: ' + in_library.join(', ')
				}) : null);

				if(exists)
					inner.appendChild(exists);

				var form = create('div', {
					'className': 'form transition'
				});
				inner.appendChild(form);

				// List title
				var title_list = create('select', {
					'className': 'select title_select'
				});
				form.appendChild(title_list);

				if(media.titles.length == 1)
					title_list.className += ' hidden';
				else {
					media.titles.forEach(function(t){
						title_list.appendChild(create('option', {
							'value': t,
							'textContent': t
						}));
					});
				}


				// Get categories
				var category_list = create('select', {
					'className': 'select category_select'
				});
				form.appendChild(category_list);
				queryApi({
					'url': 'category.list/',
					'onComplete': function(data){
						var categories = data.list || [];

						if(categories.length == 0){
							category_list.className += ' hidden';
							return
						}

						categories.forEach(function(cat){
							category_list.appendChild(create('option', {
								'value': cat.id,
								'textContent': cat.label
							}));
						});

					}
				});


				// Get profiles
				var profiles_list = create('select', {
					'className': 'select profile_select'
				});
				form.appendChild(profiles_list);
				queryApi({
					'url': 'profile.list/',
					'onComplete': function(data){
						var profiles = data.list || [];

						profiles.forEach(function(profile){
							if(!profile.hide)
								profiles_list.appendChild(create('option', {
									'value': profile.id,
									'textContent': profile.label
								}));
						})

					}
				});


				// Add button
				var add_button = create('a', {
					'className': 'add_button',
					'textContent': 'Add',
					'href': '#'
				});
				form.appendChild(add_button);
				add_button.addEventListener('click', function(){

					var query_string = ['identifier='+media.identifier];
					if(title_list.value)
						query_string.push('title=' + escape(title_list.value))
					if(category_list.value)
						query_string.push('category_id=' + category_list.value)
					if(profiles_list.value)
						query_string.push('profile_id=' + profiles_list.value)

					queryApi({
						'url': 'movie.add/?' + query_string.join('&'),
						'onComplete': function(data){

							var success = create('div', {
								'textContent': data.success ? 'Movie added successfully!' : 'Failed adding movie. Check logs.',
								'className': 'success transition ' + (data.success ? '' : 'failed')
							});
							inner.appendChild(success);

							setTimeout(function(){
								form.className += ' hide';
								success.className += ' show';
							}, 100);

						}
					});


				}, false);


			}
		})

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
			if(data.status == 200 && data.response != null) {
				if(options.onComplete)
					options.onComplete(data.response);
			}
			else {
				alert('Something went wrong: ' + data.status);
			}
		});
	});

}


/*
 * Create popup on the edge of the screen
 */
var createPopup = function(content){
	var body = document.body,
		html = body.parentNode;

	addStyle();

	// Overlay box
	var overlay = create('div', {
		'className': 'overlay transition2'
	});
	body.appendChild(overlay);

	// Popup box
	var popup = create('div', {
		'className': 'popup transition'
	});
	html.appendChild(popup);

	var popup_inner = create('div', {
		'className': 'popup_inner'
	});
	popup.appendChild(popup_inner);

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
				destroy(popup_style);
				destroy(overlay);

				removeClass(body, 'transition');
				removeClass(body, 'active');
			}, 400);

			document.removeEventListener('keyup', close_alert);
			body.removeEventListener('click', close_alert);
			overlay.removeEventListener('click', close_alert);

			close_alert = null;
		}
	}

	// Close alerts
	document.addEventListener('keyup', close_alert, false);
	body.addEventListener('click', close_alert, false);
	overlay.addEventListener('click', close_alert, false);

	return {
		'popup': popup,
		'element': popup_inner,
		'close': close_alert
	}

}