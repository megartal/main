$(document).ready(function () {
    var city = '', star = 0, accomType = 'hotel', flag = true, range = 0, page = 1;
    datePicker();
    search();

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

    //pagination
    $('.hbox').on('click', 'li', function () {
        $(this).siblings().children().removeClass('selected');
        $(this).children().addClass('selected');
        page = $(this).children().text();
        search();
        window.scrollTo(0, 0);
    });

    $('input[name="filter-price"]').on('change', function () {
        $('input[name="filter-price"]').not(this).prop('checked', false);
        if ($(this).prop('checked')) {
            range = $(this).val();
        } else {
            range = 0;
        }
        search();
    });

    $('input[name="filter-category"]').on('change', function () {
        $('input[name="filter-category"]').not(this).prop('checked', false);
        if ($(this).prop('checked')) {
            star = $(this).val();
        } else {
            star = 0
        }
        search();
    });

    $('input[name="filter-city"]').on('change', function () {
        $('input[name="filter-city"]').not(this).prop('checked', false);
        if ($(this).prop('checked')) {
            city = $(this).val()
        } else {
            city = '';
        }
        search();
    });

    $('input[name="filter-accomodationtype"]').on('change', function () {
        $('input[name="filter-accomodationtype"]').not(this).prop('checked', false);
        if ($(this).prop('checked')) {
            accomType = $(this).val();
        } else {
            accomType = 'hotel'
        }
        search();
    });

    $('#hotel-sort').on('change', function () {
        search();
    });

    function search(type, value) {
        if (city == '')
            city = param('q');

        $.ajax({
            url: "http://localhost:4000/api/search",
            type: 'POST',
            data: {
                city: city, from: param('from'), to: param('to'), guest: param('na'), rooms: param('nr'),
                sort: $('#hotel-sort').val(), page: page, star: star, type: accomType, range: range
            },
            success: function (data) {
                if (data) {
                    var template = $('#cartId').html();
                    var dealTemplate = $('#dealId').html();
                    var otaTemplate = $('#OTAId').html();
                    populateChangedData(data);
                    $('#results').children().remove();
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
                            $(hotelId + 'stars').append('<span style="font-size:100%;color:Orange;">&starf;</span>');
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
                } else {
                    $('#results').children().remove();
                    alert('there is no result');
                }

            }
        });
    }

    function populateChangedData(data) {
        $('.search-summary strong').text('');
        $('.search-summary strong').append(data.result_num);
        $('.search-summary em').text('');
        $('.search-summary em').append($('#hotel-sort option:selected').text());
        $('.pagination-summary em').text('');
        $('.pagination-summary em').append(data.query.sort);
        $('.hotel-criteria-destination').text('');
        $('.hotel-criteria-destination').append(data.query.city);
        $('.check-in').text('');
        $('.check-in').append(data.query.from);
        $('.check-out').text('');
        $('.check-out').append(data.query.to);
        $('.guests').text('');
        $('.guests').append(data.query.guest + ' نفر ');
        $('.rooms').text('');
        $('.rooms').append(data.query.rooms + ' اتاق ');
        $('.hbox').children().remove();
        for (var i = 1; i <= Math.ceil((data.result_num / 10)); i++) {
            if (i == page) {
                $('.hbox').append('<li><button class="selected" data-page="' + i + '">' + i + '</button></li>');
            } else {
                $('.hbox').append('<li><button data-page="' + i + '">' + i + '</button></li>');
            }
        }
    }

});


function populateFixData(data) {
    $('.hotel-criteria-destination').append(data.query.city);
    $('.check-in').append(data.query.from);
    $('.check-out').append(data.query.to);
    $('.guests').append(data.query.guest + ' نفر ');
    $('.rooms').append(data.query.rooms + ' اتاق ');
}




