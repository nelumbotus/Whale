chrome.browserAction.onClicked.addListener( () => {

	//onClicked가 호출 될 때, 열려있는 탭들 : tabs
	//그중 눈에 보이는 탭 : tabs[0]
	//tab의 멤버변수 url, title 등등..
	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
		alert("url ==> " + tabs[0].url + "\n" + "title ==> " + tabs[0].title);
	});
	//chrome.tabs.create( {
	//	url : "http://news.naver.com/"
	//} );
})

