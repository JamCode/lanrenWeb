angular.module('myApp')
.controller('followController',function($scope, $rootScope, $http, $location, $window){

    $scope.getFollowContent = function(){
        $http.post('getFollowContent', {}).success(function(data){
            if(data.code === 0){
                $scope.followContent = data.data;
            }
        });
    };
    $scope.getFollowContent();

});
