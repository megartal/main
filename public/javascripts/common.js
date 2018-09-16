var qChanged = false;
var qSelected = false;
var city = '';
// var base_url = "http://localhost:4000"
// var base_url = "https://www.jootrip.com";
var base_url = ""
//mouse over on auto complete
$('body').on('mouseenter', '.autocomplete-suggestion', function () {
    $(this).css("background-color", "#e4e6e8");
    $(this).css("cursor", "pointer");
});

//mouse leave on auto complete
$('body').on('mouseleave', '.autocomplete-suggestion', function () {
    $(this).css("background-color", "white");
    $(this).css("cursor", "pointer");
});

//select auto complete suggestion
$('body').on('click', '.autocomplete-suggestion', function () {
    qSelected = true;
    qChanged = false;
    $('#q').val($(this).find('strong').text());
    $('#cityId').val($(this).attr('id'));
    $('.autocomplete-suggestions').children().remove();
});


//close alert
$('.closebtn').click(function () {
    var div = this.parentElement;
    div.style.opacity = "0";
    setTimeout(function () { div.style.display = "none"; }, 10);
});

//form submit
$("form").submit(function (e) {
    if ($('#q').val() == '') {
        $('.alert').css('display', 'block');
        $('.alert').css('opacity', '1');
        return false;
    } else {
        if(!qChanged && !qSelected){
            if (param('city')) {
                $('#cityId').val(param('city'));
            }
        }
        if (qChanged && !qSelected) {
            $('#q').val($('.autocomplete-suggestions').children().first('.autocomplete-suggestion').find('strong').text());
            $('#cityId').val($('.autocomplete-suggestions').children().first('.autocomplete-suggestion').attr('id'));
        }
        return true;
    }
});

//change auto complete imput
$('#q').keydown(function () {
    $('.alert').css('display', 'none');
    $('.alert').css('opacity', '1');
    $.ajax({
        url: base_url + '/api/city',
        data: { term: $('#q').val() },
        success: function (data) {
            $('.autocomplete-suggestions').children().remove();
            data.forEach(function (element) {
                $('.autocomplete-suggestions').append(' <div id="' + element.city + '" class="autocomplete-suggestion"><p><strong>' + element.name + '</strong></p><small><span class="location">' + element.province + '</span><span class="type">' + element.type + '</span></small></div>');
            });
            qChanged = true;
            qSelected = false;
        }
    });
});

// set default date
function setDefultDate() {
    $('#dateRangePicker').val(moment().add(1,'day').locale('fa').format('YYYY/MM/DD'));
    $('#dateRangePickerEnd').val(moment().add(2, 'day').locale('fa').format('YYYY/MM/DD'));
}

//date picker
function datePicker() {
    var $dateRanger = $("#dateRangePicker");
    var $dateRangerEnd = $("#dateRangePickerEnd");
    $dateRanger.datepicker({
        dateFormat: "yy/mm/d",
        minDate: 1,
        maxDate: "+30D"
    });
    $dateRanger.on('change', function (ev) {
        var startDate = $dateRanger.val();
        var endDate = $dateRangerEnd.val();
        // $dateRangerEnd.datepicker('setStartDate', minDate);
        // $dateRangerEnd.data("DateTimePicker").minDate(minDate)
        // $dateRangerEnd.val(selectedDate)
        // $dateRangerEnd.datepicker('remove');
        // $dateRangerEnd.unbind().removeData();
        $dateRangerEnd.datepicker('destroy');
        var mStart = moment.from(startDate, 'fa', 'YYYY/MM/DD');
        var mEnd = moment.from(endDate, 'fa', 'YYYY/MM/DD')
        var diff = mStart.diff(moment(), 'days') + 1;
        mStart.add(1, 'day');
        if (mEnd.isBefore(mStart)) {
            $dateRangerEnd.val(mStart.locale('fa').format('YYYY/MM/DD'));
        }
        $dateRangerEnd.datepicker({
            dateFormat: "yy/mm/d",
            minDate: diff,
            maxDate: "+31D"
        });
    });
    $dateRangerEnd.datepicker({
        dateFormat: "yy/mm/d",
        minDate: 2,
        maxDate: "+31D"
    });

    // $dateRanger.daterangepicker({
    //     clearLabel: 'Clear',
    //     autoUpdateInput: !!(dateFrom && dateTo),
    //     minDate: moment(),
    //     maxDate: moment().add(30, 'days'),
    //     autoApply: true,
    //     opens: isRtl ? 'left' : 'right',
    //     locale: {
    //         separator: ' - ',
    //         format: dateFormat
    //     },
    //     startDate: dateFrom,
    //     endDate: dateTo,
    //     jalaali: isRtl,
    //     showDropdowns: true
    // }).on('apply.daterangepicker', function (ev, picker) {
    //     night = picker.endDate.diff(picker.startDate, 'days');
    //     if (night > 0) {
    //         $(this).val(picker.startDate.format(dateFormat));
    //         $('#dateRangePickerEnd').val(picker.endDate.format(dateFormat));
    //     } else {
    //         $(this).val('')
    //     }
    // });
}

//get url params
function param(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}


//auto complete position absolout
function autocomplete() {
    element = document.getElementById('autocomplete-position');
    var top = $('#autocomplete-position').offset().top - $('#position-fixer').offset().top;
    var rect = element.getBoundingClientRect();
    var width = element.offsetWidth;
    $('.autocomplete-suggestions').css('top', top).css('left', rect.left).css('width', width).css('display', 'block');
}





