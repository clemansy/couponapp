/**
 * 
 */

var scotchTodo = angular.module('couponApp', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all coupons and show them
    $http.get('/api/coupons')
        .success(function(data) {
            $scope.coupons = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createCoupon = function() {
        $http.post('/api/coupons', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.coupons = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a Coupon after checking it
    $scope.deleteCoupon = function(id) {
        $http.delete('/api/coupons/' + id)
            .success(function(data) {
                $scope.coupons = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}