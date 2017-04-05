/**
 * Created by carlen on 3/22/17.
 */
//TODO(carlendev) when create repo remake repository list && add checkbox for ramassage-tek r and make view for see permission on repo
app.controller('homeController',
    ['$scope',
        'localStorageService',
        'blihService',
        'usSpinnerService',
        function ($scope, localStorageService, blihService, usSpinnerService) {
            let user = localStorageService.get('user')
            const loginModal = $('#loginModal')
            const createModal = $('#createModal')
            const loginSpinner = 'loginSpinner'
            const createSpinner = 'createSpinner'
            $scope.logError = false
            $scope.userData = {
                userName: '',
                password: ''
            }

            if (!user) {
                loginModal.modal({ backdrop: 'static', keyboard: false })
                loginModal.modal('show')
            }

            $scope.startSpin = id => usSpinnerService.spin(id)

            $scope.stopSpin = id => usSpinnerService.stop(id)

            $scope.submitCreate = () => {
                if ($scope.createForm.$valid) {
                    $scope.startSpin(createSpinner)
                    const name = $scope.repo.name
                    blihService.postRepo(user.userName, user.token, name)
                        .then(msg => {
                            blihService.getRepositoryList(user.userName, user.token).then(list => {
                                user.repositoryList = list.split('\n')
                                localStorageService.set('user', user)
                                $scope.createError = false
                                $scope.$apply()
                                createModal.modal('show')
                                $scope.stopSpin(createSpinner)
                            })
                        })
                        .catch(err => {
                            $scope.createError = true
                            $scope.$apply()
                            createModal.modal('show')
                            $scope.stopSpin(createSpinner)
                        })
                }
            }

            $scope.submitForm = () => {
                if ($scope.logError &&
                    $scope.userData.userName === $scope.user.email &&
                    $scope.userData.password === $scope.user.password) return
                if ($scope.userForm.$valid) {
                    $scope.startSpin(loginSpinner)
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
                            $scope.stopSpin(loginSpinner)
                        })
                        .catch(_ => {
                            $scope.logError = true
                            $scope.$apply()
                            $scope.stopSpin(loginSpinner)
                        })
                }
            }
}])