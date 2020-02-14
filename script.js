// ---------------------- DOCUMENT READY ----------------------
$(document).ready(function() {
    let queryString = "&limit=100";
    let hasPhotoArray = [];
    let currentPetIndex = 0;

    // ---------------------- API CALL ----------------------
    let petFinderAPI = "6gXqqaCV4rGHQFlZapWU444NSW4gmFlZDUnK9TYKUoBf0r2WPg";
    let petFinderSecret = "Js4RQQVKwJyrmKglhelMQX9yiNDSqZ6b4c1p8hMS";
    let dataString = `grant_type=client_credentials&client_id=${petFinderAPI}&client_secret=${petFinderSecret}`;

    //------------------------- REQUESTS PET DATA -------------------------------------
    function petRequest() {
        let query = buildQueryString();
        return getToken().then(function(response) {
            return $.ajax({
                headers: {
                    Authorization: `Bearer ${response.access_token}`
                },
                method: "GET",
                url: `https://api.petfinder.com/v2/animals/?${query}`
            });
        });
    }

    // START AT CURRENTPETINDEX 0, DISPLAY, INDEX + 1
    function irreratePetArr() {
        let currentPet = hasPhotoArray[currentPetIndex];
        $("#pet-name").text(currentPet.name);
        $("#age").html(`Age: <span class="orange-text">${currentPet.age}</span>`);
        $("#size").html(
            `Size: <span class="orange-text">${currentPet.size}</span>`
        );
        $("#pet-image")
            .attr("src", currentPet.photos[0].large)
            .attr("class", currentPet.id);
        let breed = currentPet.breeds.primary;
        addressString = JSON.stringify(
            currentPet.contact.address.address1 +
            " " +
            currentPet.contact.address.city +
            "," +
            currentPet.contact.address.state +
            "," +
            currentPet.contact.address.postcode +
            "," +
            currentPet.contact.address.country
        );
        $("#pet-address").attr("address", addressString);
        address = addressString;
        getWikiArticle(breed).then(function(breedArticle) {
            let $anchor = $("<a>")
                .text(breed)
                .attr("style", "text-decoration: underline;")
                .attr("class", "white-text")
                .attr("href", breedArticle)
                .attr("target", "_blank");
            $("#pet-breed")
                .empty()
                .append($anchor);
        });
        getLatLng(addressString).then(function(currentLatLng) {
            initMap(currentLatLng);
        });
        currentPetIndex++;
    }
    //------------------------- PROCESSES PET DATA -------------------------------------
    function handlePetData() {
        petRequest().then(function(response) {
            let grabSelection = response.animals;

            grabSelection.forEach(function(i) {
                if (i.photos.length > 0) {
                    hasPhotoArray.push(i);
                }
            });
            irreratePetArr();
            $("#display-pet").show();
            $("#pet-image").show();
        });
    }
    //------------------------- GETS PETFINDER TOKEN -------------------------------------
    function getToken() {
        return $.ajax({
            url: "https://api.petfinder.com/v2/oauth2/token",
            method: "POST",
            data: dataString
        });
    }

    // ---------------------- BUILD QUERY STRING WITH SURVEY ----------------------

    function buildQueryString() {
        let grabOptions = $(".option");
        grabOptions.on("click", el => {
            let grabValue = el.target.value;

            if (el.currentTarget.checked == true && el.currentTarget.name == "type") {
                queryString = queryString.concat(`&type=${grabValue}`);
            } else if (
                el.currentTarget.checked == true &&
                el.currentTarget.name == "size"
            ) {
                queryString = queryString.concat(`&size=${grabValue}`);
            } else if (
                el.currentTarget.checked == true &&
                el.currentTarget.name == "age"
            ) {
                queryString = queryString.concat(`&age=${grabValue}`);
            } else if (
                el.currentTarget.checked == true &&
                el.currentTarget.name == "children"
            ) {
                queryString = queryString.concat(`&${grabValue}=${true}`);
            } else if (
                el.currentTarget.checked == true &&
                el.currentTarget.name == "good_with_dogs"
            ) {
                queryString = queryString.concat(`&${grabValue}=${true}`);
            } else if (
                el.currentTarget.checked == true &&
                el.currentTarget.name == "good_with_cats"
            ) {
                queryString = queryString.concat(`&${grabValue}=${true}`);
            }
        });
        return queryString;
    }

    function getBreed() {}

    //-------------------------RETRIVES WIKI ARTICLE-------------------------------------

    function getWikiArticle(currentBreed) {
        var url = "https://en.wikipedia.org/w/api.php";

        var params = {
            action: "opensearch",
            search: currentBreed,
            limit: "5",
            namespace: "0",
            format: "json"
        };

        url = url + "?origin=*";
        Object.keys(params).forEach(function(key) {
            url += "&" + key + "=" + params[key];
        });

        return $.ajax({
                url: url,
                method: "GET"
            })
            .then(function(response) {
                webAddress = response[3][0];
                return Promise.resolve(webAddress);
            })
            .catch(function(error) {
                console.log(error);
            });
    }
    //------------------------- GETS LAT/LONG OF PET -------------------------------------
    function getLatLng(currentAddress) {
        return $.ajax({
            url: `https://api.opencagedata.com/geocode/v1/json?q=${currentAddress}&key=76ccf41f859d4c3ba1e1bebd2d7d68c6`,
            method: "GET"
        }).then(function(response) {
            latLongPosition = response.results[0].geometry;
            return Promise.resolve(response.results[0].geometry);
        });
    }
    //------------------------- EVENTS -------------------------------------
    // ---------------------- START SURVEY ON CLICK ----------------------
    $("#surveyBtn").on("click", function() {
        $("#main-logo-wrapper").hide();
        $("#form-wrapper").show();
    });

    // ---------------------- SUBMIT SURVEY ON CLICK ----------------------
    $("#submit").on("click", function() {
        $("#survey").hide();
        handlePetData();
        $("#form-wrapper").hide();
        $("div#map").removeAttr("class");
    });

    // --------------------- NEXT-PET BUTTON--------------------------------
    $("#next-pet").on("click", function() {
        irreratePetArr();
    });
    //---------------------------INITIALIZE APP-----------------------------
    $("#form-wrapper").hide();
    $("#display-pet").hide();
    $("#pet-image").hide();

    buildQueryString();
});

//------------------------- INITIALIZES MAP -------------------------------------
window.initMap = function(myLatLng = { lat: -25.363, lng: 131.044 }) {
    //var myLatLng = latLongPosition;

    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: myLatLng
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: "Hello World!"
    });
};