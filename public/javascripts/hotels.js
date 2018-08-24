var i = 0;
var base_url = "https://www.jootrip.com";
// var base_url = "";
$(document).ready(function () {
    var q = '', city = '', star = 0, accomType = 'hotel', flag = true, range = 0, page = 1;
    datePicker();
    search();

    //مشاهده و بستن قیمت ها
    $('#results').on('click', '.cpa__hotel-card__main-cta', function () {
        if ($(this).children().first().attr('data-icon') == 'downBlue before') {
            $(this).children().first().find('.expand_details').addClass('hidden');
            $(this).children().first().attr('data-icon', 'upBlue before');
            $(this).children().first().find('.collapse_details').removeClass('hidden');
            var hotelId = '#' + $(this).children().first().attr('data-hotel') + 'deals';
            $(hotelId).css('display', 'block');
        } else {
            $(this).children().first().find('.collapse_details').addClass('hidden');
            $(this).children().first().attr('data-icon', 'downBlue before');
            $(this).children().first().find('.expand_details').removeClass('hidden');
            var hotelId = '#' + $(this).children().first().attr('data-hotel') + 'deals';
            $(hotelId).css('display', 'none');
        }
    });
    $('#btn-filter').on('click', function() {
        $('.results-extra ').show();
        $('.results-list-wrapper ').hide();
    });
    $('#btn-filter-apply').on('click', function() {
        $('.results-extra ').hide();
        $('.results-list-wrapper ').show();
    });
    $('#btn-filter-cancel').on('click', function() {
        $('.results-extra ').hide();
        $('.results-list-wrapper ').show();

    });

    $('#results').on('click', '.cpa-hotel-inline-hide-details', function () {
        $('.cpa__hotel-card__main-cta').trigger('click');
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

    //more Images
    $('#results').on('click', '.hotel-thumbnail', function () {
        $('head').append($('<link rel="stylesheet" id="cssLTR" type="text/css" />').attr('href', '/Styles/search-results-ltr.css'));
        var hotelId = $(this).parent().parent().attr('id');
        var template = $('#imageSlideContainerId').html();
        var topSildeTemplate = $('#imageTopSlideId').html();
        var belewSlideTemplate = $('#imagebelowSildeId').html();
        $.ajax({
            url: base_url + "/api/images",
            method: 'POST',
            data: { id: hotelId },
            success: function (data) {
                $('#cssRTL').attr("disabled", "disabled");
                var imageSlides = Mustache.render(template);
                $('#imageContainer').append(imageSlides);
                var last = data.length;
                data.forEach(function (element, index) {
                    element.index = index;
                    var topSlides = Mustache.render(topSildeTemplate, element);
                    var belowSlides = Mustache.render(belewSlideTemplate, element);
                    $('#topSlides').append(topSlides);
                    $('#belowSlides').append(belowSlides);
                });
                $('#detail-hero .swiper-slide:nth-child(1)').addClass('swiper-slide-active');
                $('#detail-hero-thumbnail .swiper-slide:nth-child(1)').addClass('active-thumbnail');
            }
        });
    });

    //مشاهده نقشه
    $('#results').on('click', '.hotel-geo', function () {
        $(this).parent().parent().parent().find('.cpa__hotel-card__main-cta').trigger('click');
        $(this).parent().parent().parent().parent().parent().parent().parent().find('.mapClass').trigger('click');
    });

    //close images
    $('body').on('click', '.close', function () {
        $('#imageContainer').children().remove();
        $('#cssRTL').removeAttr('disabled');
        $('#cssLTR').remove();
    });

    //image right slide hero
    $('body').on('click', '#arrow-right-hero', function () {
        $('#detail-hero .swiper-slide').removeClass('swiper-slide-active');
        $('#detail-hero-thumbnail .swiper-slide').removeClass('active-thumbnail');
        var first = $('#detail-hero .swiper-slide:nth-child(1)');
        first.remove();
        $('#topSlides').append(first);
        $('#detail-hero .swiper-slide:nth-child(1)').addClass('swiper-slide-active');
        var thumbnailId = $('#detail-hero .swiper-slide:nth-child(1)').attr('id');
        $('#detail-hero-thumbnail #' + thumbnailId + '').addClass('active-thumbnail');
    });

    //image left slide  
    $('body').on('click', '#arrow-left-hero', function () {
        slideRight();
    });

    //image right slide below
    $('body').on('click', '#arrow-right', function () {
        for (var i = 0; i < 10; i++) {
            var first = $('#detail-hero-thumbnail .swiper-slide:nth-child(1)');
            first.remove();
            $('#belowSlides').append(first);
        }
    });

    //image left slide below
    $('body').on('click', '#arrow-left', function () {
        for (var i = 0; i < 10; i++) {
            var last = $('#detail-hero-thumbnail .swiper-slide').last();
            last.remove();
            $('#belowSlides').prepend(last);
        }
    });

    //thumbnail image selected
    $('body').on('click', '.swiper-slide', function () {
        while ($(this).attr('id') != $('#detail-hero .swiper-slide:nth-child(1)').attr('id')) {
            slideRight();
        }
    });

    //modal new search
    $('#new_search').click(function () {
        $('#myModal').css('display', 'none');
        location.reload();
    });

    //آیکون جستجوی جدید
    $('#criteria-header').click(function () {
        $('#criteria').toggleClass('edit');
        $('#q').val(param('q').replace(/\+/g, ' '));
        // $('#q').attr('value', param('q').replace(/\+/g, ' '));
        $('#q').text(param('q').replace(/\+/g, ' '));
        $('#dateRangePicker').val(param('from'));
        $('#dateRangePickerEnd').val(param('to'));
        $('#na').find('option:selected').removeAttr("selected");
        $('#na option[value=' + param('na') + ']').attr('selected', 'selected');
        $('#nroom').find('option:selected').removeAttr("selected");
        $('#nroom option[value=' + param('nr') + ']').attr('selected', 'selected');
        autocomplete();
    });

    //pagination
    $('.hbox').on('click', 'li', function () {
        $(this).siblings().children().removeClass('selected');
        $(this).children().addClass('selected');
        page = $(this).children().text();
        search();
        window.scrollTo(0, 0);
    });

    //range filter
    $('input[name="filter-price"]').on('change', function () {
        $('input[name="filter-price"]').not(this).prop('checked', false);
        if ($(this).prop('checked')) {
            range = $(this).val();
        } else {
            range = 0;
        }
        search();
    });

    //star filter
    $('input[name="filter-category"]').on('change', function () {
        $('input[name="filter-category"]').not(this).prop('checked', false);
        if ($(this).prop('checked')) {
            star = $(this).val();
        } else {
            star = 0
        }
        search();
    });

    //city filter
    $('input[name="filter-city"]').on('change', function () {
        $('input[name="filter-city"]').not(this).prop('checked', false);
        if ($(this).prop('checked')) {
            q = $(this).val()
            city = $(this).val()
        } else {
            q = '';
            city = '';
        }
        search();
    });

    //type filter
    $('input[name="filter-accomodationtype"]').on('change', function () {
        $('input[name="filter-accomodationtype"]').not(this).prop('checked', false);
        if ($(this).prop('checked')) {
            accomType = $(this).val();
        } else {
            accomType = 'hotel'
        }
        search();
    });

    //sort change
    $('#hotel-sort').on('change', function () {
        search();
    });

    //reset all filters
    $('#btn-deselect-all-desktop').click(function () {
        $('input[type="checkbox"]').prop('checked', false);
        q = ''; city = ''; star = 0; accomType = 'hotel'; flag = true; range = 0; page = 1;
        search();
    });

    var hotel_results;
    //search method
    function search(type, value) {
        if (q == '')
            q = param('q');
        if (city == '')
            city = param('city');

        if (param('q') != param('city'))
            $('.partition').css('display', 'block');

        $.ajax({
            url: base_url + "/api/search",
            type: 'POST',
            data: {
                q: q, city: city, from: param('from'), to: param('to'), guest: param('na'), rooms: param('nr'),
                sort: $('#hotel-sort').val(), page: page, star: star, type: accomType, range: range
            },
            success: function (data) {
                if (data) {
                    var template = $('#cartId').html();
                    var dealTemplate = $('#dealId').html();
                    var otaTemplate = $('#OTAId').html();
                    populateChangedData(data);
                    hotel_results = data.hotel_result;
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
                        element.ota_results.forEach(function (ota, index) {
                            ota.hotel_id = element.hotel_id;
                            ota.index = index;
                            var otaHtml = Mustache.render(otaTemplate, ota);
                            $(hotelId + 'ota').append(otaHtml);
                        });
                    });
                } else {
                    $('#results').children().remove();
                    $('#myModal').css('display', 'block');
                    // var span = $(".close")[0];
                }

            }
        });
    }

    //redirect
    $('body').on('click', '.hotel-cta-main', function () {
        var hotelId = $(this).attr('hid');
        var otaIndex = $(this).attr('oid');
        var hotelInfo = hotel_results.find(function(h) { return h.hotel_id === hotelId});


        var info = hotelInfo.ota_results[otaIndex||0];
        $(".mainRedirector").attr('href', info.redirect);
        $(".roomsToReserve").html('');
        info.price_info.rooms.forEach(function (room) {
            $(".roomsToReserve").append('<div class="room_type">'+ ''+ room.num +' اتاق "'+room.name +'"' +'</div>')
        });
        // var logo = $(this).find('.partner-logo').css('background-image');
        $("#provider-logo-span").css('background-image', 'url(/images/logo/' + info.ota.logo+')');

        $('#redirectModal').css('display', 'block');
        // $('#redirectURL').attr('href', url);
        // setTimeout(function () {
        //     $('#redirectURL')[0].click()
        // }, 4000);
    });

    //new search
    $('body').on('click', '#new_search', function(){
        // $('#redirectModalContent').children().remove();
        $('#redirectModal').css('display', 'none');
    });

    //populate data on new search 
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
        $('#guests').text('');
        $('#guests').append(data.query.guest + ' نفر ');
        $('#rooms').text('');
        $('#rooms').append(data.query.rooms + ' اتاق ');
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

function slideRight() {
    $('#detail-hero .swiper-slide').removeClass('swiper-slide-active');
    $('#detail-hero-thumbnail .swiper-slide').removeClass('active-thumbnail');
    var last = $('#detail-hero .swiper-slide').last();
    last.remove();
    $('#topSlides').prepend(last);
    $('#detail-hero .swiper-slide:nth-child(1)').addClass('swiper-slide-active');
    var thumbnailId = $('#detail-hero .swiper-slide:nth-child(1)').attr('id');
    $('#detail-hero-thumbnail #' + thumbnailId + '').addClass('active-thumbnail');
}



