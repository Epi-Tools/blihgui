/**
 * Created by carlen on 3/22/17.
 */

app.controller('homeController', ['$scope', 'localStorageService', 'blihService', function ($scope, localStorageService, blihService) {
    let user = localStorageService.get('user')
    const modal = $('#loginModal')
    $scope.logError = false
    $scope.userData = {
        userName: '',
        password: ''
    }

    if (!user) {
        modal.modal({ backdrop: 'static', keyboard: false })
        modal.modal('show')
    }

    $scope.submitForm = () => {
        if ($scope.logError &&
            $scope.userData.userName == $scope.user.email &&
            $scope.userData.password == $scope.user.password) return
        if ($scope.userForm.$valid) {
            const userName = $scope.user.email
            const token = blihService.getToken($scope.user.password)
            $scope.userData.userName = userName
            $scope.userData.password = $scope.user.password
            blihService.getRepositoryList(userName, token)
                .then(list => {
                    const repositoryList = list.split('\n')
                    user = {
                        userName,
                        token,
                        repositoryList,
                        log: true
                    }
                    localStorageService.set('user', user)
                    modal.modal('hide')
                    $scope.userData = null
                    $scope.user = user
                    $scope.logError = false
                    $scope.$apply()
                })
                .catch(_ => {
                    $scope.logError = true
                    $scope.$apply()
                })
        }
    }
}])