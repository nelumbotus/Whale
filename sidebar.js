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
listProto.innerHTML = '<div id="list-title-wrap"><div id="list-title">제목</div><div id="list-url">주소</div><div id="list-tags"><div class="list-tag inline-block">#태그</div></div></div><div id="list-setting">...</div><div id="list-handleArea"></div>'

var units;
var UrlKeyPairs;

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
        var ListEle = listProto.cloneNode(true);
        ListEle.querySelector("#list-title").innerHTML = units[i].title;
        ListEle.querySelector("#list-url").innerHTML = units[i].url;

        var tagsString = "";
        for (var tagIdx = 0; tagIdx < units[i].tags.length; tagIdx ++) {
             var tmpString = "# " + units[i].tags[tagIdx] + "   ";
            tagsString += tmpString;
        }
        ListEle.querySelector("#list-tags").innerHTML = tagsString;
        document.getElementById("search-wrap").appendChild(ListEle);
    }

    document.getElementById("searchInput").addEventListener("keyup", (e) => {
        e.preventDefault();
        if(document.getElementById("searchInput").value === "") 
        {
            for (var i = units.length-1; i > 0; i -- ) {
                var ListEle = listProto.cloneNode(true);
                ListEle.querySelector("#list-title").innerHTML = units[i].title;
                ListEle.querySelector("#list-url").innerHTML = units[i].url;
        
                var tagsString = "";
                for (var tagIdx = 0; tagIdx < units[i].tags.length; tagIdx ++) {
                     var tmpString = "# " + units[i].tags[tagIdx] + "   ";
                    tagsString += tmpString;
                }
                ListEle.querySelector("#list-tags").innerHTML = tagsString;
                document.getElementById("search-wrap").appendChild(ListEle);
            }
        }
        else {
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
        for (var i = 0; i < unit.tags.length; i++) {
            var tag = document.createElement("div");
            tag.classList.add("tag");
            tag.innerHTML = unit.tags[i];
            recommandTagArea.appendChild(tag);
        }
        
    } else {
        recommandTagArea.style.visibility = "hidden";
    }

    document.getElementById("addTagBtn").addEventListener("click", ()=> {
        var tagInput = tagInputForm.value;
        if(tagInput === "" || tagInput === undefined) return;

        addTagByUrl(unit.url, tagInput);

        recommandTagArea.style.visibility = "visible";
        var tag = document.createElement("div");
        tag.classList.add("tag");
        tag.innerHTML = tagInput;
        recommandTagArea.appendChild(tag);
    });
    tagInputForm.addEventListener("keyup", (e)=> {
        e.preventDefault();
        if(e.keyCode === 13 && tagInputForm.value !== "") { // input tag에서 enter btn 눌렀을 때
            addTagByUrl(unit.url, tagInputForm.value);

            recommandTagArea.style.visibility = "visible";
            var tag = document.createElement("div");
            tag.classList.add("tag");
            tag.innerHTML = tagInputForm.value;
            recommandTagArea.appendChild(tag);
            tagInputForm.value = "";
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
                
                var ListEle = listProto.cloneNode(true);
                ListEle.querySelector("#list-title").innerHTML = units[i].title;
                ListEle.querySelector("#list-url").innerHTML = units[i].url;
        
                var tagsString = "";
                for (var tagIdx = 0; tagIdx < units[i].tags.length; tagIdx ++) {
                        var tmpString = "# " + units[i].tags[tagIdx] + "   ";
                    tagsString += tmpString;
                }
                ListEle.querySelector("#list-tags").innerHTML = tagsString;
                document.getElementById("search-wrap").appendChild(ListEle);
                break;
            }
        }
    }
}

function addTagByUrl(url, tagName) {
    getUnitArrayFromStorage(function() {
        for (var i = 0; i < units.length; i++) {
            if(units[i].url === url) {
                units[i].tags.push(tagName);
                console.log("태그 추가");
                break;
            }
        }
        whale.storage.local.set({unitArray : units}, function() {
            console.log("태그 추가 완료")
            console.log(units);
        });
    })
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