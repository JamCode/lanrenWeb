angular.module('myApp')
.controller('navController',function($scope, $rootScope, $http, $location, $window) {
    console.log('init navController');
    console.log($window.localStorage['user']);
    $scope.logoutClick = function(){
        console.log('logout');
        $http.post('logout', {
            username: $scope.user.username
        }).success(function(data){
            console.log(data);
            $window.location.href = '/login';
        });
    };

    // $scope.contentView = function(){
    //     console.log($scope.contentViewFile);
    //     return $scope.contentViewFile;
    // }

    // $rootScope.contentViewFile = 'market.html';
    $rootScope.activeSection = {
        marketActive: false,
        followActive: false,
        rankActive: false,
        settingActive: false
    };


    $scope.marketClick = function(){
        $rootScope.contentViewFile = 'market.html';
        for (var variable in $rootScope.activeSection) {
            $rootScope.activeSection[variable] = false;
        }
        $rootScope.activeSection.marketActive = true;
    };
    $scope.marketClick();

    $scope.settingClick = function(){
        console.log('settingClick');
        $rootScope.contentViewFile = "setting.html";
        for (var variable in $rootScope.activeSection) {
            $rootScope.activeSection[variable] = false;
        }
        $rootScope.activeSection.settingActive = true;
    };

    $scope.rankClick = function(){
        $rootScope.contentViewFile = "rank.html";
        for (var variable in $rootScope.activeSection) {
            $rootScope.activeSection[variable] = false;
        }
        $rootScope.activeSection.rankActive = true;
    };

    $scope.followClick = function(){
        $rootScope.contentViewFile = "follow.html";
        for (var variable in $rootScope.activeSection) {
            $rootScope.activeSection[variable] = false;
        }
        $rootScope.activeSection.followActive = true;
    };

})
