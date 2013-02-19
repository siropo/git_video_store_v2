//**************************************************
//
// Javascript practical project
// author Viktor Ivanov
// date: 01.31.2012
// editor: Sublime text 2
// version: 2 
//
//**************************************************

"use strict";

// Server Url
var serviceRootUrl = "http://js-video-stores.apphb.com/api/stores/";

//loading image properties
var loadingToAppend = document.getElementsByClassName("display-container")[0];
var loadingImg = document.createElement("img");
loadingImg.src = "img/site-parts/ajax-loader.gif";
loadingImg.className = "loading-img";

// Global Title
var contentHeaderTitle = document.getElementById("content-header-title");

// Buttons and click anchor on page
var registerBtn = document.getElementById("register-btn");
var returnMovieBtn = document.getElementById("return-movie-btn");

var rentedMoviesBtn = document.getElementById("rented-movies-btn");

var loginBtn = document.getElementById("login-btn");
var allvideoStoreBtn = document.getElementById("all-videoStore-btn");
var allCategoryBtn = document.getElementById("categories-btn");
var videoStoreByPageBtn = document.getElementById('videoStore-by-page-btn');
var actorsBtn = document.getElementById('actors-btn');
var logoClick = document.getElementById('logo');

// Ajax objects for request
var videoStoreByPage = ajaxRequests.videoStoreByPage;
var videoStoreInfo = ajaxRequests.videoStoreInfo;

var rentedMovies = ajaxRequests.rentedMovies;

var categories = ajaxRequests.categories;
var allvideoStores = ajaxRequests.allvideoStores;
var actors = ajaxRequests.actors;
var registerUser = ajaxRequests.registerUser;
var returnMovie = ajaxRequests.returnMovie;
var movieInfoPage = ajaxRequests.movieInfo;
var rentMovie = ajaxRequests.rentMovie;
var categoryInfoPage = ajaxRequests.categoryInfo;
var actorInfo = ajaxRequests.actorInfo;

// All videostores length
var allvideoStoresLenght;

// Collecting variebles for login user
var loginUsername = document.getElementById("login-username");
var loginPassword =  document.getElementById("login-password"); 
var collectDataLogin = [loginUsername, loginPassword, ""];

// Collecting variebles for register user
var registerUsername = document.getElementById("tb-username");
var registerPassword =  document.getElementById("tb-password"); 
var collectDataRegister = [registerUsername, registerPassword, ""];

// Collecting variebles for return movie
var returnMovieId = document.getElementById("return-movie-id");
var returnMovieUsername = document.getElementById("return-movie-username");
var returnMoviePassword =  document.getElementById("return-movie-password");                 
var collectDataReturnMovie = [returnMovieUsername, returnMoviePassword, returnMovieId];

// Collecting variebles for rent movies
var rentMovieBtn;
var rentMovieId;
var rentMovieUsername;
var rentMoviePassword;
var loadingRent;
var collectDataRentMovie

// Login valiables
var loginUser = null;
var isLoginUser = false;
var isMovieRented = false;
var isLoginUserRentMovies = false;

// Variable fix for display return movie form and loading image
var isReturnFormVisible = true;

// Variables for current Ajax request
var requestGET;
var requestPOST;

// addEventListener
function addEventHandler(oNode, sEvt, fFunc, bCaptures) {
    if (oNode.addEventListener) {
        oNode.addEventListener(sEvt, fFunc, bCaptures);
    } else {
        oNode.attachEvent("on" + sEvt, fFunc);
    }
}

function requestAjaxEvent(btn, obj, html, option, method, ev, collectData, multiHandler) {
    if (!multiHandler) {
        addEventHandler(btn, ev, function() {
            
            if (method == "get") {
                loadingToAppend.appendChild(loadingImg);
                requestGET = new AjaxRequest(obj.url(), obj.ajaxMethod, 
                                         obj.toAppend, html, option);
                requestGET.getAjaxData();
            } else if (method == "post") {
                var loadingImgPost = document.getElementById(option + "-form");
                loadingImgPost.appendChild(loadingImg);
                requestPOST = new AjaxRequest(obj.url(), obj.ajaxMethod, 
                                         obj.toAppend, html, option);
                requestPOST.collect(collectData[0], collectData[1], collectData[2]);
                requestPOST.postAjaxData();
            }
            
        }, false);
    } else {
        for(var i = 0; i < btn.length; i++) {
                addEventHandler(btn[i], "click", function() {
                loadingToAppend.appendChild(loadingImg);    
                obj.pageId = $(this).data("id");
                
                requestGET = new AjaxRequest(obj.url(), obj.ajaxMethod,
                                                obj.toAppend, html, option);

                requestGET.getAjaxData();
            } , false);
        }
    }
}

