/**
 * Created by carlen on 4/6/17.
 */

app.controller('aclController', ['$scope', '$stateParams', '$state', 'localStorageService', 'usSpinnerService', 'blihService',
    function ($scope, $stateParams, $state, localStorageService, usSpinnerService, blihService) {
        const user = localStorageService.get('user')
        const wesh = msg => console.log(msg)
        const getAclSpinner = 'getAclSpinner'
        const editSpinner = 'editSpinner'
        const editModal = $('#editModal')
        $scope.repoName = $stateParams.repoName
        $scope.currentAcl = []
        $scope.editError = false
        $scope.noAcl = true

        if (!user) $scope.goToAcl = name => $state.go('home')

        const checkAcl = acl => {
            if (!acl.length) return true
            for (let i = 0, len = acl.length; i < len; ++i)
                if (acl[i] !== 'a' && acl[i] !== 'r' && acl[i] !== 'w') return false
            return true
        }

        $scope.startSpin = id => usSpinnerService.spin(id)

        $scope.stopSpin = id => usSpinnerService.stop(id)

        $scope.getCurrentAcl = () => {
            $scope.startSpin(getAclSpinner)
            blihService.getAclRepo(user.userName, user.token, $scope.repoName)
                .then(msg => {
                    $scope.noAcl = false
                    const acl = msg.split('\n')
                    acl.pop()
                    const aclSort = []
                    for (let i = 0, len = acl.length; i < len; ++i) aclSort.push(acl[i].split(':'))
                    $scope.currentAcl = aclSort
                    $scope.stopSpin(getAclSpinner)
                    $scope.$apply()
                })
                .catch(_ => {
                    $scope.noAcl = true
                    $scope.$apply()
                })
        }

        $scope.editEvent = (user, acl) => {
            editModal.modal('show')
            $scope.editedAcl = acl
            $scope.editRepo = { name: user, acl }
        }

        $scope.editAclRepoEvent = () => {
            $scope.startSpin(editSpinner)
            if (!checkAcl($scope.editedAcl)) {
                $scope.editError = true
                $scope.stopSpin(editSpinner)
                return
            }
            blihService.setAclRepo(user.userName, user.token, $scope.repoName, $scope.editRepo.name, $scope.editedAcl)
                .then(msg => {
                    $scope.editError = false
                    blihService.getAclRepo(user.userName, user.token, $scope.repoName)
                        .then(msg => {
                            $scope.noAcl = false
                            const acl = msg.split('\n')
                            acl.pop()
                            const aclSort = []
                            for (let i = 0, len = acl.length; i < len; ++i) aclSort.push(acl[i].split(':'))
                            $scope.currentAcl = aclSort
                            $scope.stopSpin(editSpinner)
                            $scope.$apply()
                            $scope.closeModalEvent()
                        })
                        .catch(_ => {
                            $scope.editError = true
                            $scope.stopSpin(editSpinner)
                        })
                })
                .catch(_ => {
                    $scope.editError = true
                    $scope.stopSpin(editSpinner)
                })
        }

        $scope.closeModalEvent = () => editModal.modal('hide')

        $scope.getCurrentAcl()
    }])