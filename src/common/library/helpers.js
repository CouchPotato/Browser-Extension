/*
 * Helpers
 */

var $ = function(selector){
		return document.querySelector(addRandom(selector));
	},
	p = function(){
		kango.console.log(arguments.length == 1 ? arguments[0] : arguments);
	};

var sheet,
	random = 'cp__',
	prefixes = ['webkit', 'moz', 'ms', ''];

var addSelector = function(name, properties){

	if(!sheet){
		sheet = cssjs.newSheet();
	}

	// Add unique identifier
	name = addRandom(name);

	for(var i in properties){
		if(i.indexOf('@') === 0){
			prefixes.forEach(function(prefix){
				properties[(prefix ? ('-' + prefix + '-') : '') + i.replace('@', '')] = properties[i];
			});
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
				});
				delete properties[i];
			}
		}
	}

	sheet.selector(name, properties);

};

var addRandom = function(selector){
	// Add unique identifier
	selector = selector.replace(/\./gi, '.'+random);
	selector = selector.replace(/#/gi, '#'+random);

	return selector;
};

// Create element
var parseModifiers = function(modifiers){
    modifiers = addRandom(modifiers).match(/[#@&:=\.][^#@&:=\.]+/g);

    if(!modifiers){
		return {};
    }

    var attrs = {},
        i = 0,
        i_max = modifiers.length,
        prefix,
        value;

    for (i = 0; i < i_max; ++i){
        prefix = modifiers[i].charAt(0);
        value = modifiers[i].substr(1).replace(/\s+$/, '');

        if (prefix === '#'){
            attrs.id = value;
        }
        else if (prefix === '.'){
            attrs['class'] = attrs['class'] ? attrs['class'] + ' ' + value : value;
        }

    }

    return attrs;
};

var Scaffold = function(){
	var args = [].splice.call(arguments,0),
		parent = args[0],
		parent_el = parent;

	// Create parent if needed
	if(typeof parent == 'string'){
		var split = parent.match(/^\s*([a-z0-9]+)\s*((?:[#@&:=\.\[][^#@&:=\.]+\s*)*)$/i);
		var attrs = parseModifiers(split[2]);
			parent_el = document.createElement(split[1]);

		if(attrs){
			for(var i in attrs){

				parent_el.setAttribute(i, attrs[i]);
			}
		}
	}

	args.slice(1).forEach(function(el){
		if(el === undefined || el[0] === undefined) {
			return;
		}

		if(el instanceof Array){
			parent_el.appendChild(Scaffold.apply(this, el));
		}
		else {
			parent_el.textContent = el;
		}
	});

	return parent_el;

};

function destroy(element){
	element.parentNode.removeChild(element);
}

function addClass(element, name) {
	element.className = element.className.replace(/\s+$/gi, '') + ' ' + random + name;
}

function removeClass(element, name) {
	element.className = element.className.replace(random+name, '');
}