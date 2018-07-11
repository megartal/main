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
        $(this).siblings().removeClass('tab-selected');
        $(this).addClass('tab-selected');
        var tab = $(this).attr('data-elem');
        $(this).parent().siblings('.hotel-inline-item').css('display', 'none');
        if (tab == 'prices')
            $(this).parent().siblings('.hotel-inline-prices').css('display', 'block');
        if (tab == 'desc')
            $(this).parent().siblings('.hotel-inline-desc').css('display', 'block');
        if (tab == 'location') {
            initMap();
            $(this).parent().siblings('.hotel-inline-location').css('display', 'block');
        }
        if (tab == 'facilities')
            $(this).parent().siblings('.hotel-inline-facilities').css('display', 'block');

    });

    $('#new-search').click(function () {
        $('#criteria').toggleClass('edit');
    });

});

function initMap() {
    var hotel = { lat: -25.344, lng: 131.036 };
    var map = new google.maps.Map(
        $('#map'), { zoom: 4, center: hotel });
    var marker = new google.maps.Marker({ position: hotel, map: map });
}



