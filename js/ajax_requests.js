var ajaxRequests = {

	allvideoStores: {
		url: function() {
			return "all";
		},
		ajaxMethod: "GET",
		toAppend: ".display-container",
		optionsDisplay: {
			videostoreInfo: function() {
				requestAjaxEvent(document.querySelectorAll('.videostore-info'), videoStoreInfo, moviesHTML,
							"allvideoStores", "get", "click", false, true);
			},
			movieInfo: function() {
				requestAjaxEvent(document.querySelectorAll('.movie-info'), movieInfoPage, movieInfoHTML,
							"movieInfo", "get", "click", false, true);
			},
			rentMovie: function() {

				if (!isMovieRented) {
					rentMovieBtn = document.getElementById("rent-movie-btn");
					rentMovieId = document.getElementById("rent-movie-id");
					rentMovieUsername = document.getElementById("rent-movie-username");
					rentMoviePassword =  document.getElementById("rent-movie-password");

					if (isLoginUser) {
						rentMovieUsername = document.getElementById("rent-movie-username");
						rentMoviePassword =  document.getElementById("rent-movie-password");
					}

					loadingRent = document.getElementById("rent-form");
					collectDataRentMovie = [rentMovieUsername, rentMoviePassword, rentMovieId];
					requestAjaxEvent(rentMovieBtn, rentMovie, "", "rent", "post", "click", collectDataRentMovie);
				}
			}
		}
	},

	movieInfo: {
		pageId: "",
		url: function () {
			return "movie-info/" + this.pageId;
		},
		ajaxMethod: "GET",
		toAppend: ".display-container",
	},

	videoStoreInfo: {
		pageId: "",
		url: function () {
			return "info/" + this.pageId;
		},
		ajaxMethod: "GET",
		toAppend: ".display-container",
	},

	categories: {
		url: function () {
			return "categories";
		},
		ajaxMethod: "GET",
		toAppend: ".display-container",
		optionsDisplay: {
			categoryInfo: function() {
				requestAjaxEvent(document.querySelectorAll('.category-info'), categoryInfoPage, moviesHTML,
							"categoryInfo", "get", "click", false, true);
			}
		}
	},

	categoryInfo: {
		pageId: "",
		url: function () {
			return "category-info/" + this.pageId;
		},
		ajaxMethod: "GET",
		toAppend: ".display-container"
	},

	videoStoreByPage: {
		pageNum: 0,
		count: 5,
		url: function () {
			return "page?page=" + this.pageNum + "&count=" + this.count;
		},
		ajaxMethod: "GET",
		toAppend: ".display-container",
		optionsDisplay: {
			selectCount: function() {	
						// Count per Page - default 5
					    var contPageSelect = document.getElementById('count-page');
					    addEventHandler(contPageSelect, "change", function() {
					        loadingToAppend.appendChild(loadingImg);
					        videoStoreByPage.count = contPageSelect.options[contPageSelect.selectedIndex].value;
					        videoStoreByPage.pageNum = 0;
					        requestGET = new AjaxRequest(videoStoreByPage.url(), videoStoreByPage.ajaxMethod, 
					                                        videoStoreByPage.toAppend, videoStoreByPageHTML, "videoStoreByPage");
					        requestGET.getAjaxData();
					    } , false);
					},
			pageByNumber: function() {
					    var videoStoreByPageNumBtn = document.querySelectorAll('.videoStore-page');
					    for(var i = 0; i < videoStoreByPageNumBtn.length; i++)
					    {
					            addEventHandler(videoStoreByPageNumBtn[i], "click", function() {
					            loadingToAppend.appendChild(loadingImg);	
					            videoStoreByPage.pageNum = $(this).data("pagehref");
					            
					            requestGET = new AjaxRequest(videoStoreByPage.url(), videoStoreByPage.ajaxMethod,
					                                            videoStoreByPage.toAppend, videoStoreByPageHTML, "videoStoreByPage");

					            requestGET.getAjaxData();

					        } , false);
					    }
			}

		}
	},

	actors: {
		url: function() {
			return "actors";
		},
		ajaxMethod: "GET",
		toAppend: ".display-container",
		optionsDisplay: {
			actorInfo: function() {
						requestAjaxEvent(document.querySelectorAll('.actor-info'), actorInfo, moviesHTML,
									"actorsInfo", "get", "click", false, true);
			}
		}
	},

	actorInfo: {
		pageId: "",
		url: function () {
			return "actor-info/" + this.pageId;
		},
		ajaxMethod: "GET",
		toAppend: ".display-container",
	},

	registerUser: {
		url: function () {
			return "register-user";
		},
		ajaxMethod: "POST",
		toAppend: "",
	},

	rentMovie: {
		url: function() {
			return "rent-movie";
		},
		ajaxMethod: "POST",
		toAppend: "",
	},

	returnMovie: {
		url: function () { 
			return "return-movie";
		},
		ajaxMethod: "POST",
		toAppend: "",
	},

	rentedMovies: {
		url: function () { 
			return "rented-movies";
		},
		ajaxMethod: "POST",
		toAppend: "#login-result",
	}
};