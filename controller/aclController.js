/**
 * Created by carlen on 4/6/17.
 */

app.controller('aclController', ['$scope', '$stateParams', '$state', 'localStorageService', 'usSpinnerService', 'blihService',
    function ($scope, $stateParams, $state, localStorageService, usSpinnerService, blihService) {
        const user = localStorageService.get('user')
        const wesh = msg => console.log(msg)
        const getAclSpinner = 'getAclSpinner'
        const editSpinner = 'editSpinner'
        const addSpinner = 'addSpinner'
        const editModal = 'editModal'
        const addAclModal = 'addAclModal'
        const errAcl = 'Wrong username or acl'
        $scope.editModal = $('#editModal')
        $scope.addAclModal = $('#addAclModal')
        $scope.repoName = $stateParams.repoName
        $scope.currentAcl = []
        $scope.editError = false
        $scope.addError = false
        $scope.noAcl = true

        if (!user) $scope.goToAcl = name => $state.go('home')

        const checkAcl = acl => {
            if (!acl.length) return true
            for (let i = 0, len = acl.length; i < len; ++i)
                if (acl[i] !== 'a' && acl[i] !== 'r' && acl[i] !== 'w') return false
            return true
        }

        const getAclFormat = acl => {
            const keys = Object.keys(acl)
            const len = keys.length
            const aclFormat = []
            for (let i = 0; i < len; ++i) aclFormat.push([ keys[i], acl[keys[i]] ])
            return aclFormat
        }

        $scope.startSpin = id => usSpinnerService.spin(id)
        $scope.stopSpin = id => usSpinnerService.stop(id)

        $scope.closeModalEvent = id => $scope[id].modal('hide')
        $scope.openModalEvent = id => $scope[id].modal('show')

        $scope.getCurrentAcl = () => {
            $scope.startSpin(getAclSpinner)
            blihService.getAclRepo(user.userName, user.token, $scope.repoName)
                .then(msg => {
                    $scope.noAcl = false
                    $scope.currentAcl = getAclFormat(msg)
                    $scope.stopSpin(getAclSpinner)
                    $scope.$apply()
                })
                .catch(err => {
                    wesh('err getacl')
                    wesh(err)
                    $scope.noAcl = true
                    $scope.$apply()
                })
        }

        $scope.editEvent = (user, acl) => {
            $scope.openModalEvent(editModal)
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
                            $scope.currentAcl = getAclFormat(msg)
                            $scope.stopSpin(editSpinner)
                            $scope.$apply()
                            $scope.closeModalEvent(editModal)
                        })
                        .catch(err => {
                            wesh('err getacl')
                            wesh(err)
                            $scope.editError = true
                            $scope.stopSpin(editSpinner)
                        })
                })
                .catch(err => {
                    wesh('err setacl')
                    wesh(err)
                    $scope.editError = true
                    $scope.stopSpin(editSpinner)
                })
        }

        $scope.addAclEvent = () => {
            $scope.openModalEvent(addAclModal)
            $scope.aclFields = []
        }

        $scope.moreAclEvent = () => {
            if (!$scope.aclFields.length) $scope.aclFields.push({ name: '', acl: '', errAcl, id: 0, err: false })
            else {
                const id = $scope.aclFields[$scope.aclFields.length - 1].id + 1
                $scope.aclFields.push({ name: '', acl: '', errAcl, id, err: false })
            }
        }

        $scope.addAclRepoEvent = () => {
            //mail for tek1
            //login for tek2
        }

        $scope.getCurrentAcl()
    }])