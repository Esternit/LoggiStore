let tgl = window.Telegram.WebApp;
let page = 1;
let limit = 10;
const loading = document.querySelector('.loader');
let done = 0;
let needscroll=0;

tgl.expand();
var BackButton = window.Telegram.WebApp.BackButton;
BackButton.onClick(function () {
    window.location.href="index.html";

    BackButton.hide();
    tg.MainButton.hide();
});
function loadsearch() {
    BackButton.show();
    const sh = new URLSearchParams(window.location.search).get('search');
    const trypage = new URLSearchParams(window.location.search).get('page');
    let searcher = document.getElementById("searcher");
    let test = document.createElement("div");
    test.className = "search";
    test.innerHTML += `<input placeholder="Поиск по названию" id="search-input" class = "wideinputbox"  />`;
    test.innerHTML +=`<div class = "search-btn" onclick="setsearch()"><ion-icon name="arrow-forward-circle-outline" class = "icon-search"></ion-icon></div>`

    searcher.appendChild(test);
    if (sh != null) {
        document.getElementById("search-input").value = sh;
        if (trypage != null){
            page=parseInt(trypage);
            resetsearch();
        }
        else{
            searchfunc();
        }
        

    }
    
}

function setsearch(){
    if (document.querySelector('#search-input') != null){
        window.location.href="search.html?search="+document.querySelector('#search-input').value
    }
    
}

function resetsearch(){
    const sh = new URLSearchParams(window.location.search).get('search');
    const trypage = new URLSearchParams(window.location.search).get('page');
    needscroll = 1;
    fetch('https://rmstoreapi-production.up.railway.app/searchDataFromStart/' + sh, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ limiter: limit, paging: parseInt(trypage) })
    })
        .then(response => response.json())
        .then(data => loadSearchHTMLTable(data['data']));


}

function searchfunc() {
    if (document.querySelector('#search-input') != null) {
        searchValue = document.querySelector('#search-input').value;
    }
    console.log(searchValue);
    if (searchValue.length == 0) {
        page = 1;
    }
    else {
        console.log(page);
        fetch('https://rmstoreapi-production.up.railway.app/search/' + searchValue, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ limiter: limit, paging: page })
        })
            .then(response => response.json())
            .then(data => loadSearchHTMLTable(data['data']));
    }

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
        
        params = new URLSearchParams(window.location.search);
        const spuds = params.get('spuds');
        done=0;
        if(needscroll == 1){
            let y= document.getElementById(spuds).getBoundingClientRect().top;
            window.scrollTo(0, y);
        }
    
    }
}

function showLoading() {
    loading.classList.add('show');

    done = 1;
    setTimeout(() => {
        loading.classList.remove('show');
        setTimeout(() => {
            page++;
            searchfunc();

        }, 300);
    }, 1000);
}

window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 30 && done == 0) {
        if(needscroll == 0){
            console.log("here ");
            done = 1;
            showLoading();
        }
        else{
            needscroll=0;
        }

    }
});

loadsearch();