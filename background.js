function UrlKeyPair(url, searchKey) {
    this.url = url;
    this.searchKey = searchKey;
}

var searchURL;
var UrlKeyPairs;
whale.storage.local.get(["pairArray"], function(result) {
    if(result.pairArray === null || result.pairArray === undefined) { // storage에 pairArray가 없을 경우
        UrlKeyPairs = [];
    }
    else {
        UrlKeyPairs = result.pairArray;
    }
});

// contentsScript.js로부터 메세지를 받을 때
whale.runtime.onConnect.addListener(port => {
    if(port.name === 'urlPort') {
        port.onMessage.addListener(message => {
            searchURL = message;
            var keyword = getKeywordFromURL(searchURL);
            //alert(keyword);
            var isCreated = true; //url을 한번만 받아오기 위한 플래그
            whale.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
                if(isCreated === false) return;
                // alert(changeInfo.url);
                // 객체 만들기
                var tabURL = changeInfo.url;
                var newUrlKeyPair = new UrlKeyPair(tabURL, keyword);
                UrlKeyPairs.push(newUrlKeyPair);
                //스토리지에 저장
                whale.storage.local.set({pairArray : UrlKeyPairs}, () => {
                    if(!whale.runtime.lastError) {
                        alert("저장 성공, 길이는 " + UrlKeyPairs.length);
                    }
                });
                if(changeInfo.url !== undefined) isCreated = false;
            });
            
        });
    }
});

// url로부터 검색어를 뽑아주는 함수
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

    param = decodeURIParameter(param); // url 디코드  
	return param;
}
function decodeURIParameter(str) {
    return decodeURIComponent((str+'').replace(/\+/g, '%20'));
}