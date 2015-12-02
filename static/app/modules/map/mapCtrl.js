'use strict';



/******************
 * MAP CONTROLLER *
 ******************/
angular
	.module('jigsawApp')
	.controller('MapCtrl',
		[
			'$scope', 'MapFctry',
			function ($scope, MapFctry) {

				var map = new Datamap({
					element: document.getElementById('map'),
					projection: 'mercator',
					fills: {
						'USA': '#2E3192',
						'RUS': '#29AAE2',
						'FRA': '#662D91',
						'AFG': '#39B54A',					
						'PAK': '#C0C2FF',
						defaultFill: '#5C728C'
					},
					geographyConfig: {
						hideAntarctica: false,
						borderColor: '#C0DDFF',
						highlightOnHover: false,
						popupOnHover: false
					}
				});

				$scope.activeYear = MapFctry.activeYear;
				$scope.$watch(function () {
					return MapFctry.activeYear;
				}, function (newValue, oldValue) {
					MapFctry.getYear().then(function (response) {
					var orgs = response;

					map.bubbles(orgs, {
						borderWidth: 0,
						popupOnHover: false,
						highlightOnHover: false
					});
				});
				});

			}
		]
	);