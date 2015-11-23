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
						'USA': '#9C4B13',
						'RUS': '#FB7823',
						'FRA': '#F94833',
						'AFG': '#373234',
						'PAK': '#7A5F40',
						defaultFill: '#106B6E'
					},
					geographyConfig: {
						hideAntarctica: false,
						borderColor: '#E5D7AE',
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