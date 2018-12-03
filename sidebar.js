// 윈도우가 로드된 후에
window.onload = function () {
	//추가하기 버튼
	document.getElementById("addBtn-wrap").onclick = function () {
	  	// 추가하기를 누르면 현재 탭들 쿼리에서 0번째를 가져온다
		whale.tabs.query({
				"active": true,
				"lastFocusedWindow": true
			},
			function (tabs) {
				var tabURL = tabs[0].url;
				showDebugText(getKeywordFromURL(tabURL));

			});
	}

	// UI제어
	document.getElementById("addBtn-wrap").addEventListener("click", () => {
		// 추가하기-추가되었습니다 영역
		document.getElementById("addBtn-text").innerHTML = "추가되었습니다!";
		document.getElementById("addBtn-text").style.color = "#1A6DE3";
		document.getElementById("addBtn-text").style.fontWeight = "bold";
		document.getElementById("icon_deactive").style.fill = "#1A6DE3";

		// 추가 영역 나타나기
		document.getElementById("site-wrap").style.visibility = "visible";
		document.getElementById("site-wrap").classList.add("bounceInUp");
		document.getElementById("tags-wrap").style.visibility = "visible";
		document.getElementById("tags-wrap").classList.add("bounceInUp");
	});


}

function showDebugText(text) {
	// log 찍는 div를 만들었어요.. 
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


// 의도하지 않은 페이지 전환 막기 
window.addEventListener(`dragover`, (evt = event) => {
    evt.preventDefault();
    evt.dataTransfer.effectAllowed = `none`;
    evt.dataTransfer.dropEffect = `none`;
}, false);

window.addEventListener(`drop`, (evt = event) => {
    evt.preventDefault();
    evt.dataTransfer.effectAllowed = `none`;
    evt.dataTransfer.dropEffect = `none`;
}, false);