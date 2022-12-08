$(document).ready(function () {
    $('.card').change(function () {//Clicking input radio
        var radioClicked = $(this).find('input[name=listGroupRadio]').attr('id');
        unclickRadio();
        removeActive();
        clickRadio(radioClicked);
        makeActive(radioClicked);
    });
    $(".card").click(function () {//Clicking the card
        var inputElement = $(this).find('input[name=paquete]').attr('id');
        unclickRadio();
        removeActive();
        makeActive(inputElement);
        clickRadio(inputElement);
    });
    $(".card").click(function () {//Clicking the card
        var inputElement = $(this).find('input[name=tipo]').attr('id');
        unclickRadio();
        removeActive();
        makeActive(inputElement);
        clickRadio(inputElement);
    });
});


function unclickRadio(inputElement) {
    $("#" + inputElement).prop("checked", false);
}

function clickRadio(inputElement) {
    $("#" + inputElement).prop("checked", true);
}

function removeActive() {
    $(".card").removeClass("active");
}

function makeActive(element) {
    $("#" + element + "-card").addClass("active");
}
