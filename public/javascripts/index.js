$(document).ready(function () {
    setDefultDate();
    datePicker();
    autocomplete();
    $('.city').click(function(){
        var hotel = $(this).find('a').attr('data-q');
        var city = $(this).find('h4').text();
        $('#q').attr('value', hotel);
        $('#cityId').attr('value', city);
        $('#submit-mysearch').trigger('click');
    });
});

// $("form").submit(function (e) {
//     if ($('#q').val() == '') {
//         $('#q').attr('value', $.find('a[data-q]').attr('data-q'));
//     }
// });




