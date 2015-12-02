'use strict';


/***************
 * MAP FACTORY *
 ***************/
angular
	.module('jigsawApp')
	.factory('MapFctry', [
			'$http',
			function ($http) {

				var o = {
					activeYear: 2004
				};
				var data = {};


				o.initialize = function () {
					return $http.get('addgeneData', {});
				};


				o.synthesizeOrgs = function (yearData) {
					var min = 0,
						max = 0;
					var ratio;
					var orgs = [];
					var fillKeys = ['USA', 'RUS', 'FRA', 'AFG', 'PAK'];

					for (var country in yearData) {
						if (yearData.hasOwnProperty(country)) {
							min = Math.min(min, yearData[country].count);
							max = Math.max(max, yearData[country].count);
						}
					}

					ratio = (max - min) / 100;

					for (var country in yearData) {
						if (yearData.hasOwnProperty(country)) {
							orgs.push({
								radius: Math.ceil(yearData[country].count / ratio) + 5,
								latitude: yearData[country].lat,
								longitude: yearData[country].lng,
								fillKey: function () {
									var r = Math.floor(Math.random() * 5);
									return fillKeys[r];
								}
							});
						}
					}

					return orgs;
				};


				o.getYear = function () {
					return new Promise(function (resolve, reject) {
						if (Object.keys(data).length === 0) {
							o.initialize().then(function (response) {
								data = response.data;
								resolve(o.synthesizeOrgs(data[o.activeYear])); 
							}, function (reason) {
								console.log(reason);
							});
						} else {
							resolve(o.synthesizeOrgs(data[o.activeYear]));
						}
					}, function (reason) {
						console.log(reason);
					});
				};


				o.setYear = function (year) {
					o.activeYear = year;
				};



				return o;

			}
		]
	)
