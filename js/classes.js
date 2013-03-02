// Class for collecting data and check it
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

AjaxRequest.prototype.onSuccess = function(ajaxData, method) {
    if (method === "GET") {
        
        if (this.option != "getAllvideoStoreLen") {

            // Append data returned from server
            this.displayAjaxData(ajaxData);

            if (this.option == "videoStoreByPage") {
                videoStoreByPage.optionsDisplay.selectCount();
                videoStoreByPage.optionsDisplay.pageByNumber();
            }

            if (this.option == "movieInfo") {
                allvideoStores.optionsDisplay.rentMovie();
            }

            if (this.option == "allvideoStores" || this.option == "categoryInfo" ||
                this.option == "actorsInfo") {
                allvideoStores.optionsDisplay.movieInfo();
            }

            allvideoStores.optionsDisplay.videostoreInfo();
            categories.optionsDisplay.categoryInfo();
            actors.optionsDisplay.actorInfo();

        } else {
            // Get all length on video stores
            allvideoStoresLenght = ajaxData.length;
        }
    } else if (method === "POST") {
        
        var option = this.option;

        if (option == "register") {
            this.message = 'Register success';
        } else if (option == "rent") {
            this.message = 'Rent movie with id ' + this.idMovie + ' success';
            // Refresh loginbar if user is login
            if (isLoginUser) {
                loginPOST.postAjaxData();
            }
        } else if (option == "return") {
            this.message = 'Return movie with id ' + this.idMovie + ' success';
            // Refresh loginbar if user is login
            if (isLoginUser) {
                loginPOST.postAjaxData();
            }
        } else if (option == "rented-movies") {
            this.message = 'Return movie with id ' + this.idMovie + ' success';
        } else if (option == "login-user-rented-movies") {
            // Successing login user
            var cryptPass = cryptPassword(this.user + this.pass);
            loginSuccess(this.user, cryptPass, ajaxData);
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
            // If error from server is "No such movie" then user exist and login
            loginPOST = new AjaxRequest(rentedMovies.url(), rentedMovies.ajaxMethod, 
                       rentedMovies.toAppend, "", "login-user-rented-movies");
            loginPOST.collect(collectDataLogin[0], collectDataLogin[1], collectDataLogin[2]);
            loginPOST.postAjaxData();
        } else if (option == "loginByRent" && error != "No such movie") {
            errorMessage("Username or password dont match!", "login");
        }
    } 

    if (option != "loginByRent") {
        errorMessage(error, option);
    }
};

AjaxRequest.prototype.displayAjaxData = function(data) {
    $(this.toAppend).hide().html(this.parseToHTML.dataContent(data)).fadeIn(100);
}

function LoginUserLocal(user, pass, rentMovie) {
    this.user = user;
    this.pass = pass;
    this.rentMovie = rentMovie;
}