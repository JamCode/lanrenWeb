console.log('init loginApp');
angular.module('loginApp', [])
.controller('loginController', function($scope, $http, $location, $window) {
    console.log('init loginController');
    $scope.user ={
        username: "",
        password: ""
    };
    $scope.loginButtonDisable = false;
    $scope.loginSuccess = true;

    $scope.loginClick = function(){
        $scope.loginButtonDisable = true;
        $scope.loginSuccess = true;

        console.log($scope.user.username);
        console.log($scope.user.password);
        $http.post('login', {
            username:$scope.user.username,
            password:$scope.user.password
        }).success(function(data){
            console.log(data);
            $scope.loginButtonDisable = false;
            if(data.code !== 0){
                $scope.loginSuccess = false;
            }else{
                $scope.loginSuccess = true;
                $window.location.href = '/mypage';
                console.log($scope.user.username);
                $window.localStorage['user'] = $scope.user.username;
            }
        });
    };
});
