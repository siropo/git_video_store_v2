"use strict";
var serviceRootUrl = "http://js-video-stores.apphb.com/api/stores/";

//loading image properties
var loadingToAppend = document.getElementsByClassName("display-container")[0];
var loadingImg = document.createElement("img");
loadingImg.src = "img/site-parts/ajax-loader.gif";
loadingImg.className = "loading-img";

var contentHeaderTitle = document.getElementById("content-header-title");
var registerBtn = document.getElementById("register-btn");
var returnMovieBtn = document.getElementById("return-movie-btn");
var loginBtn = document.getElementById("login-btn");

var allvideoStoreBtn = document.getElementById("all-videoStore-btn");
var allCategoryBtn = document.getElementById("categories-btn");
var videoStoreByPageBtn = document.getElementById('videoStore-by-page-btn');
var actorsBtn = document.getElementById('actors-btn');
var logoClick = document.getElementById('logo');

var videoStoreByPage = ajaxRequests.videoStoreByPage;
var videoStoreInfo = ajaxRequests.videoStoreInfo;
var categories = ajaxRequests.categories;
var allvideoStores = ajaxRequests.allvideoStores;
var actors = ajaxRequests.actors;
var registerUser = ajaxRequests.registerUser;
var returnMovie = ajaxRequests.returnMovie;
var movieInfoPage = ajaxRequests.movieInfo;
var rentMovie = ajaxRequests.rentMovie;
var categoryInfoPage = ajaxRequests.categoryInfo;
var actorInfo = ajaxRequests.actorInfo;

var allvideoStoresLenght;

var loginUsername = document.getElementById("login-username");
var loginPassword =  document.getElementById("login-password"); 

var collectDataLogin = [loginUsername, loginPassword, ""];

var registerUsername = document.getElementById("tb-username");
var registerPassword =  document.getElementById("tb-password"); 

var collectDataRegister = [registerUsername, registerPassword, ""];

var returnMovieId = document.getElementById("return-movie-id");
var returnMovieUsername = document.getElementById("return-movie-username");
var returnMoviePassword =  document.getElementById("return-movie-password");
                        
var collectDataReturnMovie = [returnMovieUsername, returnMoviePassword, returnMovieId];

var rentMovieBtn;
var rentMovieId;
var rentMovieUsername;
var rentMoviePassword;
var loadingRent;
var collectDataRentMovie

var loginUser = null;
var isLoginUser = false;
var isMovieRented = false;

var isReturnFormVisible = true;

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

function requestEvent(btn, obj, html, option, method, ev, collectData, multiHandler) {
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

    fixFooterHeight();

    // Get len on All videoStores
    requestGET = new AjaxRequest(allvideoStores.url(), allvideoStores.ajaxMethod, 
                                       "none", "none", "getAllvideoStoreLen");
    requestGET.getAjaxData();

    requestEvent(logoClick, videoStoreByPage, videoStoreByPageHTML, "videoStoreByPage", "get", "click");
    requestEvent(actorsBtn, actors, actorsHTML, "actorsInfo", "get", "click");
    requestEvent(videoStoreByPageBtn, videoStoreByPage, videoStoreByPageHTML, "videoStoreByPage", "get", "click");
    /* requestEvent(allvideoStoreBtn, allvideoStores, allvideoStoresHTML, "allvideoStores", "get", "click"); */
    requestEvent(allCategoryBtn, categories, categoriesHTML, "categoryInfo", "get", "click");
    requestEvent(registerBtn, registerUser, "", "register", "post", "click", collectDataRegister);
    requestEvent(returnMovieBtn, returnMovie, "", "return", "post", "click", collectDataReturnMovie);

    addEventHandler(loginBtn, "click", function() {
            var loginData = new Data("login");
                loginData.collect(collectDataLogin[0] , collectDataLogin[1], collectDataLogin[2]);  
        } , false);

    $('#show-register-form').click(function() {
      $('#register-div').toggle("fast");
    });

    videoStoreByPageBtn.click();


}

