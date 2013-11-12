/*
 * Helpers
 */

var $ = function(selector){
		return document.querySelector(selector)
	},
	p = function(){
		kango.console.log(arguments.length == 1 ? arguments[0] : arguments);
	};

var sheet,
	random = 'cp__',
	prefixes = ['webkit', 'moz', 'ms', ''];

var addSelector = function(name, properties){

	if(!sheet)
		sheet = cssjs.newSheet();

	// Add unique identifier
	name = addRandom(name);

	for(var i in properties){
		if(i.indexOf('@') === 0){
			prefixes.forEach(function(prefix){
				properties[(prefix ? ('-' + prefix + '-') : '') + i.replace('@', '')] = properties[i];
			})
			delete properties[i];
		}
		else {
			if ((''+properties[i]).indexOf('@') === 0){
				var prop = properties[i].replace('@', ''),
					ex = ' ';
				properties[i] = [];

				prefixes.forEach(function(prefix){
					properties[i + ex] = (prefix ? ('-' + prefix + '-') : '') + prop;
					ex += ' ';
				})
				delete properties[i];
			}
		}
	}

	sheet.selector(name, properties);

}

var addRandom = function(selector){
	// Add unique identifier
	selector = selector.replace(/\./gi, '.'+random);
	selector = selector.replace(/#/gi, '#'+random);

	return selector;
}

// Create element
function create() {
	switch (arguments.length) {
	case 1:
		var A = document.createTextNode(arguments[0]);
		break;
	default:
		var A = document.createElement(arguments[0]), B = arguments[1];

		if(B.className)
			B.className = random+B.className.replace(/\s/gi, ' '+random);

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
	element.className = element.className.replace(/\s+$/gi, '') + ' ' + random + name;
}

function removeClass(element, name) {
	element.className = element.className.replace(random+name, '');
}