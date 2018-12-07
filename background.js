// function Tunit (url, tags){
// 	this.url = url; //스트링 
// 	this.tags = tags; //어레이
// 	this.num = "";
	
// 	// this.getUrl = function(){
// 	// 	return url;
// 	// }
// 	// this.getTags = function(){
// 	// 	return tags;	
// 	// }
// }
// // 객체 메소드 정의
// Tunit.prototype.getUrl = function() {
// 	return this.url;
// }
// Tunit.prototype.getTags = function() {
// 	return this.tags;
// }
// Tunit.prototype.removeTag = function() {

// }
// Tunit.prototype.addTag = function() {

// }

var searchURL;
var tabURL;
var tabTitle;
var UrlSearchKeyPairs = [];

//탭이 열릴때마다 생성 (탭의url, 서치키) 
function UrlSearchKeyPair(url, searchKey){
	this.url = url;
	this.searchKey = searchKey;
}

//콘텐츠스크립트에서 url 메세지를 받는다 (검색 엔진에서 하이퍼 링크를 클릭했을 때 검색 엔진의 url이 메세지로 옴)
whale.runtime.onMessage.addListener((message, sender, sendResponse) => {
	searchURL = message;
	var searchKeyword = getKeywordFromURL(searchURL);
	whale.sidebarAction.show();
	var isCreated = true; // url을 한번만 받아오기 위한 플래그
	// 메세지를 받았으면 열려 있는 페이지의 url과 title을 가져옴 
	whale.tabs.onCreated.addListener(() => {
		whale.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
			if(isCreated === false) return; 
			if(changeInfo.status === "complete") 
			{
				whale.tabs.query({
					"active": true,
				},
				function (tabs) {
					tabURL = tabs[0].url;
					tabTitle = tabs[0].title;
					// 이 함수가 호출되는 타이밍이 늦어서 url을 얻어온 뒤에 스토리지 저장
					var newUrlSearchKeyPair = new UrlSearchKeyPair(tabURL, searchKeyword);
					UrlSearchKeyPairs.push(newUrlSearchKeyPair);
					alert(tabURL+ " 검색어 : " + searchKeyword);
					// whale.storage.local.set({pairArray: UrlSearchKeyPairs}, () => {
					// 	console.log("pair 저장함");
					// }); 
				});
				isCreated = false;
			}
		 });
	});
});

whale.sidebarAction.onClicked.addListener(() => {
	//addURLToStorage(url);
	//showStorageData('url');
});


whale.tabs.onRemoved.addListener(() => {
	console.log("tab removed");
	//removeStorageData('url');
});

// document.body.onclick = function (e) {
// 	// TODO : 현재 페이지가 검색엔진인지 검사하기
// 	var target = e.target;

// 	var tagName = target.tagName.toLowerCase(); // 클릭한 오브젝트의 태그이름 얻기
// 	console.log("tag name : " + target.tagName.toLowerCase());

// 	// 스토리지에 저장
// 	// whale.storage.local.set({
// 	// 	message : "hi"
// 	// });

// 	// 태그가 <a>일 때 href가져오기
// 	if (tagName == 'a') {
// 		var href = target.getAttribute("href");
// 		alert("hyperlink clicked. link is : " + href);		
// 	}
// }

function addURLToStorage(URLvalue) {
	// 스토리지에 url 저장
	whale.storage.local.set({
		url: URLvalue
	}, () => {
		if (!whale.runtime.lastError) {
			console.log("url saved");
		}
	});
}

function showStorageData(key) {
	whale.storage.local.get([key], function (result) {
		console.log(result);
	});
}

function removeStorageData(key) {
	whale.storage.local.remove([key], () => {
		if (!whale.runtime.lastError) {
			console.log("url removed");
		}
		showStorageData(key);
	});
}

function showDebugText(text) {
	// 디버그용
	document.getElementById("forDebug").innerHTML = text;
}

function getKeywordFromURL(URL) {
	var param; // 리턴할 파라미터

	if (URL.match("/search.naver?")) { //검색 창이 네이버일 때
	  	var tempString = URL.substring(URL.indexOf('query=') + 6); // 검색어 앞부분 자르기
		var params = tempString.split('&'); // &으로 뒷부분 split
		param = params[0]; // 잘린 params 중 처음 요소 얻기
	}
	else if (URL.match("/search?")) { // 검색 창이 구글, 다음
		// 구글 검색창 : https://www.google.co.kr/search?q=검색어&oq=검색어&aqs=chrome..69i57j0l5&sourceid=chrome&ie=UTF-8
		var tempString = URL.substring(URL.indexOf('q=') + 2); // 검색어 앞부분 자르기
		var params = tempString.split('&'); // &으로 뒷부분 split
		param = params[0]; // 잘린 params 중 처음 요소 얻기
	} else return; // 검색 엔진이 아닌 경우 아무것도 리턴하지 않음 

  	param = decodeURIComponent(param); // url 디코드
	return param;
}