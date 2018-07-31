$(document).ready(function () {
    setDefultDate();
    datePicker();
    autocomplete();
    $('.city').click(function(){
        var city = $(this).find('h4').text();
        $('#q').attr('value', city);
        $('#cityId').attr('value', city);
        $('#submit-mysearch').trigger('click');
    });
});




