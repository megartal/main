$(document).ready(function () {
    setDefultDate();
    datePicker();

    var results;

    $('#submit-mysearch').click(function () {
        search = collectSearchData();
        window.location.href = "http://localhost:3000/hotels";
        $.ajax({
            url: "http://localhost:4000/api/search",
            type: 'POST',
            data: search,
            success: function (data) {
                window.
                data.forEach(function(element){
                var s = '<p>salam '+ element.hotel_name +'</p>'
                $('#results').append(s);
              }); 
            }
        });
    });

});




