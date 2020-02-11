// ---------------------- DOCUMENT READY ----------------------
$(document).ready(function() {
  $("#form-wrapper").hide();
});

// ---------------------- START SURVEY ON CLICK ----------------------
$("#surveyBtn").on("click", function() {
  $("#main-logo-wrapper").hide();
  $("#form-wrapper").show();
});

// ---------------------- SUBMIT SURVEY ON CLICK ----------------------
$("#submit").on("click", function() {
  $("#survey").hide();
  handlePetData();
});

// ---------------------- API CALL ----------------------
petFinderAPI = "6gXqqaCV4rGHQFlZapWU444NSW4gmFlZDUnK9TYKUoBf0r2WPg";
petFinderSecret = "Js4RQQVKwJyrmKglhelMQX9yiNDSqZ6b4c1p8hMS";
petFinderToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjI1MDEzZTc4MDlhZmQ3MjIyNjE3MzQyMTk2NWM5YThjY2U2N2RhNjdmNmQzYzM1OWViMDdkZjFjN2IzZTYzMjRjMDc3N2E1ZWI1YWIxZTg1In0.eyJhdWQiOiI2Z1hxcWFDVjRyR0hRRmxaYXBXVTQ0NE5TVzRnbUZsWkRVbks5VFlLVW9CZjByMldQZyIsImp0aSI6IjI1MDEzZTc4MDlhZmQ3MjIyNjE3MzQyMTk2NWM5YThjY2U2N2RhNjdmNmQzYzM1OWViMDdkZjFjN2IzZTYzMjRjMDc3N2E1ZWI1YWIxZTg1IiwiaWF0IjoxNTgwOTQ2Njk4LCJuYmYiOjE1ODA5NDY2OTgsImV4cCI6MTU4MDk1MDI5OCwic3ViIjoiIiwic2NvcGVzIjpbXX0.lS7OOFQ4sYhtlB9Qbw0JvV8aXb3AiIuQb4CgPZjqvxVQAExKka3_uHbXPad2wRMX-t_P14MIYkQu9Zgwjxgl4naXu0Ka8q8buZnU8ZBVNJYk5cLa4Q2II9HiEmyW6NIaRC2TVkq96Pa3Bz16pP_0A9PgUgQVjw3TdPi8iP9eie9WwmprLsxwxxp3w980cGccYxXMEP7vz-Ky8P-V3iwqTpd-776V29DPVQXt8I7t8Z9ed3VV0w4ohw81SPSleq_TEY1gAkg3uPhEThJ9oLUvAHyfzjRauu1tDVG-ee8FAqsE8yVpwBMHOWSJS_8rb9icjmUEaE5f9aLzRhioY4bpGg";

// $.ajax({
//     url: `https://api.petfinder.com/v2/{CATEGORY}/{ACTION}?{parameter_1}={value_1}&{parameter_2}={value_2}`,
//     method: "GET"
//   }).then(function(response) {

var dataString = `grant_type=client_credentials&client_id=${petFinderAPI}&client_secret=${petFinderSecret}`;

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

function handlePetData() {
  petRequest().then(function(response) {
    console.log(response);
    // photo1 = response.animals[0].photos[0].small;
    // photo2 = response.animals[0].photos[0].large;
    console.log(photo2);
  });
}

function getToken() {
  return $.ajax({
    url: "https://api.petfinder.com/v2/oauth2/token",
    method: "POST",
    data: dataString
  });
}

let queryString = "";
let grabOptions = $(".option");

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
    }
    if (
      el.currentTarget.checked == true &&
      el.currentTarget.name == "good_with_dogs"
    ) {
      queryString = queryString.concat(`&${grabValue}=${true}`);
    }
    if (
      el.currentTarget.checked == true &&
      el.currentTarget.name == "good_with_cats"
    ) {
      queryString = queryString.concat(`&${grabValue}=${true}`);
    }
  });
  console.log(queryString);

  return queryString;
}
buildQueryString();

//console.log(petResponse);
// image1 = petResponse.animals[0].photos[0].small;
// console.log(image1)
