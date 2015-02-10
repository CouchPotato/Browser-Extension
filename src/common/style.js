var style_added = false;
var addStyle = function(){
	if(style_added) return;

	style_added = true;

	addSelector('.transition', {
		'@transition': 'all .6s cubic-bezier(0.9,0,0.1,1)'
	});

	addSelector('.transition2', {
		'@transition': 'all .6s ease-in-out'
	});

	addSelector('.popup', {
		'text-shadow': 'none',
		'color': '#222',
		'right': '-450px',
		'height': '100%',
		'z-index': 2147483647,
		'padding': 0,
		'top': 0,
		'position': 'fixed',
		'width': '100%',
		'max-width': '450px',
		'background': 'rgb(78,89,105)',
		'font-size': '16px',
		'overflow': 'hidden',
		'font-family': '"Helvetica Neue", Helvetica, Arial, Geneva, sans-serif'
	});

		addSelector('.popup .popup_inner', {
			'position': 'relative',
			'height': '100%',
			'width': '100%'
		});

		addSelector('.popup *', {
			'@box-sizing': 'border-box'
		});

		addSelector('.active .popup', {
			'right': 0
		});

	addSelector('.overlay', {
		'background': '#000',
		'opacity': 0,
		'position': 'fixed',
		'height': '100%',
		'width': '100%',
		'top': 0,
		'left': 0,
		'z-index': 2147483640
	});

		addSelector('.active .overlay', {
			'opacity': .5
		});

	addSelector('.popup_background', {
		'z-index': 1,
		'position': 'absolute',
		'top': 0,
		'left': 0,
		'width': '100%',
		'height': '100%',
		'background': 'no-repeat top center',
		'background-size': 'cover'
	});

	addSelector('.popup_background_overlay', {
		'z-index': 2,
		'background': '@linear-gradient(to bottom, rgba(78,89,105,0) 0%, rgba(78,89,105,0.8) 30%, rgba(78,89,105,1) 100%)'
	});

	addSelector('.loading', {
		'top': 0,
		'color': '#FFF',
		'opacity': 1,
		'position': 'absolute',
		'left': 0,
		'right': 0,
		'padding': '60px 20px 0',
		'text-align': 'center',
		'font-size': '25px'
	});

		addSelector('.loading.hide', {
			'top': '-90px',
			'opacity': 0
		});

	addSelector('.movie', {
		'opacity': 1
	});

		addSelector('.movie.hide', {
			'opacity': 0
		});

	addSelector('.popup_info', {
		'position': 'absolute',
		'z-index': 2,
		'overflow': 'auto',
		'overflow-x': 'hidden',
		'top': '15%',
		'bottom': '5%',
		'color': '#FFF',
		'left': '40px',
		'right': '40px'
	});

		addSelector('.title', {
			'font-size': '30px',
			'padding': '20px 0 0',
			'color': '#FFF',
			'margin': 0
		});

		addSelector('.year', {
			'color': '#FFF',
			'font-size': '20px',
			'font-weight': 'normal',
			'padding-left': '20px'
		});

		addSelector('.plot', {
			'font-size': '16px',
			'font-weight': 'normal',
			'padding': '20px 0',
			'margin': 1
		});

		addSelector('.in_wanted', {
			'font-size': '12px',
			'opacity': '0.7',
			'margin-bottom': '20px',
			'text-align': 'right'
		});

		addSelector('.form', {
			'position': 'absolute',
			'width': '100%'
		});

			addSelector('.form.hide', {
				'opacity': 0,
				'visibility': 'hidden'
			});

			addSelector('.select', {
				'margin': 1
			});
				addSelector('.title_select', {
					'width': '80%'
				});
				addSelector('.category_select', {
					'width': '49%',
					'margin-right': '2%'
				});
				addSelector('.profile_select', {
					'width': '29%'
				});

			addSelector('.add_button', {
				'background': '#5082BC',
				'color': '#FFF !important',
				'padding': '10px',
				'border-radius': '2px',
				'text-decoration': 'none !important',
				'font-weight': 'bold',
				'float': 'right',
				'position': 'relative',
				'top': '-18px',
				'text-align': 'center',
				'width': '14%',
				'cursor': 'pointer'
			});

				addSelector('.add_button:hover', {
					'background': '#4474ab'
				});

			addSelector('.success', {
				'position': 'relative',
				'opacity': 0,
				'visibility': 'hidden',
				'text-align': 'center',
				'font-size': '25px',
				'padding': '10px'
			});

				addSelector('.success.show', {
					'top': '-5px',
					'opacity': 1,
					'visibility': 'visible'
				});

	addSelector('.hidden', {
		'opacity': .1
	});
}
