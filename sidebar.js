var maxTags = 4;
var showAll = true;

function Tunit (url, tags, title) { //url, tag들, 탭 이름 3가지를 하나의 객체로 저장.
	this.url = url; //스트링 
	this.tags = tags; //어레이
    this.title = title;
    this.isRemind = false;
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
// search list prototype 
// var list = listProto.cloneNode(true)로 객체 복사 후 search-wrap에 자식으로 붙여 사용
var listProto = document.createElement('div');
listProto.classList.add("UnitList");
listProto.innerHTML = '<div id="list-title-wrap"><div id="list-title">제목</div><div id="list-url">주소</div><div id="list-tags"><div class="list-tag inline-block">#태그</div></div></div><div id="list-setting"><img src="icons/menu.png"></div><div id="list-handleArea"><div class="line" style="margin-bottom: 8px;"></div>X를 눌러 태그 삭제<div id="list-handle-tags"></div><img src="icons/plus_blue.png" style="width: 14px; height: 14px;" id="list-handle-addTagBtn"><input type="text" id="list-handle-tagInput" placeholder="직접 추가"><div id="list-handle-delete">삭제</div></div>'

var units;
var UrlKeyPairs;

whale.sidebarAction.onClicked.addListener(result => {
    if(result.opened) location.reload();
});

window.onload = function() {
    init();

    //추가하기 버튼 클릭
    document.getElementById("addBtn-wrap").addEventListener("click", ()=> {
        whale.tabs.query({
            "active": true,
            "lastFocusedWindow" : true
        },
        function(tabs) {
            var tabTitle = tabs[0].title;
            var tabURL = tabs[0].url;
            ClickAddBtn(tabURL, tabTitle);
        }
        );
    });
    var isSearchAreaOpen = false;
    document.getElementById("searchBtn_svg").addEventListener("click", ()=> {
        if(isSearchAreaOpen) 
        {
            hideSearchArea();
        } else {
            showSearchArea();
        }
        isSearchAreaOpen =!isSearchAreaOpen;
    });
}

function init() {
    getPairArrayFromStorage( () => {
        console.log(UrlKeyPairs);
    });
    getUnitArrayFromStorage( () => {
        console.log(units);
    });

    console.log("------init------");
}
function showSearchArea() {
    document.getElementById("title").style.visibility = "hidden";
    document.getElementById("searchBtn").style.right = '250px';

    document.getElementById("content-wrap").style.display = "none";
    document.getElementById("searchArea-wrap").style.display = "block";

    //최근 추가 순으로 보여주기 
    for (var i = units.length-1; i >= 0; i -- ) {
        document.getElementById("search-wrap").appendChild(createListEle(units[i]));
    }

    document.getElementById("searchInput").addEventListener("keyup", (e) => {
        e.preventDefault();
        
        
        if(document.getElementById("searchInput").value === "") 
        {   
            if(showAll) return;
            if(!showAll) showAll = true;

            for (var i = units.length-1; i >= 0; i -- ) {
                document.getElementById("search-wrap").appendChild(createListEle(units[i]));
            }
        }
        else {
            showAll = false;
            findWithTag(document.getElementById("searchInput").value);
            
        }
    });

}
function hideSearchArea() {
    document.getElementById("title").style.visibility = "visible";
    document.getElementById("searchBtn").style.right = '0px';

    document.getElementById("content-wrap").style.display = "block";
    document.getElementById("searchArea-wrap").style.display = "none";

    document.getElementById("searchInput").value = "";
    
    var searchWrap = document.getElementById("search-wrap");
    while(searchWrap.hasChildNodes()) {
        searchWrap.removeChild(searchWrap.firstChild);
    }
    var myTimer = setTimeout(function() {
        location.reload();
        clearTimeout(myTimer);
    }, 250);
    
}

function ClickAddBtn(URL, title) {
    // 
    var searchKey = "";
    var tags = [];
    getPairArrayFromStorage(() => {
        for (var i = 0; i < UrlKeyPairs.length; i++) {
            if(URL === UrlKeyPairs[i].url) {
                searchKey = UrlKeyPairs[i].searchKey;
                break;
            }
        }
        if(searchKey !== "") {
            tags.push(searchKey);
        }

        var newUnit = new Tunit(URL, tags, title);
        console.log(newUnit);
        getUnitArrayFromStorage(()=> {
            // units에 new unit저장
            var stored = false;
            for (var i = 0; i < units.length; i++) {
                if(units[i].url == URL) {
                    stored = true;
                    newUnit = units[i];
                    break;
                }
            }
            if(!stored) {
                units.push(newUnit);
            }
            //스토리지에 최종 저장
            whale.storage.local.set({unitArray : units}, function() {
                console.log("스토리지에 units저장 완료");
                console.log(units);
                handleAddUI(newUnit);
            });
        });
    });
}

function handleAddUI(unit) {
//UI제어
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
    var url_copy = unit.url, title_copy = unit.title;
    // url setting
    // text overflow 방지
    var length_url = parseInt(window.innerWidth / 11); // 텍스트 길이가 일정 길이를 넘으면
    if(url_copy.length > length_url) 
    {
        url_copy = url_copy.substring(0, length_url);
        url_copy += " \u2026";
    }
    document.getElementById("site-url").innerHTML = url_copy;

    // title setting
    var length_title = parseInt(window.innerWidth / 14); // 텍스트 길이가 일정 길이를 넘으면
    if(title_copy.length > length_title) 
    {
        title_copy = title_copy.substring(0, length_title);
        title_copy += " \u2026";
    }
    document.getElementById("site-title").innerHTML = title_copy;

    var recommandTagArea = document.getElementById("recommanded-tag-area");
    var tagInputForm = document.getElementById("tagInput");
    
    while(recommandTagArea.hasChildNodes()) {
        recommandTagArea.removeChild(recommandTagArea.firstChild);
    }

    if(unit.tags.length > 0) { // unit에 태그가 있으면
        recommandTagArea.style.visibility = "visible";
        document.getElementById("tag-add-recommand-text").style.visibility = "visible";
        for (var i = 0; i < unit.tags.length; i++) {
            var tag = createTagEle_main(unit.tags[i], unit.url);
            recommandTagArea.appendChild(tag);
        }
        
    } else {
        recommandTagArea.style.visibility = "hidden";
    }

    document.getElementById("addTagBtn").addEventListener("click", ()=> {
        var tagInput = tagInputForm.value;
        if(tagInput === "" || tagInput === undefined) return;

        addTagByUrl(unit.url, tagInput, function(flag) {
            if(flag) {
                recommandTagArea.style.visibility = "visible";
                var tag = createTagEle_main(tagInput.value, unit.url);
                recommandTagArea.appendChild(tag);
            }
        });

        
    });
    tagInputForm.addEventListener("keyup", (e)=> {
        e.preventDefault();
        if(e.keyCode === 13 && tagInputForm.value !== "") { // input tag에서 enter btn 눌렀을 때
            addTagByUrl(unit.url, tagInputForm.value, function(flag) {
                if(flag) {
                    recommandTagArea.style.visibility = "visible";

                    var tag = createTagEle_main(tagInput.value, unit.url);
                    recommandTagArea.appendChild(tag);
                }
            });
        }
    });
}

function findWithTag(targetTag) {
    var searchWrap = document.getElementById("search-wrap");
    while(searchWrap.hasChildNodes()) {
        searchWrap.removeChild(searchWrap.firstChild);
    }

    for (var i = units.length-1; i >= 0; i--) {
        for (var k = 0; k < units[i].tags.length; k++) {
            if(targetTag === units[i].tags[k]) {
                
                document.getElementById("search-wrap").appendChild(createListEle(units[i]));
                break;
            }
        }
    }
}

function addTagByUrl(url, tagName, callBack) {//-----------------------------------------------추가
   getUnitArrayFromStorage(function() {
       for (var i = 0; i < units.length; i++) {
           if(units[i].url === url) {

                   //태그를 추가 할 수 없는 경우1 : 태그 개수 제한 넘음.
                   console.log("현재 태그의 개수" + units[i].tags.length);
                    if(units[i].tags.length >= maxTags){

                       callBack(false);
                       return;
                    }
                    //태그를 추가 할 수 없는 경우2 : 이미 있는 태그임.
                    for(var k = 0; k < units[i].tags.length; k++){
                        if(units[i].tags[k] == tagName){

                           callBack(false);
                           return;
                        }
                   }
                   units[i].tags.push(tagName);
                   whale.storage.local.set({unitArray : units}, function() {

                       callBack(true);
                       return;
                   });
                   break;
           }
       }
   })
}
function createTagEle_main(tagName, url) {
    var tag = document.createElement("div");
    tag.classList.add("tag");
    tag.innerHTML = tagName;
    // x 추가
    var removeBtn = document.createElement('img');
    removeBtn.setAttribute('src', 'icons/close_white.svg');
    removeBtn.setAttribute('style', 'cursor:pointer; width:14px; vertical-align: middle; margin-left: 12px;');
    
    removeBtn.onclick = function() {
        removeTagFromUnit(url, tagName);
        tag.style.display = "none";
    }
    tag.appendChild(removeBtn);
    return tag
}

function createTagEle_search(tagName, url) {
    var tag = document.createElement("div");
    tag.classList.add("list-handle-tagEle");
    tag.innerHTML = tagName;

    // x 추가
    var removeBtn = document.createElement('img');
    removeBtn.setAttribute('src', 'icons/close_white.svg');
    removeBtn.setAttribute('style', 'cursor:pointer; width:12px; vertical-align: middle; margin-left: 8px;');
    
    removeBtn.onclick = function() {
        removeTagFromUnit(url, tagName);
        tag.style.display = "none";
    }
    tag.appendChild(removeBtn);
    return tag
}

function createListEle(unit) {
    var ListEle = listProto.cloneNode(true);
    ListEle.querySelector("#list-title").innerHTML = unit.title;
    ListEle.querySelector("#list-url").innerHTML = unit.url;

    var tagArea = ListEle.querySelector("#list-handle-tags");
    var tagsString = "";
    for (var tagIdx = 0; tagIdx < unit.tags.length; tagIdx ++) {
        var tmpString = "# " + unit.tags[tagIdx] + "   ";
        tagsString += tmpString;

        var tag = createTagEle_search(unit.tags[tagIdx], unit.url);
        tagArea.appendChild(tag);
    }
    ListEle.querySelector("#list-tags").innerHTML = tagsString;

    //태그 추가하기
    var tagInputForm = ListEle.querySelector("#list-handle-tagInput");
    tagInputForm.addEventListener("keyup", (e)=> {
        if(e.keyCode === 13 && tagInputForm.value !== "") { //enter button
            var tagName  = tagInputForm.value;

            unit.tags.push(tagName);
            addTagByUrl(unit.url, tagName, function(flag) { //스토리지 저장용
                if(flag) {
                    tagInputForm.value = "";
                    //ui에 나타나게
                    var tag = createTagEle_search(tagName, unit.url);
                    tagArea.appendChild(tag);
                }
            }); 
            
        }
    });
    ListEle.querySelector("#list-handle-addTagBtn").addEventListener("click", ()=> {
        var tagName  = tagInputForm.value;
        unit.tags.push(tagName);
        addTagByUrl(unit.url, tagName, function(flag) { //스토리지 저장용
            if(flag) {
                tagInputForm.value = "";
                //ui에 나타나게
                var tag = createTagEle_search(tagName, unit.url);
                tagArea.appendChild(tag);
            }
        }); 
        
    });

    var listHandleArea = ListEle.querySelector("#list-handleArea");
    ListEle.querySelector("#list-setting").addEventListener("click", ()=> {
        if(listHandleArea.style.display == "none") {
            listHandleArea.style.display = "block";
        }
        else {
            listHandleArea.style.display = "none";
            var tagsString = "";
            for (var tagIdx = 0; tagIdx < unit.tags.length; tagIdx ++) {
                var tmpString = "# " + unit.tags[tagIdx] + "   ";
                tagsString += tmpString; 
            }
            ListEle.querySelector("#list-tags").innerHTML = tagsString;
            console.log(tagsString);
        }
    });
    ListEle.querySelector("#list-handle-delete").addEventListener("click", ()=> {
        removeUnit(unit.url);
        ListEle.style.display = "none";
    });
    
    return ListEle;
}

function removeUnit(url) {
    for(var i = 0; i < units.length; i++){
        if(units[i].url == url){
            units.splice(i,1);
            break;
        }
    }
    whale.storage.local.set({unitArray : units}, ()=> {

    });
}

function removeTagFromUnit(url, tag) {
    //unit에서 tag찾아서 (반드시있음) splice하고 종료..
    console.log(" --- removeTagFromUnit------");
    for(var i = 0; i < units.length; i++){
        if(units[i].url == url){
            for(var k = 0; k < units[i].tags.length; k++) {
                console.log(units[i].tags[k]);
                if(units[i].tags[k] === tag){
                    units[i].tags.splice(k,1);
                    break;
                }
            }
            break; //다른 유닛은 넘어가구
        }
    }
    //스토리지에 units 다시 넣기!
    whale.storage.local.set({unitArray: units}, function() {
        console.log(units);
    });
}

function getPairArrayFromStorage(callbackFunc) {
    whale.storage.local.get(['pairArray'], function(result) {
        if(result.pairArray === null || result.pairArray === undefined) { // storage에 pairArray가 없을 경우
            UrlKeyPairs = [];
        }
        else {
            UrlKeyPairs = result.pairArray;
        }
        callbackFunc();
    });
}
function getUnitArrayFromStorage(callbackFunc) {
    whale.storage.local.get(['unitArray'], function(result) {
        if(result.unitArray === null || result.unitArray === undefined) { // storage에 unitArray가 없을 경우
            units = [];
        }
        else {
            units = result.unitArray;
        }
        callbackFunc();
    });
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