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
		'background': '#FFF',
		'font-size': '16px',
		'font-family': 'OpenSans, "Open Sans", "Helvetica Neue", Helvetica, Arial, Geneva, sans-serif'
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
		'background': 'rgba(255,255,255,.8)',
		'position': 'fixed',
		'height': '100%',
		'width': '100%',
		'opacity': 0,
		'top': 0,
		'left': 0,
		'z-index': 2147483640
	});

		addSelector('.active .overlay', {
			'opacity': 1
		});

	addSelector('.try_this', {
		'position': 'absolute',
		'top': 0,
		'bottom': 0,
		'left': 0,
		'right': '450px'
	});

		addSelector('.try_this iframe', {
			'border': '0',
			'width': '100%',
			'height': '100%'
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
		'background': '@linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 30%, rgba(255,255,255,1) 100%)'
	});

	addSelector('.loading', {
		'top': 0,
		'color': '#222',
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
		'color': '#222',
		'left': '40px',
		'right': '40px'
	});

		addSelector('.title', {
			'font-size': '30px',
			'padding': '20px 0 0',
			'color': '#222',
			'margin': 0
		});

		addSelector('.year', {
			'color': '#222',
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
				'border': '1px solid #ac0000',
				'color': '#ac0000 !important',
				'padding': '10px',
				'border-radius': '2px',
				'text-decoration': 'none !important',
				'float': 'right',
				'position': 'relative',
				'top': '-18px',
				'text-align': 'center',
				'width': '14%',
				'cursor': 'pointer',
				'@transition': 'all .3s cubic-bezier(0.9,0,0.1,1)'
			});

				addSelector('.add_button:hover', {
					'background': '#ac0000',
					'color': '#FFF !important',
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

	addSelector('.cancel', {
		'border': '1px solid #ac0000',
		'color': '#ac0000 !important',
		'padding': '10px',
		'border-radius': '2px',
		'text-decoration': 'none !important',
		'text-align': 'center',
		'cursor': 'pointer',
		'@transition': 'all .3s cubic-bezier(0.9,0,0.1,1)',
		'position': 'absolute',
		'bottom': '10px',
		'right': '100%',
		'margin-right': '10px'
	});

		addSelector('.cancel:hover', {
			'background': '#ac0000',
			'color': '#FFF !important',
		});

	addSelector('.hidden', {
		'opacity': .1
	});
}
