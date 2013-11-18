var connect = function(){
	kango.browser.tabs.getCurrent(function(tab) {
		if (!tab.isActive()) {
			return;
		}

		tab.dispatchMessage('checkApi');

	});
}

KangoAPI.onReady(function(){
	document.getElementById('connect').addEventListener('click', connect, false);
});