function cryptPassword(key) {
    var hash = CryptoJS.SHA1(key);
    hash = hash.toString();
    return hash;
}

function Data(option) {
    this.dataOption = option;
}

Data.prototype.collect = function (user, pass, id, sendData) {

    this.user = user;
    this.pass = pass;
    this.idMovie = id;
    this.validData = false;
    this.message = "";
    // Parameter for check data if collecting from input or link 
    this.sendData = sendData;

    // Check data is send from input fields
    if (this.sendData != "link") {
        this.user = this.user.value;
        this.pass = this.pass.value;
        this.idMovie = this.idMovie.value;
    }

    if (this.validate()) {

        if (this.dataOption != "login") { 

            if (!isLoginUser) {
                var cryptPass = cryptPassword(this.user + this.pass);
            } else {
                var cryptPass = this.pass;
            }

            // Data for registration
            var collect = {
                username: this.user,
                authCode: cryptPass
            };

            // Create Object with data to POST on server
            this.dataCollect = collect;

            // Data for rent and return movie
            if (this.idMovie != undefined) {
                this.dataCollect = {
                    movieId: this.idMovie,
                    user: collect
                }
            }

            this.validData = true;
            return this.dataCollect;
      } else {
            checkLogin(this.user, this.pass);
      }
    } else if (this.dataOption == "login") {
        errorMessage(this.message, "login");
    }
};

Data.prototype.validate = function () {
    if (this.user === '' || this.pass === '') {
        this.message = "username and password cannot be empty";
        return false;
    } else if (typeof this.user.charAt(0) === 'number') {
        this.message = "username must start with a letter";
        return false;
    } else if (this.user.length < 4 || this.pass.length < 4) {
        this.message = "username and password must be atleast 4 characters";
        return false;
    } else {
        return true;
    }
};

AjaxRequest.prototype = new Data();
AjaxRequest.prototype.constructor = AjaxRequest;

function AjaxRequest(requestUrl, ajaxMethod, toAppend, parseToHTML, option) {
    Data.apply(this, arguments);

    this.requestUrl = requestUrl;
    this.ajaxMethod = ajaxMethod;
    this.toAppend = toAppend;
    this.parseToHTML = parseToHTML;
    this.option = option;
    this.returnMovieDeleteLocal = 0;
    
}


AjaxRequest.prototype.getAjaxData = function() {

    var self = this;
    $.ajax({
        url: serviceRootUrl + self.requestUrl,
        type: self.ajaxMethod,
        timeout: 5000,
        dataType: "json",
        success: function (result) {
            self.onSuccess(result, self.ajaxMethod);
            
        },
        error: function (jqXHR, textStatus, errorThrow) {
            self.onErrorRequest(jqXHR, textStatus, errorThrow);
        }
    });
};

AjaxRequest.prototype.postAjaxData = function() {
    if (!this.validData) {
        this.onErrorRequest();
    } else {
        $.support.cors = true;
        var self = this;
        $.ajax({
            url: serviceRootUrl + self.requestUrl,
            type: self.ajaxMethod,
            timeout: 5000,
            dataType: "json",
            crossDomain: true,                  
            async: true,
            data: this.dataCollect,
            success: function (result) {
                self.onSuccess(result, self.ajaxMethod);  
            },
            error: function (jqXHR, textStatus, errorThrow) {
                self.onErrorRequest(jqXHR, textStatus, errorThrow);
            }

        });
    }
};

