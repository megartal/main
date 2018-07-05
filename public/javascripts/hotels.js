$(document).ready(function () {
    datePicker();

    var results;

    $('#q').keyup(function () {
        $.ajax({
            url: 'http://localhost:4000/api/city',
            data: { city: $(this).val() },
            success: function (data) {
                $('.autocomplete-suggestions').children().remove();
                data.forEach(function(element){
                    $('.autocomplete-suggestions').append('<div class="autocomplete-suggestion" data-index="0"><small><strong>' + element.city + '</strong></small></div>');
                });
            }
        })
    });

    $('#submit-mysearch').click(function (e) {
        search = collectSearchData();
        $.ajax({
            url: "http://localhost:4000/api/search",
            type: 'POST',
            data: search,
            success: function (data) {
                data.forEach(function(element){
                var s = '<p>salam '+ element.hotel_name +'</p>'
                $('#results').append(s);
              }); 
            }
        });
    });

    $('#hotel-search-form').on('mouseenter', '.autocomplete-suggestion', function () {
        $(this).css("background-color", "#e4e6e8");
        $(this).css("cursor", "pointer");
    });

    $('#hotel-search-form').on('mouseleave', '.autocomplete-suggestion', function () {
        $(this).css("background-color", "white");
        $(this).css("cursor", "pointer");
    });

    $('#hotel-search-form').on('click', '.autocomplete-suggestion', function () {
        var city = $(this).text();
        $('#q').val(city);
        $('.autocomplete-suggestions').children().remove();
    });

    $('#new-search').click(function () {
        $('#criteria').toggleClass('edit');
    });

});

function createResult(element) {

}

function collectSearchData() {
    var search = {};
    search.city = $('#q').val();
    search.from = $('#dateRangePicker').val();
    search.to = $('#dateRangePickerEnd').val();
    search.guest = $('#na').val();
    search.rooms = $('#nr').val();
    return search;
}

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

