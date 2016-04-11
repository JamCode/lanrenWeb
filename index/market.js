console.log('init myApp');
angular.module('myApp', []).run(function($rootScope, $window) {
    console.log($window.localStorage['user']);
    $rootScope.user = {
        username: $window.localStorage['user']
    };
}).controller('navController',function($scope, $http, $location, $window) {
    console.log('init navController');
    console.log($window.localStorage['user']);
    // $scope.user = {
    //
    // };
    // $scope.user.username = $window.localStorage['user'];
    $scope.logoutClick = function(){
        console.log('logout');
        $http.post('logout', {
            username:$scope.user.username
        }).success(function(data){
            console.log(data);
            $window.location.href = '/login';
        });
    };
}).controller('contentController', function($scope, $http, $interval){

    console.log('init contentController');

    //获取大盘指数
    $scope.marketdata = [];

    getMarketInfo($http, function(data){
        $scope.marketdata = data;
    });

    $interval(function () {
        getMarketInfo($http, function(data){
            $scope.marketdata = data;
        });
        console.log($scope.marketdata);
    }, 10*1000);

    //获取自选股票
    console.log($scope.marketdata);

});

function getMarketInfo(http, callback){
    console.log('call getMarketInfo');
    http.post('marketInfo', {
    }).success(function(data){
        callback(data);
    });
}