AjaxRequest.prototype.onSuccess = function(data, method) {
    if (method === "GET") {

        if (this.option == "getAllvideoStoreLen") {
            allvideoStoresLenght = data.length;
        } else {

            $(this.toAppend).hide().html(this.parseToHTML.dataContent(data)).fadeIn(100);

            if (this.option == "videoStoreByPage") {
                videoStoreByPage.optionsDisplay.selectCount();
                videoStoreByPage.optionsDisplay.pageByNumber();
            }

            if (this.option == "movieInfo") {
                allvideoStores.optionsDisplay.rentMovie();
            }

            allvideoStores.optionsDisplay.videostoreInfo();
            allvideoStores.optionsDisplay.movieInfo();
            categories.optionsDisplay.categoryInfo();
            actors.optionsDisplay.actorInfo();
            
        }
    } else if (method === "POST") {

        var option = this.option;

        if (option == "register") {
            this.message = 'Register success';
            registerUserLocal(this.user, this.pass);
        } else if (option == "rent") {
            this.message = 'Rent movie with id ' + this.idMovie + ' success';
            rentMovieUpdateLocal(this.user, this.pass, this.idMovie);
        } else if (option == "return") {
            this.message = 'Return movie with id ' + this.idMovie + ' success';
            returnMovieUpdateLocal(this.user, this.pass, this.returnMovieDeleteLocal);
        } 

        succesMessage(this.message, option);
    }
    
};

AjaxRequest.prototype.onErrorRequest = function(jqXHR, textStatus, errorThrow) {
    
    var option = this.option;
    var error;

    if (!this.validData) {
        error = this.message;
    } else {
        error = jQuery.parseJSON(jqXHR.responseText);
        error = error.Message;
        if (option == "loginByRent" && error == "No such movie") {
            var cryptPass = cryptPassword(this.user + this.pass);
            loginSuccess(this.user, cryptPass); 
            return;
        }
    } 

    if (option != "loginByRent") {
        errorMessage(error, option);
    }
};

