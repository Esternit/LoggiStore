let limit = 10;
let page = 1;
let scrollneed = 0;
let search = 0;
let searchValue = "";
let tg = window.Telegram.WebApp;
let doning = 0;
let doningsearch = 0;
let timescalled = 0;
let stopscroll = 0;
var BackButton = window.Telegram.WebApp.BackButton;
BackButton.onClick(function () {
    window.location.href = 'index.html';

    BackButton.hide();
    tgk.MainButton.hide();
});

tg.expand();
tg.MainButton.hide();

function resetsearch() {
    search = 1;
    timescalled ++;
    searchValue = new URLSearchParams(window.location.search).get("search");
    page = new URLSearchParams(window.location.search).get("page");
    scrollneed = 1;
    fetch('https://rmstoreapi-production.up.railway.app/searchDataFromStart/' + searchValue, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ limiter: limit, paging: page, store: "Loggi" })
    })
        .then(response => response.json())
        .then(data => loadSearchHTMLTable(data['data']));
}


function loadSearchHTMLTable(data) {
    const ROOT_PRODUCTS = document.getElementById('listing');
    if (data.length > 0) {
        let catalog = '';
        searchValue = document.querySelector('#search-input').value;
        data.forEach(({ img, title, start_price, spuId }) => {
            catalog += `

            <a class="card" id="${spuId}" href="detail.html?id=${spuId}&page=${page}&search=${searchValue}" onclick="getPage()">
                <div class="item">
                    <img src="${img}" alt="" class="img">
                </div>
                <div class="itemname">${title}</div>
                <div class="price">${start_price} ₽</div>
                <div class="btn">Заказать</div>
            </a>
            `;
            /* ₽ */
        });
        const html = `
        <div class="inner">
            ${catalog}
        </div>
        `;
        if (page == 1) {
            ROOT_PRODUCTS.innerHTML = html;
        }
        else {
            ROOT_PRODUCTS.innerHTML += html;
        }


    }
    done = 0;
    let iD = new URLSearchParams(window.location.search).get("spuds");
    if (iD != null){
        let y= document.getElementById(iD).getBoundingClientRect().top;
        if(doningsearch == 0){
            window.scrollTo(0, y);
            doningsearch = 1
        }
    }

    

}

function searchfunc() {
    if (document.querySelector('#search-input') != null) {
        searchValue = document.querySelector('#search-input').value;
        window.location.href="search.html?search="+searchValue
    }

}



function loader() {
    BackButton.hide();
    params = new URLSearchParams(window.location.search);
    const cookieValue = params.get('page');
    const searchinfo = params.get("search");
    console.log(searchinfo);
    if(searchinfo != null && search == 0){
        resetsearch();
    }

    
    else{

        if (doning == 1 || cookieValue == null) {


            fetch('https://rmstoreapi-production.up.railway.app/getAll', {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ limiter: limit, paging: page, store: "Loggi" })
            })
                .then(response => response.json())
                .then(data => loadHTMLTable(data['data']));
        }
        else {
    
    
            console.log(cookieValue, doning);
            fetch('https://rmstoreapi-production.up.railway.app/getAllDataFromStart', {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ limiter: limit, paging: cookieValue, store: "Loggi" })
            })
                .then(response => response.json())
                .then(data => loadHTMLTable(data['data']));
        }
    }

    


}

document.addEventListener('DOMContentLoaded', loader());

function loadHTMLTable(data) {


    if (data.length > 0) {
        let catalog = '';
        console.log(data);
        data.forEach(({ img, title, start_price, spuId }) => {
            catalog += `
            <a class="card" id="${spuId}" href="detail.html?id=${spuId}&page=${page}" onclick="getPage()">
                <div class="item">
                    <img src="${img}" alt="" class="img">
                </div>
                <div class="itemname">${title}</div>
                <div class="price">${start_price} ₽</div>
                <div class="btn">Заказать</div>
            </a>
            `;
        });
        const html = `
        <div class="inner">
            ${catalog}
        </div>
        `;

        const ROOT_PRODUCTS = document.getElementById('listing');
        if (page == 1) {
            ROOT_PRODUCTS.innerHTML = html;
        }
        else {
            ROOT_PRODUCTS.innerHTML += html;
        }

    }
    done = 0;
    params = new URLSearchParams(window.location.search);
    const spuds = params.get('spuds');

    if (doning == 0) {
        if (spuds != null) {
            let y= document.getElementById(spuds).getBoundingClientRect().top;
            window.scrollTo(0, y);
        }

        doning = 1;
    }
    tg.MainButton.hide();
}

function isTextInput(node) {
    return ['INPUT', 'TEXTAREA'].indexOf(node.nodeName) !== -1;
}

document.addEventListener('touchstart', function (e) {
    if (!isTextInput(e.target) && isTextInput(document.activeElement)) {
        document.activeElement.blur();
        console.log(document.activeElement);
    }
}, false);


function showLoading() {
    loading.classList.add('show');

    done = 1;
    setTimeout(() => {
        loading.classList.remove('show');
        setTimeout(() => {

            page++;
            if(search == 0){
                console.log("loader");
                loader();
            }
            else{
                searchfunc();
            }
        }, 300);
    }, 1000);
}

window.addEventListener('scroll', () => {

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 30 && stopscroll == 0) {
        if(done == 0){
            showLoading();
        }
    }
});


