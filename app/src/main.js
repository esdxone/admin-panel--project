import $ from 'jquery';

function getPageList() {
    $("h1").remove();
    $.get("./api", data => {
        data.forEach(item => {
            $("body").append(`<h1>${item}</h1>`);
        })
    }, "JSON");
}

getPageList();

$(".js-create-page").click(function() {
    $.post("./api/createNewPage.php", {
        "name": $('.js-page-name').val()
    }, () => {
        getPageList();
    })
    .fail(() => {
        alert("Страница уже существует!");
    })
})