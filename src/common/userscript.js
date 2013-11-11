// ==UserScript==
// @name CouchPotato
// @include http://*
// @include https://*
// ==/UserScript==

var html_el = document.documentElement,
	$ = function(selector){
		return document.querySelector(selector)
	},
	p = function(){
		kango.console.log(arguments.length == 1 ? arguments[0] : arguments);
	}
	close_alert = null;

kango.addMessageListener('checkApi', function(event) {
	kango.dispatchMessage('setApi', document.body.getAttribute('data-api'));
});


// Create popup to add movie
kango.addMessageListener('showSidebar', function(event){

	if($('.cp_popup')){
		if(close_alert)
			close_alert();
		return;
	}

	// Styles
	addStyle('\
		.cp_popup_background { \
			z-index: 1; \
			position: absolute; \
			top: 0; \
			left: 0; \
			width: 100%; \
			height: 100%; \
			background: no-repeat top center; \
			background-size: cover; \
		} \
		.cp_popup_background_overlay { \
			z-index: 2; \
			background: -moz-linear-gradient(top, rgba(78,89,105,0) 0%, rgba(78,89,105,0.8) 30%, rgba(78,89,105,1) 100%); \
			background: -webkit-linear-gradient(top, rgba(78,89,105,0) 0%, rgba(78,89,105,0.8) 30%, rgba(78,89,105,1) 100%); \
			background: -ms-linear-gradient(top, rgba(78,89,105,0) 0%, rgba(78,89,105,0.8) 30%, rgba(78,89,105,1) 100%); \
			background: linear-gradient(to bottom, rgba(78,89,105,0) 0%, rgba(78,89,105,0.8) 30%, rgba(78,89,105,1) 100%); \
		} \
		.cp_popup_info { \
			position: absolute; \
			z-index: 3; \
			overflow: auto; \
			overflow-x: hidden; \
			top: 15%; \
			bottom: 5%; \
			color: #FFF; \
			left: 40px; \
			right: 40px; \
		} \
		.cp_title { \
			font-size: 30px; \
			padding: 20px 0 0; \
			color: #FFF; \
			margin: 0; \
		} \
		.cp_title_year { \
			color: #FFF; \
			font-size: 20px; \
			font-weight: normal; \
			padding-left: 20px; \
		} \
		.cp_plot { \
			font-size: 16px; \
			font-weight: normal; \
			padding: 20px 0; \
			margin: 0; \
		} \
		.cp_in_wanted { \
			font-size: 12px; \
			opacity: 0.7; \
			margin-bottom: 20px; \
			text-align: right; \
		} \
		.cp_form { \
			position: relative; \
		} \
		.cp_form.cp_hide { \
			position: relative; \
			opacity: 0; \
			bottom: -40px; \
			visibility: hidden; \
		} \
		.cp_add_button { \
			background: #5082BC; \
			color: #FFF !important; \
			padding: 10px; \
			border-radius: 2px; \
			text-decoration: none !important; \
			font-weight: bold; \
			float: right; \
			position: relative; \
			top: -18px; \
			text-align: center; \
			width: 14%; \
		} \
		.cp_select { \
			margin: 0; \
		} \
		.cp_title_select { \
			width: 80%; \
		} \
		.cp_category_select { \
			width: 49%; \
			margin-right: 2%; \
		} \
		.cp_profile_select { \
			width: 29%; \
		} \
		.cp_success { \
			position: relative; \
			opacity: 0; \
			text-align: center; \
			font-size: 25px; \
			padding: 10px; \
		} \
		.cp_failed { \
		} \
		.cp_success.cp_show { \
			top: -40px; \
			opacity: 1; \
		} \
		.cp_hidden { \
			visibility: hidden; \
		} \
	');
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
						'className': 'cp_popup_background',
						'style': 'background-image: url(\''+image+'\')'
					});
					popup.element.appendChild(bg);
				}


				// Overlay background
				var bg_overlay = create('div', {
					'className': 'cp_popup_background cp_popup_background_overlay'
				});
				popup.element.appendChild(bg_overlay);


				// Inner element
				var inner = create('div', {
					'className': 'cp_popup_info'
				});
				popup.element.appendChild(inner);


				// Title
				var title = create('h1', {
					'className': 'cp_title',
					'textContent': media.original_title
				});
				inner.appendChild(title);

				if(media.year){
					title.appendChild(create('span', {
						'className': 'cp_title_year',
						'textContent': media.year
					}));
				}


				// Plot
				if(media.plot){
					var plot = create('p', {
						'className': 'cp_plot',
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
					'className': 'cp_in_wanted',
					'textContent': 'Already in wanted list: ' + media.in_wanted.profile.label
				}) : (in_library ? create('div', {
					'className': 'cp_in_wanted cp_in_library',
					'textContent': 'Already in library: ' + in_library.join(', ')
				}) : null);

				if(exists)
					inner.appendChild(exists);
					
				var form = create('div', {
					'className': 'cp_form cp_transition'
				});
				inner.appendChild(form);

				// List title
				var title_list = create('select', {
					'className': 'cp_select cp_title_select'
				});
				form.appendChild(title_list);
				
				if(media.titles.length == 1)
					title_list.className += ' cp_hidden';
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
					'className': 'cp_select cp_category_select'
				});
				form.appendChild(category_list);
				queryApi({
					'url': 'category.list/',
					'onComplete': function(data){
						var categories = data.list || [];

						if(categories.length == 0){
							category_list.className += ' cp_hidden';
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
					'className': 'cp_select cp_profile_select'
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
					'className': 'cp_add_button',
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
								'className': 'cp_success cp_transition ' + (data.success ? '' : 'cp_failed')
							});
							inner.appendChild(success);
							
							setTimeout(function(){
								form.className += ' cp_hide';
								success.className += ' cp_show';
							}, 100);
	
						}
					});
					
					
				}, false);
				

			}
		})

	});

});

