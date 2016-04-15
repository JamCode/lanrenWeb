angular.module('myApp').
controller('settingController', function($scope, $http, $interval){
    console.log('settingController');
    console.log($scope.user.username);

    $scope.getUserDtls = function(){
        $http.post('getUserDtls', {user_name: $scope.user.username}).success(function(data){
            if(data.code === 0){
                $scope.userDtls = data.data;
            }
        });
    }
    $scope.getUserDtls();


    $scope.getLookInfo = function(){
        $http.post('getLookInfo').success(function(data){
            if(data.code === 0){
                $scope.lookInfo = data.data;
            }
        });
    }
    $scope.getLookInfo();
});
