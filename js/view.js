var moviesHTML = {
	dataContent: function (data) {
				var title = data.title;
				if (title === undefined) {
					title = data.name;
					if (title === undefined) {
						title = data.firstName + " " + data.lastName;
					} 
				} 

				contentHeaderTitle.innerHTML = title;
			    var dataHTML = 
			        '<ul>';

			    for (var i = 0; i < data.movies.length; i++) {
			        var dataArr = data.movies[i];
			        dataHTML +=
			            '   <li data-id="' + dataArr.id + '">' +
			                        '<a href="#' + dataArr.title + '" data-id="' + dataArr.id + '" class="movie-info title">' + dataArr.title + '</a>' +
	                    		'<span class="description"><span class="additional-text">Description:</span> ' + dataArr.description + '</span>' +
	                    		'<span class="publish-date"><span class="additional-text">Publish date:</span> ' + dataArr.publishDate + '</span>' +
			            '   </li>';
			    }

			    dataHTML += '</ul>';
			    
			    return dataHTML;
			}
};

var movieInfoHTML = {
	dataContent: function (data) {
				contentHeaderTitle.innerHTML = data.title;
			    var dataHTML = 
			        '<ul>' + 
			            '<li>' +
			                    '<span class="description"><span class="additional-text">Description:</span> ' + data.description + '</span>' +
			            '</li>'+
			            '<li>' +
			                    '<span class="publish-date"><span class="additional-text">Publish date:</span> ' + data.publishDate + '</span>' +
			            '</li>' +
			            '<li>'+
			                    '<span class="additional-text">Actors: ' + '</span>';;

			    for (var i = 0; i < data.actors.length; i++) {
			        var dataArr = data.actors[i];
			        dataHTML += '<a href="#' + dataArr.firstName + " " + dataArr.lastName +'" data-id="' + dataArr.id + '" class="actor-info">' + 
			                        dataArr.firstName + " " + dataArr.lastName +'</a> | ';

			    }	
			    dataHTML += '</li>';
			    dataHTML += 
			   		 	'<li>'+
			                    '<span class="additional-text">Stores: ' + '</span>';
			    for (var i = 0; i < data.stores.length; i++) {
			        var dataArr = data.stores[i];
			        dataHTML += '<a href="#' + dataArr.title + '" data-id="' + dataArr.id + '" class="videostore-info">' + dataArr.title + '</a> | ';
			    }
			    dataHTML += '</li>';
			    dataHTML += 
			   		 	'<li>'+
			                    '<span class="additional-text">Categories: ' + '</span>';
			    for (var i = 0; i < data.categories.length; i++) {
			        var dataArr = data.categories[i];
			        dataHTML += '<a href="#' + dataArr.name + '" data-id="' + dataArr.id + '" class="category-info">' + dataArr.name + '</a> | ';
			    }
			    dataHTML += '</li>';
			    dataHTML += '</ul>';
			    
			    dataHTML += '<div class="form-holder-rent">' +
				    			'<div id="rent-movie-div" class="clear">' +
					    			'<h3 class="rent-movie-title">Rent this Movie </h3>' + 
					    			'<form id="rent-form">';
				if (!isLoginUser) {
				
					dataHTML +=		'<div id="rent-show-hide-field">' +
										'<label for="rent-username" class="clear">' + 
											'<div class="field-name left">Username:</div> <div class="left"><input type="text" value="" id="rent-movie-username" /></div>' +
										'</label>' +
										'<label for="rent-password" class="clear">' +
											'<div class="field-name left">Password:</div><div class="left"><input type="password" value="" id="rent-movie-password" /></div>' +
										'</label>' +
									'</div>';
				} else {
					dataHTML +=		'<input type="hidden" value="' + loginUser.user + '" id="rent-movie-username" />' +
									'<input type="hidden" value="' + loginUser.pass + '" id="rent-movie-password" />';
				}

				dataHTML +=		'<input type="hidden" value="' + data.id + '" id="rent-movie-id" />';

				if (!isLoginUser) {
					dataHTML +=		'<input type="button" id="rent-movie-btn" class="right button green" value=" Rent movie " />';
				} else {
					isMovieRented = checkMovieIsRented(loginUser.user, data.id);
					if (isMovieRented) {
						dataHTML +=		'<div class="right button red"> Movie is rented by you </div>';
					} else {
						dataHTML +=		'<input type="button" id="rent-movie-btn" class="right button green" value=" Rent movie " />';
					}
					
				}

				dataHTML +=		'</form>'+ 
									'<div id="rent-result"></div>' +
								'</div>' + 
							'</div>';
				
			    return dataHTML;
			}
};

var categoriesHTML = {
	dataContent: function (data) {
				contentHeaderTitle.innerHTML = "Categories";
			    var dataHTML = 
			        '<ul>';

			    for (var i = 0; i < data.length; i++) {
			        var dataArr = data[i];
			        dataHTML +=
			            '   <li data-id="' + dataArr.id + '">' +
			            '       <p>' +
			                        '<a href="#' + dataArr.name + '" data-id="' + dataArr.id + '" class="category-info">' + dataArr.name + '</a>' +
			                    '</p>' +
			            '   </li>';
			    }

			    dataHTML += '</ul>';
			    
			    return dataHTML;
			}
};



var videoStoreByPageHTML = {
	dataContent: function (data) {
				contentHeaderTitle.innerHTML = "Video stores";
			    var dataHTML = 
			        '<ul>';

			    for (var i = 0; i < data.length; i++) {
			        var dataArr = data[i];
			        dataHTML +=
			            '   <li data-id="' + dataArr.id + '" class="list-result">' +
			                    '<a href="#' + dataArr.title + '" data-id="' + dataArr.id + '" class="videostore-info">' + dataArr.title + '</a>' +
			            '   </li>';
			    }

			    dataHTML += '</ul>';

			    dataHTML += 
			    	'<div class="clear">' + 
			    		'<div class="left">';
			    /* pages */
			    var pages = allvideoStoresLenght / videoStoreByPage.count;
			    for (var i = 0, j = 1; i < pages; i++) {
			        dataHTML += 
			        ' <a href="#" data-pagehref="' + i + '" class="videoStore-page pagination-button"> ' + (j + i) + ' </a> ';
			    };
			    dataHTML += '</div>';
			    dataHTML += 
					    '<select id="count-page" class="right styled-select">'; 
						    for (var i = 5; i <= 20; i += 5) {
						    	if (i == videoStoreByPage.count) {
						    		dataHTML += '<option value="' + i + '" selected>' + i;
						    	} else {
						    		dataHTML += '<option value="' + i + '">' + i;
						    	}
						    }
				dataHTML += '</select>';
				dataHTML += '</div>';
			    return dataHTML;
			}
};

var actorsHTML = {
	dataContent: function (data) {
				contentHeaderTitle.innerHTML = "Actors";
			    var dataHTML = 
			        '<ul>';

			    for (var i = 0; i < data.length; i++) {
			    	var dataArr = data[i];
			        dataHTML +=
			            '<li data-id="' + dataArr.id + '">' +
			                    '<a href="#' + dataArr.firstName + dataArr.lastName + '" data-id="' + dataArr.id + '" class="actor-info">' + 
			                    	dataArr.firstName + " " + dataArr.lastName + '</a>' +
			            '</li>';
			    }

			    dataHTML += '</ul>';
			    
			    return dataHTML;
			}
};
