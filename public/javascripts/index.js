$(document).ready(function () {
    setDefultDate();
    datePicker();
    autocomplete();
    $('.destination').click(function(){
        var hotel = $(this).find('p').text();
        var city = $(this).find('h4').text();
        $('#q').attr('value', hotel);
        $('#cityId').attr('value', city);
        $('#submit-mysearch').trigger('click');
    });
});




