//url과 tag여러개(어레이)를 멤버변수로 갖는 클래스
//객체생성법 : var newUnit = new Tunit(url(스트링), tags(어레이));
function Tunit (url, tags){
	this.url = url; //스트링 
	this.tags = tags; //어레이
	this.num = 
	
	this.getUrl = function(){
		return url;
	}
	this.getTags = function(){
		return tags;	
	}
}


// 윈도우가 로드된 후에
window.onload = function () {
	//추가하기 버튼
	document.getElementById("addBtn").onclick = function () {
	  	// 추가하기를 누르면 현재 탭들 쿼리에서 0번째를 가져온다
		whale.tabs.query({
				"active": true,
				"lastFocusedWindow": true
			},
			function (tabs) {
				var tabURL = tabs[0].url;
				showDebugText(getKeywordFromURL(tabURL));
				showDebugText2(getKeywordFromURL(tabURL),tabURL);
			});
	}
}

function showDebugText(text) {
	// log 찍는 div를 만들었어요.. 
	document.getElementById("forDebug").innerHTML = text;
}

function showDebugText2(keyword,url) {
	//url과 태그를 찍는 .. 메소드에요 ..
	var tagInput = document.getElementsByName("tagInput")[0].value;
	var newUnit = new Tunit(url,[tagInput]); //일단 태그명 대신에 키워드를 넣었습니다..
	document.getElementById("forDebug").innerHTML = "<b>url</b> = " + newUnit.url + "<br> <b>tagName</b> = " + newUnit.tags[0]; //
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