var queryApi = function(options){

	var options = options || {};

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

	var popup_style = addStyle(' \
		.cp_transition { \
			-webkit-transition: all .6s cubic-bezier(0.9,0,0.1,1); \
			-moz-transition: all .6s cubic-bezier(0.9,0,0.1,1); \
			-ms-transition: all .6s cubic-bezier(0.9,0,0.1,1); \
			transition: all .6s cubic-bezier(0.9,0,0.1,1); \
		} \
		.cp_transition2 { \
			-webkit-transition: all .6s ease-in-out; \
			-moz-transition: all .6s ease-in-out; \
			-ms-transition: all .6s ease-in-out; \
			transition: all .6s ease-in-out; \
		} \
		.cp_popup { \
			text-shadow: none; \
			color: #222; \
			right: -450px; \
			height: 100%; \
			z-index: 2147483647; \
			padding: 0; \
			top: 0; \
			position: fixed; \
			width: 100%; \
			max-width: 450px; \
			background: rgb(78,89,105); \
			font-size: 16px; \
			overflow: hidden; \
			font-family: "Helvetica Neue", Helvetica, Arial, Geneva, sans-serif; \
		} \
		.cp_popup .cp_popup_inner { \
			position: relative; \
			height: 100%; \
			width: 100%; \
		} \
		.cp_popup * { \
			-webkit-box-sizing: border-box; \
			-moz-box-sizing: border-box; \
			-ms-box-sizing: border-box; \
			box-sizing: border-box; \
		} \
		.cp_active .cp_popup { \
			right: 0; \
		} \
		.cp_overlay { \
			background: #000; \
			opacity: 0; \
			position: fixed; \
			height: 100%; \
			width: 100%; \
			top: 0; \
			left: 0; \
			z-index: 2147483640; \
		} \
		.cp_active .cp_overlay { \
			opacity: .5; \
		} \
	');

	// Overlay box
	var overlay = create('div', {
		'className': 'cp_overlay cp_transition2'
	});
	body.appendChild(overlay);

	// Popup box
	var popup = create('div', {
		'className': 'cp_popup cp_transition'
	});
	html.appendChild(popup);

	var popup_inner = create('div', {
		'className': 'cp_popup_inner'
	});
	popup.appendChild(popup_inner);

	addClass(body, 'cp_transition');
	setTimeout(function(){
		addClass(html, 'cp_active');
	}, 100);

	close_alert = function(event){

		// Click, Esc, ENTER
		if(!event || event.keyCode === undefined || event.type === 'click' || event.keyCode === 27 || event.keyCode === 13){
			if(event && event.preventDefault){
				event.preventDefault();
				event.stopPropagation();
			}

			removeClass(html, 'cp_active');

			setTimeout(function(){
				destroy(popup);
				destroy(popup_style);
				destroy(overlay);

				removeClass(body, 'cp_transition');
				removeClass(body, 'cp_active');
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


/*
 * Helpers
 */

// Create element
function create() {
	switch (arguments.length) {
	case 1:
		var A = document.createTextNode(arguments[0]);
		break;
	default:
		var A = document.createElement(arguments[0]), B = arguments[1];
		for ( var b in B) {
			if (b.indexOf("on") == 0){
				A.addEventListener(b.substring(2), B[b], false);
			}
			else if (",style,accesskey,id,name,src,href,which".indexOf(","
						+ b.toLowerCase()) != -1){
				A.setAttribute(b, B[b]);
			}
			else{
				A[b] = B[b];
			}
		}
		for ( var i = 2, len = arguments.length; i < len; ++i){
			A.appendChild(arguments[i]);
		}
	}
	return A;
}

function destroy(element){
	element.parentNode.removeChild(element);
}

function addClass(element, name) {
	element.className = element.className.replace(/\s+$/gi, '') + ' ' + name;
}

function removeClass(element, name) {
	element.className = element.className.replace(name, '');
}

// Add style block
var addStyle = function(css) {
	var head = document.getElementsByTagName('head')[0],
		style = document.createElement('style');
	if (!head)
		return;

	style.type = 'text/css';
	style.textContent = css;
	head.appendChild(style);

	return style;
}
