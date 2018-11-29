var url;

whale.sidebarAction.onClicked.addListener( () => {
	//alert("사이드바 눌림"); //=> 나옴니다.
	console.log("side bar clicked");
	//addURLToStorage(url);
	//showStorageData('url');
	} );


whale.tabs.onRemoved.addListener( ()=> {
	//alert("탭 안녕"); //=> 나옴니다.
	console.log("tab removed");
	//removeStorageData('url');
});

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
