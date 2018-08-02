$(document).ready(function () {
    setDefultDate();
    datePicker();
    autocomplete();
    $('.city').click(function(){
        var city = $(this).find('a').attr('data-q');
        $('#q').attr('value', city);
        $('#cityId').attr('value', city);
        $('#submit-mysearch').trigger('click');
    });
});




