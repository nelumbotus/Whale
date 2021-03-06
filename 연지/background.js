var url;
var urlSearchKeyPairs = [];

//탭이 열릴때마다 생성 (탭의url, 서치키) 
function UrlSearchKeyPair(url, searchKey){
	this.url = url;
	this.searchKey = searchKey;
}


whale.sidebarAction.onClicked.addListener ( () => {
	//alert("사이드바 클릭");  
	//urlSearchKeyPairs 에서, 현재 url을 url값으로 가지는 객체를 찾아서 걔의 search키 얻자..
	document.getElementById("TagRecommend").innerHTML = "<b>url</b> = " + newUnit.url 
		+"<br> <b>tagName</b> = " + newUnit.tags[0]
		+"<br> <b>tagTitle</b> = " + newUnit.title;
} );

whale.tabs.onCreated.addListener( (tab) => { //일단은 Created로 했습니다.. ---(수정필요)--
	var url = tab.url //지금 열린 이 탭의 url 필요해 .. 
	var newUrlSearchKeyPair = new UrlSearchKeyPair(url, getKeywordFromURL(url));
	alert(tab.url);	
	
	urlSearchKeyPairs.push(newUrlSearchKeyPair);
	whale.storage.local.set({pairArray: urlSearchKeyPairs}, function() {
		console.log("pair저장함");
	});
	
});


whale.tabs.onRemoved.addListener( ()=> {
	console.log("tab removed");
	//to Do
	//스토리지에서 "닫힌 이 탭의 url"을 갖는 객체를 제거.------------------------	
	//removeStorageData('url');
});

//여기서 쓰려구.. 가져왔습니다.. 오픈소스...
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

document.body.onclick = function(e) {
	// TODO : 현재 페이지가 검색엔진인지 검사하기

	var target = e.target;
	
	var tagName = target.tagName.toLowerCase(); // 클릭한 오브젝트의 태그이름 얻기
	console.log("tag name : " + target.tagName.toLowerCase());

	// 태그가 <a>일 때 href가져오기
	if(tagName == 'a') {
		var href = target.getAttribute("href");
		alert("hyperlink clicked. link is : " + href);
	}
}

function addURLToStorage(URLvalue) {
	// 스토리지에 url 저장
	whale.storage.local.set({
		url : URLvalue
	}, ()=> {
		if(!whale.runtime.lastError) {
			console.log("url saved");
		}
	});
}

function showStorageData(key) {
	whale.storage.local.get([key], function(result) {
		console.log(result);
	});
}

function removeStorageData(key) {
	whale.storage.local.remove([key], ()=> {
		if(!whale.runtime.lastError) {
			console.log("url removed");
		}
		showStorageData(key);
	});
}