function openStory(loadingid){
    var ret = 0;
    var holding = 0;
    var Timer = function(callback, delay) {
        var timerId, start, remaining = delay;
    
        this.pause = function() {
            window.clearTimeout(timerId);
            timerId = null;
            remaining -= Date.now() - start;
            console.log(remaining/1000);
            ret = remaining/1000

        };
    
        this.resume = function() {
            if (timerId) {
                return;
            }
    
            start = Date.now();
            timerId = window.setTimeout(callback, remaining);
        };

        this.break = function(){
            window.clearTimeout(callback);
            console.log("cleared");
        }
    
        this.resume();
    };
    if(stopscroll == 0){
        stopscroll = 1;
        let all = document.getElementsByClassName("stories");
        let finalid = "loading"+loadingid;
        var timeid = "timestamp"+loadingid;
        let textid = "story"+loadingid;
        let storyid="storyouter"+loadingid;
        for (let step = 0; step < all.length; step++) {
            if (all[step].classList[0] == "stories"){
                all[step].classList.replace("stories","text-teletype");
            }
        }
        document.getElementById(finalid).classList.replace("text-teletype","stories");
        document.getElementById(timeid).classList.replace("teletype-header","teletype-header-last");
        document.getElementById(timeid).style.transition="all 15s linear";
        document.getElementById("cont").style.display = "none";
        document.getElementById(storyid).removeAttribute("style");
        if(loadingid == "1"){
            
            document.getElementById(textid).innerText=`	Мы -  команда логистов, разработчиков, дизайнеров и просто хороших людей.

            Доставлять с Poizon мы начали еще в 2022, чуть позже создали свой одноименный блог на YouTube. 

            Для нас очень важно приносить пользу всем нашим клиентам и делать Вас чуть более счастливыми людьми`;
        }
        else if(loadingid == "2"){
            document.getElementById(textid).innerText=`Сразу после оформления заказа товар выкупается на Poizon в Китае и отправляется на наш склад, откуда позже посылка поедет в Россию. 

            Суммарно доставка до Москвы обычно занимает не более 20-25 дней, чаще приходит даже раньше.
            
            А если вдруг нужно привезти что-то срочно, есть варианты экпресс доставки, так, заказ приедет буквально за несколько дней. О такой доставке лучше договориться с менеджером при оформлении заказа.`;
        }
        else if(loadingid == "4"){
            document.getElementById(textid).innerText=`-На Poizon  оригинальные товары?
            -Да, все товары 100% оригинал, а перед отправкой проводится проверка каждой позиции на оригинальность на складе компании Poizon
            
            -Как получить заказ? 
            -Заказ можно либо забрать на нашем складе складе в Москве, либо отправить с помощью СДЕК в любую точку России и Беларуси
            
            -Как долго едет заказ?
            -В среднем доставка занимает 20-25 дней, часто посылка приезжает еще быстрее. `;
        }
        
        document.body.classList.add("blured");
        var timer = new Timer(function() {
            console.log("timer");
            document.getElementsByClassName("stories")[0].classList.replace("stories","text-teletype");
            document.getElementById(timeid).classList.replace("teletype-header-last","teletype-header");
            document.body.classList.remove("blured");
            document.getElementById("cont").removeAttribute("style");
            stopscroll = 0;
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            document.getElementById(textid).innerText = ``;
            document.getElementById(storyid).style.display="none";
        }, 15000);

        document.addEventListener('touchstart', handleTouchStart, false);
        document.addEventListener('touchmove', handleTouchMove, false);
        document.addEventListener('touchend', handleTouchEnd, false);
        
        var yDown = null;

        function handleTouchStart(evt){
            
            if(stopscroll == 1){
                const firstTouch = getTouches(evt)[0];
                yDown = firstTouch.clientY;  
                let stopwidth = document.getElementById(timeid).getBoundingClientRect().width;
                document.getElementById(timeid).classList.replace("teletype-header-last","teletype-header-pause");
                document.getElementById(timeid).style.width = stopwidth+"px";
                timer.pause();
            }
        }

        function handleTouchEnd(){
            if(stopscroll == 1){
                timer.resume();
                document.getElementById(timeid).classList.replace("teletype-header-pause","teletype-header-last");
                document.getElementById(timeid).removeAttribute("style");
                document.getElementById(timeid).style.transition="all "+ret.toString()+"s linear";
            }
        }

        function handleTouchMove(evt){
            var yUp = evt.touches[0].clientY;
            console.log(yDown,yUp)
            var yDiff = yDown - yUp;
            if(yDiff+100 < 0){
                document.getElementsByClassName("stories")[0].classList.replace("stories","text-teletype");
                document.getElementsByClassName("teletype-header-pause")[0].classList.replace("teletype-header-pause","teletype-header");
                document.body.classList.remove("blured");
                document.getElementById("cont").removeAttribute("style");
                document.getElementById(timeid).removeAttribute("style");
                stopscroll = 0;
                timer.break();
                document.removeEventListener('touchstart', handleTouchStart);
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
                document.getElementById(textid).innerText = ``;
                document.getElementById(storyid).style.display="none";
            }
        }

        function getTouches(evt) {
            return evt.touches ||             // browser API
                   evt.originalEvent.touches; // jQuery
          } 

        
    }


    

    
}

function openManager(){
    tg.openTelegramLink("https://t.me/workisthebest");
}