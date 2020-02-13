// ---------------------- DOCUMENT READY ----------------------
$(document).ready(function() {
    let queryString = "";
    let grabOptions = $(".option");
    let hasPhotoArray = [];
    let currentPetIndex = 0;

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
        $("#pet-name").text(hasPhotoArray[currentPetIndex].name);
        $("#pet-breed").text(hasPhotoArray[currentPetIndex].breeds.primary);
        $("#age").text(hasPhotoArray[currentPetIndex].age);
        $("#size").text(hasPhotoArray[currentPetIndex].size);
        $("#pet-image")
            .attr("src", hasPhotoArray[currentPetIndex].photos[0].large)
            .attr("class", hasPhotoArray[currentPetIndex].id);

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

    function getWikiArticle() {
        var url = "https://en.wikipedia.org/w/api.php";

        var params = {
            action: "opensearch",
            //search: `${breed}`,
            limit: "5",
            namespace: "0",
            format: "json"
        };

        url = url + "?origin=*";
        Object.keys(params).forEach(function(key) {
            url += "&" + key + "=" + params[key];
        });

        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(response) {
                console.log(response);
                webAddress = response[3][0];
                console.log(webAddress);
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    function initMap() {
        var myLatLng = { lat: 40.779502, lng: -73.967857 };

        var map = new google.maps.Map(document.getElementById("map"), {
            zoom: 10,
            center: myLatLng
        });

        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: "Hello World!"
        });
    }

    function getLatLng() {
        $.ajax({
            url: `https://api.opencagedata.com/geocode/v1/json?q=${address}&key=76ccf41f859d4c3ba1e1bebd2d7d68c6`,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            latLng = response.results[0].geometry;
            console.log(latLng);
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
    //---------------------------INITIALIZE APP-----------------------------
    $("#form-wrapper").hide();
    $("#display-pet").hide();
    $("#pet-image").hide();

    buildQueryString();
});

/*
buildQueryString();
getWikiArticle();
handlePetData();*/