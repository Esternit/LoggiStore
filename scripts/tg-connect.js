document.addEventListener('DOMContentLoaded', function () {
    let tg = window.Telegram.WebApp;

    tg.expand();

    tg.MainButton.textColor = '#FFFFFF';
    tg.MainButton.color = '#6495ED';

    var elements = document.getElementsByClassName("size");
    console.log(elements);
});