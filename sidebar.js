

// 윈도우가 로드된 후에
window.onload = function () {
	var tabURL;
	var tabTitle;
	//추가하기 버튼
	document.getElementById("addBtn-wrap").addEventListener("click", () => {
		
		// 추가하기를 누르면 현재 탭들 쿼리에서 0번째를 가져온다
		whale.tabs.query({
			"active": true,
			"lastFocusedWindow": true
		},
		function (tabs) {
			tabURL = tabs[0].url;
			tabTitle = tabs[0].title;
			// 이 함수가 호출되는 타이밍이 늦어서 url을 얻어온 뒤에 ui제어 함수 호출
			clickAddbtn(tabURL, tabTitle);
		});
	});
	
}

function clickAddbtn(URL, title) {
	// UI제어
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

	// set url and title 
	var url_copy = URL, title_copy = title;
	// url setting
	// text overflow 방지
	var length_url = parseInt(window.innerWidth / 11); // 텍스트 길이가 일정 길이를 넘으면
	if(URL.length > length_url) 
	{
		url_copy = URL.substring(0, length_url);
		url_copy += " \u2026";
	}
	document.getElementById("site-url").innerHTML = url_copy;

	// title setting
	var length_title = parseInt(window.innerWidth / 14); // 텍스트 길이가 일정 길이를 넘으면
	if(title.length > length_title) 
	{
		title_copy = title.substring(0, length_title);
		title_copy += " \u2026";
	}
	
	document.getElementById("site-title").innerHTML = title_copy;

	var searchKeyword = getKeywordFromURL(URL);
	if(searchKeyword !== undefined) { // 키워드가 있으면
		// todo : 이미 저장된 페이지인지 검사
		document.getElementById("tag-add-recommand-text").style.visibility = "visible";
		var tag = document.createElement("div");
		tag.classList.add("tag");
		tag.innerHTML = searchKeyword;
		document.getElementById("tags-add-wrap").appendChild(tag);
	}
	// showStorageData('message');
	// removeStorageData('message');
	// // whale.storage.local.get(['message'], (result) => {
	// // 	whale.storage.local.remove('message');
	// // });
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