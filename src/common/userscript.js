// ==UserScript==
// @name CouchPotato
// @include http://*
// @include https://*
// ==/UserScript==

var html_el = document.documentElement,
	$ = document.querySelector;

kango.addMessageListener('checkApi', function(event) {
	kango.dispatchMessage('setApi', document.body.getAttribute('data-api'));
});

// Show nice popup
kango.addMessageListener('showAlert', function(event) {

	var alert_style = addStyle(' \
		.cp_dialog { padding: 20px; } \
		.cp_dialog .cp_title { font-weight: bold; } \
		.cp_dialog .cp_msg { margin: 5px 0 10px 0; } \
		.cp_ok { outline: 0;  border-radius: 0; box-shadow: none; float: right; padding: 10px; border: none; display: inline-block; background: #91CD85; color: #FFF; font-weight: bold; font-family: "Helvetica Neue", Helvetica, Arial, Geneva, sans-serif; } \
		.cp_ok::-moz-focus-inner { border: 0; } \
		.cp_ok:hover { background: #7AA76D; } \
	');

	var popup = createPopup();

	// Popup box
	var dialog = create('div', {
		'className': 'cp_dialog',
		'innerHTML': ' \
			<div class="cp_title">' + (event.data.title || 'CouchPotato') + '</div> \
			<div class="cp_msg">' + event.data.msg + '</div> \
		'
	});
	popup.element.appendChild(dialog);

	var OK = create('button', {
        'innerHTML': 'OK',
        'className': 'cp_ok cp_transition'
   	});
    dialog.appendChild(OK);
    OK.focus();

	OK.addEventListener('click', popup.close, false);
	remove_timeout = setTimeout(function(){
		popup.close();
	}, 3500);

});


// Create popup to add movie
kango.addMessageListener('showiFrame', function(event){

	if($('.cp_popup'))
		return;

	// Styles
	var iframe_style = addStyle('\
	    .cp_popup iframe { background: #5C697B; position: absolute; top:0; left: 0; width: 100%; height: 100%; border: none; } \
	');
	var popup = createPopup();

	kango.invokeAsync('kango.storage.getItem', 'api', function(api) {

	    var createApiUrl = function(url){
	        return api + 'userscript/?url=' + escape(url)
	    };

	    var iframe = create('iframe', {
	        'src': createApiUrl(document.location.href),
	        'frameborder': 0,
	        'scrolling': 'no'
	    });

	    // Try and get imdb url
	    try {
	        var regex = new RegExp(/tt(\d{7})/);
	        var imdb_id = document.body.innerHTML.match(regex)[0];
	        if (imdb_id)
	            iframe.setAttribute('src', createApiUrl('http://imdb.com/title/'+imdb_id+'/'))
	    }
	    catch(e){}

	    popup.element.appendChild(iframe);

	});

});

/*
 * Create popup on the edge of the screen
 */
var createPopup = function(content){
	var body = document.body,
		html = body.parentNode;

	var popup_style = addStyle(' \
		.cp_transition { -webkit-box-sizing: border-box; -moz-box-sizing: border-box; -ms-box-sizing: border-box; -o-box-sizing: border-box; box-sizing: border-box; -webkit-transition: all .4s cubic-bezier(0.9,0,0.1,1); -moz-transition: all .4s cubic-bezier(0.9,0,0.1,1); -ms-transition: all .4s cubic-bezier(0.9,0,0.1,1); -o-transition: all .4s cubic-bezier(0.9,0,0.1,1); transition: all .4s cubic-bezier(0.9,0,0.1,1); } \
		.cp_popup { text-shadow: none; color: #222; right: -340px; z-index: 2147483647; padding: 20px 20px 20px 0; top: -20px; bottom: -20px; position: fixed; width: 340px; background: #fcfcfc;  font-size: 16px; overflow: hidden; box-shadow: inset 0 0 20px rgba(0,0,0,.2); font-family: "Helvetica Neue", Helvetica, Arial, Geneva, sans-serif; } \
		.cp_popup .cp_popup_inner { position: relative; height: 100%; width: 100%; } \
		.cp_active .cp_popup { right: -20px; } \
		.cp_html { position: relative; right: 0; } \
		.cp_html.cp_active { right: 320px; } \
		.cp_html body { overflow-x: hidden; } \
	');

	// Popup box
	var popup = create('div', {
		'className': 'cp_popup cp_transition'
	});
	body.appendChild(popup);

	var popup_inner = create('div', {
		'className': 'cp_popup_inner'
	});
	popup.appendChild(popup_inner);

	addClass(html, 'cp_html cp_transition');
	setTimeout(function(){
		addClass(html, 'cp_active');
	}, 100);

	var remove_timeout;
	var close_alert = function(event){

		// Click, Esc, ENTER
		if(!event || event.keyCode === undefined || event.keyCode === 27 || event.keyCode === 13){
			if(event && event.preventDefault){
				event.preventDefault();
				event.stopPropagation();
			}

			removeClass(html, 'cp_active');

			setTimeout(function(){
				destroy(popup);
				destroy(popup_style);

				removeClass(html, 'cp_transition');
				removeClass(html, 'cp_html');
			}, 400);

			body.removeEventListener('keyup', close_alert);
			if(remove_timeout) clearTimeout(remove_timeout);
		}
	}

	// Close alerts
	document.addEventListener('keyup', close_alert, false);

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
