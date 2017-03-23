/**
 * Created by carlen on 3/22/17.
 */

app.controller('homeController', ['$scope', 'localStorageService', 'blihService', function ($scope, localStorageService, blihService) {
    const user = localStorageService.get('user')
    const modal = $('#loginModal')

    if (!user) {
        modal.modal({ backdrop: 'static', keyboard: false })
        modal.modal('show')
    }

    $scope.submitForm = () => {
        if ($scope.userForm.$valid) {
            const userName = $scope.user.email;
            const token = blihService.getToken($scope.user.password)
            blihService.getRepositoryList(userName, token)
                .then(list => {
                    modal.modal('hide')
                })
                .catch(err => {

                })
        }
    }
}])