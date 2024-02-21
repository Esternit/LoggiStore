let tg = window.Telegram.WebApp;

tg.expand();

tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#2cab37';

if (tg.MainButton.isVisible) {
    tg.MainButton.hide();
}

let item = {};
var BackButton = window.Telegram.WebApp.BackButton;
BackButton.show();
BackButton.onClick(function () {
    const Id = new URLSearchParams(window.location.search).get('id');
    const paging = new URLSearchParams(window.location.search).get('page');
    const sh = new URLSearchParams(window.location.search).get('search');
    if (sh != null) {
        window.location.href = 'search.html?page=' + paging + "&spuds=" + Id + "&search=" + sh;
    }
    else {
        doning = 1;
        window.location.href = 'index.html?page=' + paging + "&spuds=" + Id;
    }

    BackButton.hide();
    tg.MainButton.hide();
});

document.addEventListener('DOMContentLoaded', function () {
    const Id = new URLSearchParams(window.location.search).get('id');
    fetch('https://rmstoreapi-production.up.railway.app/getById', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ productId: Id })
    })
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));

});

function loadHTMLTable(data) {
    const outData = data['base'];
    const innerData = data['sizes']
    let html = `
    <div id="itemCarousel" class="carousel slide" data-ride="carousel" data-interval="3000">
        <div class="carousel-control-prev" href="#itemCarousel" role="button" data-slide="prev"></div>
        <div class="carousel-inner">
    `+ fillCarousel(data) + `
        </div>
        <div class="carousel-control-next" href="#itemCarousel" role="button" data-slide="next"></div>
    </div>
    `;
    const ROOT_SIZIING = document.getElementById('sizing');
    const ROOT_PRODUCTS = document.getElementById('usercard');

    const PRICE = document.getElementById('price');
    PRICE.innerText = outData[0].start_price + " ₽";

    innerData.forEach(({ name_size, price }) => {
        let inner = document.createElement('div');
        inner.className = 'size';
        inner.innerHTML = ` ${name_size}<br />${price} ₽`;
        inner.addEventListener("click", function () {
            // replacing price
            const PRICE = document.getElementById('price');
            PRICE.innerText = price + " ₽";

            // showing purchase button
            item = JSON.stringify({
                title: outData[0]["title"],
                pricing: price,
                size_name: name_size,
                id: outData[0]["spuId"],
                img: outData[0]["img"],
                article: outData[0]["article"]
            });
            tg.MainButton.setText("Перейти в чат с менеджером");
            tg.MainButton.show();
        })

        ROOT_SIZIING.appendChild(inner);
    });


    ROOT_PRODUCTS.innerHTML = html;
    const ROOT_NAME = document.getElementById('naming');
    ROOT_NAME.innerText = outData[0]["title"];

    enableCarouselSwiping();
}

function fillCarousel(data) {
    let carouselItems = `
        <div class="carousel-item active">
            <img src="${data['base'][0]["img"]}" class="image">
        </div>
    `;

    for (let i = 0; i < data["images"].length; i++) {
        carouselItems += `
        <div class="carousel-item">
            <img src="${data["images"][i].image}" alt="" class="d-block image">
        </div>
        `;
    }

    return carouselItems;
}

function enableCarouselSwiping() {
    const itmCar = document.querySelector("#itemCarousel");
    itmCar.addEventListener('touchstart', moveSlideByTouch);
}

function moveSlideByTouch(event) {
    const xClick = event.touches[0].pageX;
    console.log($(".carousel"));

    $(".carousel").one('touchmove', function (event) {
        const xMove = event.originalEvent.touches[0].pageX;
        const sensitivityInPx = 5;
        console.log("here111");

        if (Math.floor(xClick - xMove) > sensitivityInPx) {
            $(".carousel").find(".carousel-control-next").click();
        } else if (Math.floor(xClick - xMove) < -sensitivityInPx) {
            $(".carousel").find(".carousel-control-prev").click();
        }
    });

    $(".carousel").on('touchend', function () {
        $(".carousel").off('touchmove');
    });
}

Telegram.WebApp.onEvent("mainButtonClicked", function () {
    tg.sendData(item);
});

function test() {
    const Id = new URLSearchParams(window.location.search).get('id');
    const paging = new URLSearchParams(window.location.search).get('page');
    doning = 1;
    window.location.href = 'index.html?page=' + paging + "&spuds=" + Id;
    BackButton.hide();
    tg.MainButton.hide();

}

function backfunc() {
    const Id = new URLSearchParams(window.location.search).get('id');
    const paging = new URLSearchParams(window.location.search).get('page');
    const sh = new URLSearchParams(window.location.search).get('search');
    if (sh != null) {
        window.location.href = 'search.html?page=' + paging + "&spuds=" + Id + "&search=" + sh;
    }
    else {
        doning = 1;
        window.location.href = 'index.html?page=' + paging + "&spuds=" + Id;
    }

}

function poizonOpener() {
    const Id = new URLSearchParams(window.location.search).get('id');
    let link = "https://m.dewu.com/router/product/ProductDetail?spuId=" +Id+"&sourceName=shareDetail&skuId=&fromUserId=048b9570ac482c65b6de33c0f386c0da&share_platform_title=7&outside_channel_type=0"
    tg.openLink(link);
    console.log("opened");
}

function testfunc(){
    const Id = new URLSearchParams(window.location.search).get('id');
    const paging = new URLSearchParams(window.location.search).get('page');
    const sh = new URLSearchParams(window.location.search).get('search');
    if (sh != null) {
        window.location.href = 'search.html?page=' + paging + "&spuds=" + Id + "&search=" + sh;
    }
    else {
        doning = 1;
        window.location.href = 'search.html?page=' + paging + "&spuds=" + Id;
    }

    BackButton.hide();
    tg.MainButton.hide();
}