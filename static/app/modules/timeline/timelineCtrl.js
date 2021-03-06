'use strict';



/******************
 * MAP CONTROLLER *
 ******************/
angular
	.module('jigsawApp')
	.controller('TimelineCtrl',
		[
			'$scope', 'MapFctry',
			function ($scope, MapFctry) {

				$scope.activeYear = MapFctry.activeYear;
				$scope.years = [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015];


				// Sets the active year and propagates information to the map factory
				$scope.setActive = function (index) {
					$scope.activeYear = $scope.years[index];
					MapFctry.setYear($scope.years[index]);
				}


				// Set Interval to increment active year every x seconds
				var timelineInterval = setInterval(function () {
					var newIndex = ($scope.years.indexOf($scope.activeYear) + 1) % $scope.years.length;
					$scope.$apply(function () {
						$scope.setActive(newIndex);
					});
				}, 5000);

			}
		]
	);