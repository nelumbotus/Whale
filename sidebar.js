//unit객체들을 담은 어레이 입니다.
//storage에 어레이(units) 단 하나만 저장하고
//필요 할 때마다 units를 storage에서 뽑아와서 포문을 돌리며 저장된 객체들을 사용합니다.
var units = []; 
var urlSearchKeyPairs = [];

//추가하기 를 누를 때 새로 생기고,.. 삭제하기를 누를 때 삭제되고
function Tunit (url, tags, title) { //url, tag들, 탭 이름 3가지를 하나의 객체로 저장.
	this.url = url; //스트링 
	this.tags = tags; //어레이
	this.title = title;
}
Tunit.prototype.getUrl = function() {
	return this.url;
}
Tunit.prototype.getTags = function() {
	return this.tags;
}
Tunit.prototype.getTag = function(i) {
	return this.tags[i];
}
Tunit.prototype.addTag = function(tag) {
	this.tags.push(tag);
}
Tunit.prototype.removeTag = function(tagName) {
	for (var i = 0; i < this.tags.length; i++) {
		if(tag[i] === tagName) {
			this.tags.splice(i, 1);
			return;
		}
	}
}

// 윈도우가 로드된 후에
window.onload = function () {
	refreshPages(); //윈도우가 로드 되자마자 storage에서 units를 가져오고, 현재까지 저장된 페이지들 보여줌.

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
			// 키워드, url, title 세개를 묶어 unit 객체를 만들고 스토리지의 unitArray에 추가 -> html 제어
			unitToStorage(getKeywordFromURL(tabURL),tabURL, tabTitle); //검색어, url, "도메인이름" 전달.
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
}

function refreshPages(){
	whale.storage.local.get(["unitArray"], function(result) { 
		units = result.unitArray; //브라우저가 가장 처음 열릴 때를 위해서, .. 

		if(result.unitArray == null ) { //--- 스토리지에 한번도 저장이 안된 경우
			units = [];
		}

		allString = "";
		for(var i = 0; i < result.unitArray.length; i++) {
			allString = allString + result.unitArray[i].title + "<br>";		
		}
		
		whale.storage.local.get(["pairArray"], function(result) {
			urlSearchKeyPairs = result.pairArray;    
			if(result.pairArray == null){//-------storage에 한번도 저장이 안된 경우-------
				urlSearchKeyPairs = [];    
			}//------------------------------------------------------------------------------
		});
		document.getElementById("stored").innerHTML = allString;
	});
}

function unitToStorage(keyword, url,title) { //div에 디버깅 + 스토리지에 저장  --------함수이름 바꿀 것 .. 
	var searchKey = "";
	var tagInput = [];
	tagInput.push(document.getElementsByName("tagInput")[0].value);
	for (var i = 0; i < urlSearchKeyPairs.length; i++) {
		if(url === urlSearchKeyPairs[i].url) {
			searchKey = urlSearchKeyPairs[i].searchKey;
		}
	}
	tagInput.push(searchKey);
	var newUnit = new Tunit(url,tagInput, title); //일단 태그명 대신에 키워드를 넣었습니다..

	document.getElementById("forDebug").innerHTML = "<b>url</b> = " + newUnit.url 
		+"<br> <b>tagName</b> = " + newUnit.tags[0]
		+"<br> <b>tagTitle</b> = " + newUnit.title;

	var stored = false;
	for (var i = 0; i < units.length; i ++) {
		if(units[i].url == url) {
			stored = true;
			break;
		}
		if(!stored) {
			units.push(newUnit);
		}
	}
	whale.storage.local.set({unitArray: units}, function() {
		console.log("저장함");
	});
	refreshPages(); 	//스토리지에 저장된 unitArray로 units를 갱신하고, units어레이의 모든 unit을
						// stored <div>에 표시함
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