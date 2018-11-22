var url;

whale.sidebarAction.onClicked.addListener( () => {
	console.log("side bar clicked");
	addURLToStorage(url);
	showStorageData('url');
	} );

whale.tabs.onCreated.addListener( function(tab) {
		url = tab.url;
});

whale.tabs.onUpdated.addListener( function(tabId, changeInfo, tab) {
		if(url === "") {
			url = tab.url;
			console.log(url);
		}
});

whale.tabs.onRemoved.addListener( ()=> {
	removeStorageData('url');
});

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