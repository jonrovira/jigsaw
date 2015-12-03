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
					// Initializations
					var orgs = [];
					var counts,
					    topFour,
					    max,
					    ratio,
					    fillKeyIndex;
					var fillKeys = ['First', 'Second', 'Third', 'Fourth', 'Other'];

					// Put country's counts into an array and get the top ones
					counts = Object.keys(yearData).map(function (key) {
						return this[key].count;
					}, yearData);
					counts = counts.sort(function (a, b) {
						return a - b;
					});
					topFour = counts.slice(Math.max(counts.length - 4, 0));

					// Scale the counts
					max = Math.max.apply(Math, counts);
					ratio = max / 100;

					// Helper function to tackle scope issue
					fillKeyIndex = 0;
					var setFillKey = function (count) {
						if (topFour.indexOf(count) > -1) {
							// remove that from top four
							topFour.splice(topFour.indexOf(count), 1);

							// Increment fill key index, return correct fill key
							var i = fillKeyIndex;
							fillKeyIndex += 1;
							return fillKeys[i];
						} else {
							return fillKeys[4];
						}
					};

					// Create map objects
					for (var country in yearData) {
						if (yearData.hasOwnProperty(country)) {
							orgs.push({
								radius: Math.ceil(yearData[country].count / ratio) + 5,
								latitude: yearData[country].lat,
								longitude: yearData[country].lng,
								fillKey: setFillKey(yearData[country].count)
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
