// ---------------------- DOCUMENT READY ----------------------
$(document).ready(function() {
    let queryString = "&limit=100";
    let hasPhotoArray = [];
    let currentPetIndex = 0;
    let matchesArr = [];
    let storedPetData = [];


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
        let name = currentPet.name
        let age = currentPet.age
        let size = currentPet.size
        let image = currentPet.photos[0].large
        let id = currentPet.id
        let breed = currentPet.breeds.primary;
        $("#pet-individual")
            .attr({
                "data-id": id,
                "data-name": name,
                "data-age": age,
                "data-size": size,
                "data-img": image,
                "data-breed": breed
            })
        $("#pet-name").text(name);
        $("#age").html(`Age: <span class="orange-text">${age}</span>`);
        $("#size").html(
            `Size: <span class="orange-text">${size}</span>`
        );
        $("#pet-image")
            .attr("src", image);

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
    //------------------------APPEND LOCAL STORAGE--------------------------------------

    function appendLocalStorage() {
        console.log(storedPetData.id)
        $(".collection").append(`<li class="collection-item avatar li-${storedPetData.id}">`);
        $(`.li-${storedPetData.id}`).append(`<img src='${storedPetData.image}' alt='${storedPetData.name}' class='circle'>`);
        $(`.li-${storedPetData.id}`).append(`<span class="title span-${storedPetData.id}">`);
        $(`.span-${storedPetData.id}`).text(storedPetData.name);
        $(`.li-${storedPetData.id}`).append(`<p class='data-breed p-breed-${storedPetData.id}'>`);
        $(`.p-breed-${storedPetData.id}`).text(storedPetData.breed);
        $(`.li-${storedPetData.id}`).append(`<p class='data-size p-size-${storedPetData.id}'>`);
        $(`.p-size-${storedPetData.id}`).text(storedPetData.size);
        $(`.li-${storedPetData.id}`).append(`<p class='data-age p-age-${storedPetData.id}'>`);
        $(`.p-age-${storedPetData.id}`).text(storedPetData.age);
        $(`.li-${storedPetData.id}`).append(`<a class='secondary-content data-icon a-${storedPetData.id}' href='#!'>`);
        $(`.a-${storedPetData.id}`).append(`<i class='material-icons i-${storedPetData.id}'>`);
        $(`.i-${storedPetData.id}`).text("cancel")
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
            title: "Pet Marker"
        });
    };
    //------------------APPEND LOCAL STORAGE TO LIST------------------------

    function appendData() {

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

    // --------------------- LIKE-PET BUTTON---------------------------------
    $("#like").on("click", function() {

        let name = $(this).parent().parent().attr("data-name");
        let size = $(this).parent().parent().attr("data-size");
        let breed = $(this).parent().parent().attr("data-breed");
        let age = $(this).parent().parent().attr("data-age");
        let image = $(this).parent().parent().attr("data-img");
        let matchID = $(this).parent().parent().attr("data-id");

        let petData = {
            "id": matchID,
            "name": name,
            "breed": breed,
            "image": image,
            "size": size,
            "age": age
        };

        localStorage.setItem(matchID, JSON.stringify(petData))

        matchesArr.push(matchID);
        localStorage.setItem("matches", JSON.stringify(matchesArr))

    });

    // -----------------------MATCH BUTTON----------------------------------
    $("#matches").on("click", function() {
        $("#main-logo-wrapper").hide();
        $("#form-wrapper").hide();
        $("#display-pet").hide();
        $("#map").hide();
        $(".matches-list").empty();
        $(".matches-list").append(`<ul class="collection col s12 m10 l6 offset-l3 offset-m1">`)

        let currentMatches = JSON.parse(localStorage.getItem("matches"))
        console.log(currentMatches);



        for (var i = 0; i < currentMatches.length; i++) {
            storedPetData = JSON.parse(localStorage.getItem(currentMatches[i]))
            console.log(storedPetData);

            appendLocalStorage();

        }



    })


    //---------------------------INITIALIZE APP-----------------------------
    $("#form-wrapper").hide();
    $("#display-pet").hide();
    $("#pet-image").hide();

    buildQueryString();
});