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
        tags.push(searchKey);

        var newUnit = new Tunit(URL, tags, title);
        console.log(newUnit);
        getUnitArrayFromStorage(()=> {
            // units에 new unit저장
            var stored = false;
            for (var i = 0; i < units.length; i++) {
                if(units[i].url == URL) {
                    stored = true;
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

                if(searchKey !== "") { // searchKey가 있으면
                    document.getElementById("tag-add-recommand-text").style.visibility = "visible";
                    var tag = document.createElement("div");
                    tag.classList.add("tag");
                    tag.innerHTML = searchKey;
                    document.getElementById("tags-add-wrap").appendChild(tag);
                }

            });
        });
    });
}

function handleAddUI() {

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