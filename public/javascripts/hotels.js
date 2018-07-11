$(document).ready(function () {
    setDefultDate();
    datePicker();

    $.ajax({
        url: "http://localhost:4000/api/search",
        type: 'POST',
        data: { city: param('q'), from: param('from'), to: param('to'), guest: param('na'), rooms: param('nr'), sort: $('#hotel-sort').val(), page: param('page') },
        success: function (data) {
            var template = $('#cartId').html();
            var dealTemplate = $('#dealId').html();
            var otaTemplate = $('#OTAId').html();
            populateDate(data);
            data.hotel_result.forEach(function (element) {
                var cardhtml = Mustache.render(template, element);
                var dealHtml = Mustache.render(dealTemplate, element);
                $('#results').append(cardhtml);
                hotelId = '#' + element.hotel_id;
                if (element.internet)
                    $(hotelId + 'amenity').append('<span class="hotel_policy hotel_policy_wifi" data-icon="Internet_white before">Wi-Fi</span>');
                if (element.parking)
                    $(hotelId + 'amenity').append('<span class="hotel_policy hotel_policy_parking" data-icon="Parking_positive before">Parking</span>');

                for (var i = 0; i < element.stars; i++) {
                    $(hotelId + 'stars').append('<span style="font-size:100%;color:yellow;">&starf;</span>');
                }
                $(hotelId).append(dealHtml);
                element.ota_results.forEach(function (ota) {
                    ota.hotel_id = element.hotel_id;
                    var otaHtml = Mustache.render(otaTemplate, ota);
                    $(hotelId + 'ota').append(otaHtml);
                    ota.price_info.rooms.forEach(function (roomName) {
                        $(hotelId + ota.ota.id).append('<div class="room_type">' + roomName + '</div>')
                    });
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

    $('#results').on('click', '.cpa-hotel-inline-hide-details', function () {
        $('.collapse_details').trigger('click');
    })

    $('#results').on('click', '.hotel-inline-tab', function () {
        var location = {};
        $(this).siblings().removeClass('tab-selected');
        $(this).addClass('tab-selected');
        var tab = $(this).attr('data-elem');
        var hotel_id = $(this).attr('data-hotel-id');
        $(this).parent().siblings('.hotel-inline-item').css('display', 'none');
        if (tab == 'prices')
            $(this).parent().siblings('.hotel-inline-prices').css('display', 'block');
        if (tab == 'desc')
            $(this).parent().siblings('.hotel-inline-desc').css('display', 'block');
        if (tab == 'location') {
            if ($('#' + hotel_id + 'figure').children().length < 2) {
                location.lat = $(this).attr('data-lat');
                location.lang = $(this).attr('data-lang');
                var template = $('#locationId').html();
                var map = Mustache.render(template, location);
                $('#' + hotel_id + 'figure').prepend(map);
            }
            $(this).parent().siblings('.hotel-inline-location').css('display', 'block');
        }
        if (tab == 'facilities')
            $(this).parent().siblings('.hotel-inline-facilities').css('display', 'block');

    });

    $('#new-search').click(function () {
        $('#criteria').toggleClass('edit');
    });

    $('.hbox').on('click', 'li', function () {
        $(this).siblings().children().removeClass('selected');
        $(this).children().addClass('selected');
        var url;
        if (document.location.href.indexOf('&page') == -1) {
            url = document.location.href + "&page=" + $(this).children().text();
        } else {
            var new_url = document.location.href.substring(0, document.location.href.indexOf('&page'));
            document.location.href = new_url;
            url = document.location.href + "&page=" + $(this).children().text();
        }
        document.location = url;
    })

});

function populateDate(data) {
    $('.hotel-criteria-destination').append(data.query.city);
    $('.check-in').append(data.query.from);
    $('.check-out').append(data.query.to);
    $('.search-summary strong').append(data.result_num);
    $('.search-summary em').append(data.query.sort);
    $('.guests').append(data.query.guest + ' نفر ');
    $('.rooms').append(data.query.rooms + ' اتاق ');
    $('.pagination-summary em').append(data.query.sort);
    for (var i = 0; i < (data.result_num / 10) + 1; i++) {
        j = i + 1;
        if (i == param('page')) {
            $('.hbox').append('<li><button class="selected" data-page="' + j + '">' + j + '</button></li>');
        } else {
            $('.hbox').append('<li><button data-page="' + j + '">' + j + '</button></li>');
        }
    }
}




