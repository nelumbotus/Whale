chrome.browserAction.onClicked.addListener( () => {
	console.log("왜 안대냐고");
	chrome.tabs.create( {
		url : "http://news.naver.com/"
	} );
})

