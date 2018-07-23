$(document).ready(function () {
    setDefultDate();
    datePicker();
    autocomplete();
    $('.destination').click(function(){
        var city = $(this).find('h4').text();
        $('#q').attr('value', city);
        $('#cityId').attr('value', city);
        $('#submit-mysearch').trigger('click');
    });
});




