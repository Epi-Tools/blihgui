/**
 * Created by carlen on 3/22/17.
 */

app.controller('homeController', ['$scope', 'localStorageService', function ($scope, localStorageService) {
    const user = localStorageService.get('user')

    if (!user) {
        const modal = $('#loginModal');
        modal.modal({backdrop: 'static', keyboard: false})
        modal.modal('show')
    }

    $scope.submitForm = () => {
        if ($scope.userForm.$valid) {

        }
    }
}])