function init() {

    //fix footer height for different resolutions
    fixFooterHeight();

    // Get len on All videoStores
    requestGET = new AjaxRequest(allvideoStores.url(), "GET", 
                                       "none", "none", "getAllvideoStoreLen");
    requestGET.getAjaxData();

    // Get Handlers 
    requestAjaxEvent(logoClick, videoStoreByPage, videoStoreByPageHTML, "videoStoreByPage", "get", "click");
    requestAjaxEvent(actorsBtn, actors, actorsHTML, "actorsInfo", "get", "click");
    requestAjaxEvent(videoStoreByPageBtn, videoStoreByPage, videoStoreByPageHTML, "videoStoreByPage", "get", "click");
    requestAjaxEvent(allCategoryBtn, categories, categoriesHTML, "categoryInfo", "get", "click");

    // Post Handles
    requestAjaxEvent(registerBtn, registerUser, "", "register", "post", "click", collectDataRegister);
    requestAjaxEvent(returnMovieBtn, returnMovie, "", "return", "post", "click", collectDataReturnMovie);
    

    // Login Handler
    addEventHandler(loginBtn, "click", function() {
        var loginData = new Data("login");
            loginData.collect(collectDataLogin[0] , collectDataLogin[1], collectDataLogin[2]);  
    } , false);

    // Register button handler
    $('#show-register-form').click(function() {
      $('#register-div').toggle("fast");
    });

    // Get started
    requestGET = new AjaxRequest(videoStoreByPage.url(), videoStoreByPage.ajaxMethod, 
                                      videoStoreByPage.toAppend, videoStoreByPageHTML, "videoStoreByPage");
    requestGET.getAjaxData();
}

function cryptPassword(key) {
    var hash = CryptoJS.SHA1(key);
    hash = hash.toString();
    return hash;
}

function errorMessage(error, option) {
    $("#" + option + "-form").fadeOut(60);
    $("#" + option + "-result").css("visibility","visible").hide().fadeIn("slow").html(
        '<div class="error-msg">' + error + 
            ' <input type="button" href="#" id="' + option + '-result-btn" class="msg-button" value="ok">' +
        '</div>'
        );

    $("#" + option + "-result-btn").on("click", function() {
        $("#" + option + "-result").fadeOut().css("visibility","hidden");
        $("#" + option + "-form").fadeIn();
        if (option != "login") {
            var removeLoadingImgPost = document.getElementById(option + "-form");
            removeLoadingImgPost.removeChild(loadingImg);
        } 
    })
    
}

function succesMessage(message, option) {
    $("#" + option + "-form").fadeOut(60);
        $("#" + option + "-result").css("visibility","visible").hide().fadeIn("slow").html(
            '<div class="success-msg">' + message +
                ' <input type="button" id="' + option + '-result-btn" class="msg-button" value="ok">' +
            '</div>'
        );

        $("#" + option + "-result-btn").on("click", function() {
            $("#" + option + "-result").fadeOut().css("visibility","hidden");
            $("#" + option + "-form").fadeIn();
            if (isReturnFormVisible) {
                var removeLoadingImgPost = document.getElementById(option + "-form");
                removeLoadingImgPost.removeChild(loadingImg); 
            } 
            isReturnFormVisible = true;
        });
}

function loginSuccess(user, pass, rentedMovies) {

    isLoginUser = true;
    // Create object for login user
    loginUser = new LoginUserLocal(user, pass, rentedMovies);
    loginUserDisplay(loginUser.user, loginUser.rentMovie);

}