function errorMessage(error, option) {
    $("#" + option + "-form").fadeOut(60);
    $("#" + option + "-result").css("visibility","visible").hide().fadeIn("slow").html(
        '<div class="error-msg">' + error + 
            ' <a href="#" id="' + option + '-result-btn" class="msg-button">ok</a>' +
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
                ' <a href="#" id="' + option + '-result-btn" class="msg-button">ok</a>' +
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

function rentMovieUpdateLocal (user, pass, movieId) {
   if (isLoginUser) {
        loginUser.rentMovie.push(movieId);
        updateUserLocal(user, pass, loginUser.rentMovie);
        loginUserDisplay(loginUser.user, loginUser.rentMovie);
    } else {
        var checkForLocalUser = checkIsUserExist(user);
        if (!checkForLocalUser) {
            registerUser = new registerUserLocal(user);
        }
        var setLocalStoreRentMovies = getRentedMoviesLocalStorage(user);
        setLocalStoreRentMovies.push(movieId);
        updateUserLocal(user, pass, setLocalStoreRentMovies);
    }
}

function returnMovieUpdateLocal (user, pass, deleteMovieId) {
    if (isLoginUser) {
        loginUser.rentMovie.splice(deleteMovieId, 1);
        updateUserLocal(user, pass, loginUser.rentMovie);
        loginUserDisplay(loginUser.user, loginUser.rentMovie);
    } else {
        var checkForLocalUser = checkIsUserExist(user);
        if (!checkForLocalUser) {
            registerUser = new registerUserLocal(user);
        }
        var setLocalStoreRentMovies = getRentedMoviesLocalStorage(user);
        setLocalStoreRentMovies.splice(deleteMovieId, 1);
        updateUserLocal(user, pass, setLocalStoreRentMovies);
    }
}

function loginSuccess(user, pass) {

    var isLocalUser = false;

    for(var i in localStorage) {
        var localObj = JSON.parse(localStorage[i]);
        if (localObj.user == user) {
            isLoginUser = true;
            loginUser = new LoginUserLocal(user, pass, localObj.movieRent);
            loginUserDisplay(loginUser.user, loginUser.rentMovie);
            return;
        }     
    }

    isLoginUser = true;
    registerUser = new registerUserLocal(user);
    loginUser = new LoginUserLocal(user, pass, []);
    loginUserDisplay(loginUser.user, loginUser.rentMovie);

}

function loginUserDisplay(user, rentMovie) {

    $("#rent-show-hide-field").css("visibility","hidden");
    $("#return-movie-div").fadeOut(60);
    $('#show-register-form').hide();
    $('#register-div').hide();
    $('.login-title').text("Wellcome");
    if (requestGET.option == "movieInfo") {
        
        $("#rent-form").append(
                '<input type="hidden" value="' + loginUser.user + '" id="rent-movie-username" />' +
                '<input type="hidden" value="' + loginUser.pass + '" id="rent-movie-password" />'
        );

        requestGET.getAjaxData();
    }
    
    var rentedMoviesHTML = '<ul class="rented-movies">';

    for (var i = 0; i < rentMovie.length; i++) {
        rentedMoviesHTML += '<li>Movie id: ' + rentMovie[i] + 
        '<a href="#" data-movieid="' + rentMovie[i] + '" data-arrid="' + i + '" class="login-return-movie small-button red">return</a></li>';
    }

    rentedMoviesHTML += '</ul>';

    $("#login-form").fadeOut(60);
    $("#login-result").css("visibility","visible").hide().fadeIn("slow").html(
        '<div class="success-msg"><span class="user">User: ' + user + ' </span>' +
            rentedMoviesHTML + 
            ' <a href="#" id="logout-btn" class="msg-button">Logout</a>' +
        '</div>'
    );

    
    //  Logout handler 
    logoutHandler();
    // Event handler for rented movies
    returnMovieLoginHandler();
}

function  logoutHandler() {
    $("#logout-btn").on("click", function() {
        $('.login-title').text("Login");
        isMovieRented = false;
        loginUser = null;
        isLoginUser = false;
        $("#login-result").fadeOut().css("visibility","hidden");
        if (requestGET.option == "movieInfo") {
            requestGET.getAjaxData();
        }

        $("#return-movie-div").fadeIn();
        $("#login-form").fadeIn();
        $('#show-register-form').show();
        $('#register-div').show();
        isReturnFormVisible = false;
        $("#return-result-btn").click();
    });
}

function returnMovieLoginHandler() {

    var returnBtnLogin = document.getElementsByClassName("login-return-movie");
    for(var i = 0; i < returnBtnLogin.length; i++) {
        addEventHandler(returnBtnLogin[i], "click", function() {

            var movieId = $(this).data("movieid");
            var arrId = $(this).data("arrid");
            var requestPOST = new AjaxRequest(returnMovie.url(), returnMovie.ajaxMethod, 
                                                 returnMovie.toAppend, "", "return");
            requestPOST.returnMovieDeleteLocal = arrId;
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

    if (!isLoginUser) {
        errorMessage("Username or password dont match!", "login");
    }

}

function registerUserLocal(user) {
    var register = { 
        'user': user,
        'movieRent': []
    };

    localStorage.setItem(user, JSON.stringify(register));
}

function updateUserLocal(user, pass, movieRent) {
    var register = { 
        'user': user,
        'movieRent': movieRent
    };

    localStorage.setItem(user, JSON.stringify(register));
}


function LoginUserLocal(user, pass, rentMovie) {
    this.user = user;
    this.pass = pass;
    this.rentMovie = rentMovie;
}

LoginUserLocal.prototype.getStorage = function() {
    //console.log(this.rentMovie);
    
}

LoginUserLocal.prototype.allStorage = function() {
    for(var i in localStorage) {
        console.log(JSON.parse(localStorage[i]));
    }
}

function getRentedMoviesLocalStorage(username) {
    for(var i in localStorage) {
        var localObj = JSON.parse(localStorage[i]);
        if (localObj.user == username) {
            console.log(localObj.movieRent);
            return localObj.movieRent;
        }
    }
    return false;
}

function checkIsUserExist(user) {
    var getItem = localStorage.getItem(user);

    if (getItem == null) {
        return false;
    } else {
        return true
    }
}

function checkMovieIsRented(user, movieId) {
    var getItem = localStorage.getItem(user);
    getItem = JSON.parse(getItem);

    for(var i in getItem.movieRent) {
        if (getItem.movieRent[i] == movieId) {
            console.log("found");
            return true;
        }
    }

    return false;
}

var getItem = localStorage.getItem("fsdfsd");

for(var i in localStorage) {
        console.log(JSON.parse(localStorage[i]));
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

