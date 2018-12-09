const port = whale.runtime.connect({name : 'urlPort'}); // url전송을 위한 포트

var currURL = window.location.href;

console.log("content_script running");

if(isSearchEngine(currURL) > -1) // 현재 페이지가 검색엔진인가?
{
    document.body.onclick = function(e) {
        var target = e.target;
        var tagName = target.tagName.toLowerCase(); // 클릭한 오브젝트의 태그 이름
        console.log("클릭한 오브젝트는 " + tagName);

        switch(isSearchEngine(currURL)) {
            case 0 : 
                if(tagName === 'a') { // 클릭한 오브젝트가 <a>
                    var href = target.href;
                    //console.log("hyperlink clicked. link is " + href); // href는 리다이렉트 링크임
                    port.postMessage(currURL); // background.js로 메세지 보낸다 (검색창의 URL);
                }
            break;
            case 1 : 
                var parentTagName = target.parentNode.tagName.toLowerCase();
                if(parentTagName === 'a') {
                    var href = target.href;
                    //console.log("hyperlink clicked. link is " + href); // href는 리다이렉트 링크임
                    port.postMessage(currURL); // background.js로 메세지 보낸다 (검색창의 URL);
                }
            break;
        }
        
    }
}

function isSearchEngine(URL) {
    if(URL.match("/search.naver?")) return 0;
    else if(URL.match("/search?")) return 1;
    else return -1;
}