function loginUserDisplay(user, rentMovie) {

    //Refresh display-container
    requestGET.getAjaxData();
    
    isReturnFormVisible = false;

    $("#login-div").css("height", "auto");
    $("#rent-show-hide-field").css("visibility","hidden");
    $("#return-movie-div").fadeOut(60);
    $('#show-register-form').hide();
    $('#register-div').hide();
    $('.login-title').text("Wellcome");
    $(".form-holder-return").css("height", "auto");
        

    if (requestGET.option == "movieInfo") {
        
        $("#rent-form").append(
                '<input type="hidden" value="' + loginUser.user + '" id="rent-movie-username" />' +
                '<input type="hidden" value="' + loginUser.pass + '" id="rent-movie-password" />'
        );
        // Refresh display-container
        requestGET.getAjaxData();
    }
    
    var rentedMoviesHTML = '<ul class="rented-movies">';
    var rentMoviesLength = rentMovie.length;

    if (rentMoviesLength > 0) {
        isLoginUserRentMovies = true;
        rentedMoviesHTML += '<li>Your rented movies </li>'; 
        for (var i = 0; i < rentMovie.length; i++) {
            rentedMoviesHTML += '<li><span class="movie-name"><a href="#' + rentMovie[i].title + '" data-id="' + rentMovie[i].id + '" class="movie-info login-user-rent">' + rentMovie[i].title + "</a></span>" + 
            '<input type="button" data-movieid="' + rentMovie[i].id + '" data-arrid="' + i + '" class="login-return-movie small-button red" value="return"></li>';
        } 
    } else {
        isLoginUserRentMovies = false;
        rentedMoviesHTML += '<li>You dont rent any movies </li>'; 
    }

    rentedMoviesHTML += '</ul>';

    $("#login-form").fadeOut(60);
    $("#login-result").css("visibility","visible").hide().fadeIn("slow").html(
        '<div class="success-msg"><span class="user">User: ' + user + ' </span>' +
            rentedMoviesHTML + 
            ' <input type="button" id="logout-btn" class="msg-button" value=" logout " />' +
        '</div>'
    );
    
    // Logout handler 
    logoutHandler();
    // Event handler for rented movies
    returnMovieLoginHandler();
}

function  logoutHandler() {
    $("#logout-btn").on("click", function() {
        $('.login-title').text("Login");
        isReturnFormVisible = true;
        isMovieRented = false;
        loginUser = null;
        isLoginUser = false;

        $("#login-result").fadeOut().css("visibility","hidden");
        if (requestGET.option == "movieInfo") {
            requestGET.getAjaxData();
        }
        $("#login-div").css("height", "140");
        $("#login-form").fadeIn(40);
        $("#return-movie-div").fadeIn(500);
        $(".form-holder-return").css("height", "200px");
        $('#show-register-form').show();

    });
}

function returnMovieLoginHandler() {

    var returnBtnLogin = document.getElementsByClassName("login-return-movie");
    for(var i = 0; i < returnBtnLogin.length; i++) {
        addEventHandler(returnBtnLogin[i], "click", function() {

            var movieId = $(this).data("movieid");
            var requestPOST = new AjaxRequest(returnMovie.url(), returnMovie.ajaxMethod, 
                                                 returnMovie.toAppend, "", "return");
            requestPOST.collect(loginUser.user, loginUser.pass, movieId, "link");
            requestPOST.postAjaxData();

        } , false);

    }
}

function checkLogin(user, pass) {

    var loginRequest = new AjaxRequest(rentMovie.url(), rentMovie.ajaxMethod, 
                                         rentMovie.toAppend, "", "loginByRent");
    loginRequest.collect(user, pass, "-1", "link");
    loginRequest.postAjaxData();

}

function checkMovieIsRented(user, movieId) {
    if (loginUser.rentMovie != null) {
        for (var i = 0; i < loginUser.rentMovie.length; i++) {
            if (loginUser.rentMovie[i].id == movieId) {
                return true;
            }
        }
    } 

    return false;
}

function fixFooterHeight() {
    var windowSize = $(window).height();
    var footerTopOffset = $("#footer").offset().top;
    var pos = windowSize - footerTopOffset;

    if (pos > 0) {
        $("#footer").css("height", pos);
    }
}

addEventHandler(window, "load", init, false);

