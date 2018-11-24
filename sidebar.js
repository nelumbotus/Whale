// 윈도우가 로드된 후에
window.onload = function () {
	//추가하기 버튼
	document.getElementById("addBtn").onclick = function () {
		whale.tabs.query({
				"active": true,
				"lastFocusedWindow": true
			},
			function (tabs) {
				var tabURL = tabs[0].url;
				showDebugText(getKeywordFromURL(tabURL));

			});
	}
}

function showDebugText(text) {
	// 콘솔열기 귀찮아서 ㅜ log 찍는 div를 만들었어요.. 
	document.getElementById("forDebug").innerHTML = text;
}

function getKeywordFromURL(URL) {
	var params; // 파라미터가 담길 배열
	var param; // 리턴할 파라미터
	URL = decodeURIComponent(URL); // url 디코드 -> 한글 검색어 얻기 위해

	if (URL.match("/search.naver?")) { //검색 창이 네이버일 때

	}
	if (URL.match("/search?")) { // 검색 창이 구글일 때
		// 구글 검색창 : https://www.google.co.kr/search?q=검색어&oq=검색어&aqs=chrome..69i57j0l5&sourceid=chrome&ie=UTF-8
		var tempString = URL.substring(URL.indexOf('q=') + 2); // 검색어 앞부분 자르기
		params = tempString.split('&'); // &으로 뒷부분 split
		param = params[0]; // 잘린 params 중 처음 요소 얻기
	}

	return param;
}