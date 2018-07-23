var qChanged = false;
var qSelected = false;
var city = '';
var base_url = "http://localhost:4000"
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



//form submit
$("form").submit(function (e) {
    if ($('#q').val() == '') {
        //todo
        element = document.getElementById('autocomplete-position');
        var top = $('#autocomplete-position').offset().top - $('#position-fixer').offset().top;
        var rect = element.getBoundingClientRect();
        var width = element.offsetWidth;
        $('#empty-destination-box').css('top', top).css('left', rect.left).css('display', 'block');
        return false;
    } else {
        if (param('city')) {
            $('#cityId').val(param('city'));
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
    from = new Date();
    from.setDate(from.getDate() + 2);
    to = new Date();
    to.setDate(to.getDate() + 3);
    $('#dateRangePicker').val(moment(from).locale('fa').format('jYYYY/jMM/jDD'));
    $('#dateRangePickerEnd').val(moment(to).locale('fa').format('jYYYY/jMM/jDD'));
}

//date picker
function datePicker() {
    var night;
    var isRtl = true;
    var dateFormat = isRtl ? 'jYYYY/jMM/jDD' : 'YYYY/MM/DD';
    var dateFrom = false ? moment("") : undefined;
    var dateTo = false ? moment("") : undefined;
    var $dateRanger = $("#dateRangePicker");

    $dateRanger.daterangepicker({
        clearLabel: 'Clear',
        autoUpdateInput: !!(dateFrom && dateTo),
        minDate: moment(),
        autoApply: true,
        opens: isRtl ? 'left' : 'right',
        locale: {
            separator: ' - ',
            format: dateFormat
        },
        startDate: dateFrom,
        endDate: dateTo,
        jalaali: isRtl,
        showDropdowns: true
    }).on('apply.daterangepicker', function (ev, picker) {
        night = picker.endDate.diff(picker.startDate, 'days');
        if (night > 0) {
            $(this).val(picker.startDate.format(dateFormat));
            $('#dateRangePickerEnd').val(picker.endDate.format(dateFormat));
        } else {
            $(this).val('')
        }
    });
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





