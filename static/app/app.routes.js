'use strict';


/**********
 * ROUTER *
 **********/
angular
	.module('jigsawApp')
	.config(
		[
			'$stateProvider', '$urlRouterProvider',
			function ($stateProvider, $urlRouterProvider) {

				$urlRouterProvider.otherwise('/main');

				$stateProvider
					.state('main', {
						url: '/main',
						views: {
							'timeline': {
								templateUrl: '/static/app/modules/timeline/timeline.html',
								controller: 'TimelineCtrl'
							},
							'map': {
								templateUrl: '/static/app/modules/map/map.html',
								controller: 'MapCtrl'
							}
						}
					});
			}
		]
	);



/******************
 * ROUTING ERRORS *
 ******************/
angular
	.module('jigsawApp')
	.run(function ($rootScope, $state) {
		$rootScope.$on('$stateChangeError', function (evt, toState, toParams, fromState, fromParams) {
			console.log('$stateChangeError - fired when an error occurs during a transition');
		});
		$rootScope.$on('$stateNotFound', function (evt, unfoundState, fromState, fromParams){
		  	console.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.');
		  	console.log(unfoundState, fromState, fromParams);
		});
	});