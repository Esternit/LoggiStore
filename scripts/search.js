let search = 0;
let limit = 10;
let page = 1;
let doning = 0;

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
        data.forEach(({ img, title, start_price, id }) => {
            catalog += `

            <a class="card" id="${id}" href="detail.html?id=${id}&page=${page}&search=${searchValue}" onclick="getPage()">
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
    if (doning == 1) {
        window.scrollTo(0, document.body.scrollHeight);
        doning = 0;
    }
}

function resetsearch() {
    searchValue = document.querySelector('#search-input').value;
    page = new URLSearchParams(window.location.search).get("page");
    start = new URLSearchParams(window.location.search).get("start");
    if(start == 1){
        doning = 0;
    }
    else{
        doning = 1;
    }
    
    fetch('https://rmstoreapi-production.up.railway.app/searchDataFromStart/' + searchValue, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ limiter: limit, paging: page })
    })
        .then(response => response.json())
        .then(data => loadSearchHTMLTable(data['data']));
}

document.addEventListener('DOMContentLoaded', preload());

function preload() {
    searchValue = document.querySelector('#search-input').value;
    if (searchValue.length != 0) {
        resetsearch();
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
        console.log("here ");
        showLoading();
    }
});