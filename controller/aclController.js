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
        const trueAcl = 'Acl set'
        $scope.modifyAcl = true
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
            if (!$scope.modifyAcl) return
            $scope.startSpin(getAclSpinner)
            blihService.getAclRepo(user.userName, user.token, $scope.repoName)
                .then(msg => {
                    $scope.modifyAcl = false
                    $scope.noAcl = false
                    $scope.currentAcl = getAclFormat(msg)
                    $scope.stopSpin(getAclSpinner)
                    $scope.$apply()
                })
                .catch(err => {
                    $scope.modifyAcl = false
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
            blihService.setAclRepo(user.userName, user.token, $scope.repoName, $scope.editRepo.name, $scope.editedAcl, 0)
                .then(msg => {
                    $scope.editError = false
                    blihService.getAclRepo(user.userName, user.token, $scope.repoName)
                        .then(data => {
                            $scope.noAcl = false
                            $scope.currentAcl = getAclFormat(data.body)
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
            if (!$scope.aclFields.length) $scope.aclFields.push({ name: '', acl: 'rw', errAcl, trueAcl, id: 0,
                err: false, notErr: false })
            else {
                const id = $scope.aclFields[$scope.aclFields.length - 1].id + 1
                $scope.aclFields.push({ name: '', acl: 'rw', errAcl, trueAcl, id, err: false, notErr: false })
            }
        }

        $scope.lessAclEvent = () => {
            if ($scope.aclFields.length) $scope.aclFields.pop()
        }

        $scope.addAclRepoEvent = () => {
            const len = $scope.aclFields.length
            let err = false
            for (let i = 0; i < len; ++i) {
                if (!checkAcl($scope.aclFields[i].acl) || $scope.aclFields[i].name === '') {
                    $scope.aclFields[i].err = true
                    err = true
                }
                else $scope.aclFields[i].err = false
            }
            if (err) return
            $scope.startSpin(addSpinner)
            let count = 0
            const aclCpy = JSON.parse(JSON.stringify($scope.aclFields))
            for (let i = 0; i < len; ++i) {
                blihService.setAclRepo(user.userName, user.token, $scope.repoName, aclCpy[i].name, aclCpy[i].acl, i)
                    .then(data => {
                        $scope.modifyAcl = true
                        ++count
                        const entity = aclCpy[data.pos]
                        entity.notErr = true
                        if (count === len) {
                            $scope.aclFields = aclCpy
                            $scope.stopSpin(addSpinner)
                            $scope.$apply()
                        }
                    })
                    .catch(data => {
                        ++count
                        const entity = aclCpy[data.pos]
                        entity.err = true
                        if (count === len) {
                            $scope.aclFields = aclCpy
                            $scope.stopSpin(addSpinner)
                            $scope.$apply()
                        }
                    })
            }
        }

        $scope.closeModalEventAcl = id => {
            $scope.getCurrentAcl()
            $scope[id].modal('hide')
        }

        $scope.getCurrentAcl()
    }])