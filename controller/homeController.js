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
            const ramassage = 'ramassage-tek'
            $scope.logError = false
            $scope.userData = { userName: '', password: '' }
            $scope.checkboxModel = { aclRamassage: true }

            if (!user) {
                loginModal.modal({ backdrop: 'static', keyboard: false })
                loginModal.modal('show')
            }

            const wesh = msg => console.log(msg)

            const showModalCreate = () => {
                $scope.$apply()
                createModal.modal('show')
                $scope.stopSpin(createSpinner)
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
                                user.repositoryList.pop()
                                localStorageService.set('user', user)
                                if ($scope.checkboxModel.aclRamassage === true) {
                                    blihService.setAclRepo(user.userName, user.token, name, ramassage, 'r')
                                        .then(msg => {
                                            $scope.createError = false
                                            showModalCreate()
                                        })
                                        .catch(err => {
                                            wesh(err)
                                            $scope.createError = true
                                            showModalCreate()
                                        })
                                }
                                else showModalCreate()
                            })
                        })
                        .catch(err => {
                            $scope.createError = true
                            showModalCreate()
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
                            repositoryList.pop()
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