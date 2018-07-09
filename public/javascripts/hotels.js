$(document).ready(function () {
    setDefultDate();
    datePicker();

    $.ajax({
        url: "http://localhost:4000/api/search",
        type: 'POST',
        data: { city: param('q'), from: param('from'), to: param('to'), guest: param('na'), rooms: param('nr') },
        success: function (data) {
            var template = $('#cartId').html();
            var dealTemplate = $('#dealId').html();
            var otaTemplate = $('#OTAId').html();
            data.forEach(function (element) {
                var cardhtml = Mustache.render(template, element);
                var dealHtml = Mustache.render(dealTemplate, element);
                $('#results').append(cardhtml);
                hotelId = '#' + element.hotel_id;
                $(hotelId).append(dealHtml);
                element.ota_results.forEach(function (ota) {
                    var otaHtml = Mustache.render(otaTemplate, ota);
                    $(hotelId + 'ota').append(otaHtml);
                });
            });
        }
    });

    $('#results').on('click', '.expand_details', function () {
        $(this).addClass('hidden');
        $(this).parent().attr('data-icon', 'upBlue before');
        $(this).siblings().removeClass('hidden');
        var hotelId = '#' + $(this).parent().attr('data-hotel') + 'deals';
        $(hotelId).css('display', 'block');
    });

    $('#results').on('click', '.collapse_details', function () {
        $(this).addClass('hidden');
        $(this).parent().attr('data-icon', 'downBlue before');
        $(this).siblings().removeClass('hidden');
        var hotelId = '#' + $(this).parent().attr('data-hotel') + 'deals';
        $(hotelId).css('display', 'none');
    });

    $('#results').on('click', '.cpa-hotel-inline-hide-details', function(){
        $('.collapse_details').trigger('click');
    })

    $('#results').on('click', '.hotel-inline-tab', function () {
        $(this).siblings().removeClass('tab-selected');
        $(this).addClass('tab-selected');
        var tab = $(this).attr('data-elem');
        $(this).parent().siblings('.hotel-inline-item').css('display', 'none');
        if (tab == 'prices')
            $(this).parent().siblings('.hotel-inline-prices').css('display', 'block');
        if (tab == 'desc')
            $(this).parent().siblings('.hotel-inline-desc').css('display', 'block');
        if (tab == 'location')
            $(this).parent().siblings('.hotel-inline-location').css('display', 'block');
        if (tab == 'facilities')
            $(this).parent().siblings('.hotel-inline-facilities').css('display', 'block');

    });

    $('#new-search').click(function () {
        $('#criteria').toggleClass('edit');
    });

});



