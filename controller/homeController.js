/**
 * Created by carlen on 3/22/17.
 */
app.controller('homeController', ['$scope', 'localStorageService', 'blihService', function ($scope, localStorageService, blihService) {
    let user = localStorageService.get('user')
    const loginModal = $('#loginModal')
    const createModal = $('#createModal')
    $scope.logError = false
    $scope.userData = {
        userName: '',
        password: ''
    }

    if (!user) {
        loginModal.modal({ backdrop: 'static', keyboard: false })
        loginModal.modal('show')
    }

    $scope.submitCreate = () => {
        if ($scope.createForm.$valid) {
            const name = $scope.repo.name
            blihService.postRepo(user.userName, user.token, name)
                .then(msg => {
                    $scope.createError = false
                    $scope.$apply()
                    createModal.modal('show')
                })
                .catch(err => {
                    $scope.createError = true
                    $scope.$apply()
                    createModal.modal('show')
                })
        }
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
                    loginModal.modal('hide')
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