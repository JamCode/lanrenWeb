console.log('init myApp');
angular.module('myApp', []).run(function($rootScope, $window) {
    console.log($window.localStorage['user']);
    $rootScope.user = {
        username: $window.localStorage['user'],
        err_code: 0
    };
});
