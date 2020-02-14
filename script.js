// ---------------------- DOCUMENT READY ----------------------
$(document).ready(function() {
    let queryString = "&limit=100";
    let grabOptions = $(".option");
    let hasPhotoArray = [];
    let currentPetIndex = 0;
    matchesArr = [];
    fs

    // ---------------------- API CALL ----------------------
    let petFinderAPI = "6gXqqaCV4rGHQFlZapWU444NSW4gmFlZDUnK9TYKUoBf0r2WPg";
    let petFinderSecret = "Js4RQQVKwJyrmKglhelMQX9yiNDSqZ6b4c1p8hMS";
    let petFinderToken =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjI1MDEzZTc4MDlhZmQ3MjIyNjE3MzQyMTk2NWM5YThjY2U2N2RhNjdmNmQzYzM1OWViMDdkZjFjN2IzZTYzMjRjMDc3N2E1ZWI1YWIxZTg1In0.eyJhdWQiOiI2Z1hxcWFDVjRyR0hRRmxaYXBXVTQ0NE5TVzRnbUZsWkRVbks5VFlLVW9CZjByMldQZyIsImp0aSI6IjI1MDEzZTc4MDlhZmQ3MjIyNjE3MzQyMTk2NWM5YThjY2U2N2RhNjdmNmQzYzM1OWViMDdkZjFjN2IzZTYzMjRjMDc3N2E1ZWI1YWIxZTg1IiwiaWF0IjoxNTgwOTQ2Njk4LCJuYmYiOjE1ODA5NDY2OTgsImV4cCI6MTU4MDk1MDI5OCwic3ViIjoiIiwic2NvcGVzIjpbXX0.lS7OOFQ4sYhtlB9Qbw0JvV8aXb3AiIuQb4CgPZjqvxVQAExKka3_uHbXPad2wRMX-t_P14MIYkQu9Zgwjxgl4naXu0Ka8q8buZnU8ZBVNJYk5cLa4Q2II9HiEmyW6NIaRC2TVkq96Pa3Bz16pP_0A9PgUgQVjw3TdPi8iP9eie9WwmprLsxwxxp3w980cGccYxXMEP7vz-Ky8P-V3iwqTpd-776V29DPVQXt8I7t8Z9ed3VV0w4ohw81SPSleq_TEY1gAkg3uPhEThJ9oLUvAHyfzjRauu1tDVG-ee8FAqsE8yVpwBMHOWSJS_8rb9icjmUEaE5f9aLzRhioY4bpGg";
    let dataString = `grant_type=client_credentials&client_id=${petFinderAPI}&client_secret=${petFinderSecret}`;
    // $.ajax({
    //     url: `https://api.petfinder.com/v2/{CATEGORY}/{ACTION}?{parameter_1}={value_1}&{parameter_2}={value_2}`,
    //     method: "GET"
    //   }).then(function(response) {

    function petRequest(token) {
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
        let name = currentPet.name;
        let age = currentPet.age;
        let size = currentPet.size;
        let image = currentPet.photos[0].large;
        let id = currentPet.id;
        let breed = currentPet.breeds.primary;
        $("#pet-individual").attr({
            "data-id": id,
            "data-name": name,
            "data-age": age,
            "data-size": size,
            "data-img": image,
            "data-breed": breed
        })
        $("#pet-name").text(name);
        //$("#pet-breed").text(currentPet.breeds.primary);
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
        console.log(addressString);
        address = addressString;
        getWikiArticle(breed).then(function(breedArticle) {
            console.log(breedArticle);
            console.log(currentPet.breeds.primary);
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

    function handlePetData() {
        petRequest().then(function(response) {
            let grabSelection = response.animals;
            console.log(grabSelection);

            grabSelection.forEach(function(i) {
                if (i.photos.length > 0) {
                    hasPhotoArray.push(i);
                }
            });
            console.log(hasPhotoArray);
            irreratePetArr();
            $("#display-pet").show();
            $("#pet-image").show();
        });
    }

    function getToken() {
        return $.ajax({
            url: "https://api.petfinder.com/v2/oauth2/token",
            method: "POST",
            data: dataString
        });
    }

    // ---------------------- BUILD QUERY STRING WITH SURVEY ----------------------

    function buildQueryString() {
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

    //retreives wiki article

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
                console.log(webAddress);
                return Promise.resolve(webAddress);
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    function getLatLng(currentAddress) {
        return $.ajax({
            url: `https://api.opencagedata.com/geocode/v1/json?q=${currentAddress}&key=76ccf41f859d4c3ba1e1bebd2d7d68c6`,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            latLongPosition = response.results[0].geometry;
            console.log(latLongPosition);
            return Promise.resolve(response.results[0].geometry);
        });
    }
    //-------------------------EVENTS-------------------------------------
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

    $("#like").on("click", function() {
        console.log($(this).parent().parent().attr("data-id"));
        let name = $(this).parent().parent().attr("data-name");
        let size = $(this).parent().parent().attr("data-size");
        let breed = $(this).parent().parent().attr("data-breed");
        let age = $(this).parent().parent().attr("data-age");
        let image = $(this).parent().parent().attr("data-img");
        let matchID = $(this).parent().parent().attr("data-id")
        let petData = {
            "name": name,
            "breed": breed,
            "image": image,
            "size": size,
            "age": age
        };

        localStorage.setItem(matchID, JSON.stringify(petData))

        ;
        matchesArr.push(matchID);
        localStorage.setItem("matches", JSON.stringify(matchesArr))
    });

    $("#matches").on("click", function() {
            console.log(JSON.parse(localStorage.getItem(matchesArr)));
        })
        //---------------------------INITIALIZE APP-----------------------------
    $("#form-wrapper").hide();
    $("#display-pet").hide();
    $("#pet-image").hide();

    buildQueryString();
});

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
/*
buildQueryString();
getWikiArticle();
handlePetData();*/