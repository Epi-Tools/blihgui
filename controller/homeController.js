/**
 * Created by carlen on 3/22/17.
 */

app.controller('homeController', ['$scope', function ($scope) {
    if (!user.log) {
        const modal = $('#loginModal');
        modal.modal({backdrop: 'static', keyboard: false})
        modal.modal('show')
    }

    $scope.submitForm = () => {
        if ($scope.userForm.$valid) {

        }
    }
}]);