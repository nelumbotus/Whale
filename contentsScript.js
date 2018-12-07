var currURL = window.location.href;

document.body.onclick = function (e) {
    if(!isSearchEngine(currURL)) return; // 현재 페이지가 검색 엔진인지 검사
    console.log("curr url is " + currURL);

    var target = e.target;
	var tagName = target.tagName.toLowerCase(); // 클릭한 오브젝트의 태그이름 얻기
    console.log("tag name : " + tagName);

	// 스토리지에 저장
	// whale.storage.local.set({
	// 	message : "hi"
	// });

	// 태그가 <a>일 때 href가져오기
	if (tagName == 'a') {
		var href = target.getAttribute("href");
        console.log("hyperlink clicked. link is : " + href);	
        whale.runtime.sendMessage(currURL); // background js로 메세지 보내기 (검색창의 url)
	}
}
function isSearchEngine(URL) {
    if(URL.match("/search.naver?")) return true;
    else if(URL.match("/search?")) return true;
    else return false;
}

// function getKeywordFromURL(URL) {
// 	var param; // 리턴할 파라미터

// 	if (URL.match("/search.naver?")) { //검색 창이 네이버일 때
// 	  	var tempString = URL.substring(URL.indexOf('query=') + 6); // 검색어 앞부분 자르기
// 		var params = tempString.split('&'); // &으로 뒷부분 split
// 		param = params[0]; // 잘린 params 중 처음 요소 얻기
// 	}
// 	else if (URL.match("/search?")) { // 검색 창이 구글, 다음
// 		// 구글 검색창 : https://www.google.co.kr/search?q=검색어&oq=검색어&aqs=chrome..69i57j0l5&sourceid=chrome&ie=UTF-8
// 		var tempString = URL.substring(URL.indexOf('q=') + 2); // 검색어 앞부분 자르기
// 		var params = tempString.split('&'); // &으로 뒷부분 split
// 		param = params[0]; // 잘린 params 중 처음 요소 얻기
// 	} else return; // 검색 엔진이 아닌 경우 아무것도 리턴하지 않음 

//   	param = decodeURIComponent(param); // url 디코드
// 	return param;
// }