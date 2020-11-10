var map;
function initMap() {
    var center = {lat: 37.382093, lng: -122.001715};
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 9,
    center: center
    });

    $.ajax({
    url: "/map",
    type: "GET",
    success: function(data) {
    var mapdata = JSON.parse(data);
    var locationArray = mapdata.locations.location;
    var locationTypes = {
        "Distribution Facility": {
            // marker: "http://maps.google.com/mapfiles/ms/icons/red.png"
            marker: "http://www.googlemapsmarkers.com/v1/a30202/",
            circleColor: "#a30202",
            legendName: "Distribution Facility"
        },
        "HeadQuarters": {
            // marker: "http://maps.google.com/mapfiles/ms/icons/white.png"
            marker: "http://www.googlemapsmarkers.com/v1/faf6eb/",
            circleColor: "#a8a59d",
            legendName: "Head Quarters"
        },
        "Call Center": {
            // marker: "http://maps.google.com/mapfiles/ms/icons/blue.png"
            marker: "http://www.googlemapsmarkers.com/v1/247dad/",
            circleColor: "#247dad",
            legendName: "Call Center"
        },
        "RetailLocation": {
            // marker: "http://maps.google.com/mapfiles/ms/icons/green.png"
            marker: "http://www.googlemapsmarkers.com/v1/5cbf26/",
            circleColor: "#5cbf26",
            legendName: "Retail Location"
        }
    }

    var labels = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var labelpos = 0;
    var legend = document.getElementById('legend');

    for(var i=0; i < locationArray.length; i++) {
        var location = locationArray[i];
        var position = new google.maps.LatLng(location.latitude, location.longitude);
        var currentIcon = locationTypes[location.type].marker;
        // var currentLabel = location.type[0];
        var currentLabel = labels[labelpos++ % labels.length];

        var marker = new google.maps.Marker({
        position: position,
        icon: currentIcon,
        label: {
            text: currentLabel,
            color: 'black',
            fontSize: "8px",
            fontWeight: "bold"
        },
        animation: google.maps.Animation.DROP,
        map: map
        });

        var circle = new google.maps.Circle({
        strokeColor: locationTypes[location.type].circleColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: locationTypes[location.type].circleColor,
        fillOpacity: 0.2,
        map: map,
        center: position,
        radius: Math.sqrt(location.$revenue) * 2
        });

        var div = document.createElement('div');
        div.innerHTML = '<img src="' + currentIcon + '" height=20 width=14> ' + currentLabel + ': ' + location.address;
        legend.appendChild(div);

    }

    // for(var i in locationTypes) {
    //     var currentIcon = locationTypes[i].marker;
    //     var currentLabel = locationTypes[i].legendName[0];
    //     var currentLabelDetails = locationTypes[i].legendName;
    //     var div = document.createElement('div');
    //     div.innerHTML = '<img src="' + currentIcon + '" height=25 width=20> ' + currentLabel + ': ' + currentLabelDetails;
    //     legend.appendChild(div);
    // }
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
    }
    });

}