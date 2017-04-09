/**
 * Created by carlen on 4/9/17.
 */
const { dialog } = require('electron').remote

app.controller('gitController', ['$scope', '$stateParams', '$state', 'localStorageService', 'usSpinnerService',
    'gitService',
    function ($scope, $stateParams, $state, localStorageService, usSpinnerService, gitService) {
        const user = localStorageService.get('user')
        const wesh = msg => console.log(msg)
        const cloneSpinner = 'cloneSpinner'
        const notPath = 'Please choose a folder'
        const cloneError = 'Error while cloning, the repository was not cloned'
        const userNameError = 'Please enter a user name'
        $scope.repoName = $stateParams.repoName
        $scope.gitPath = null
        $scope.cloneError = false
        $scope.errClone = null
        $scope.username = user.userName
        $scope.successClone = false

        $scope.startSpin = id => usSpinnerService.spin(id)
        $scope.stopSpin = id => usSpinnerService.stop(id)

        if (!user) $scope.goToAcl = name => $state.go('home')

        $scope.getDirectory = () => {
            const directory = dialog.showOpenDialog({ properties: [ 'openDirectory' ] })
            if (directory === undefined || directory === null) return
            $scope.gitPath = directory
            if ($scope.errClone === notPath) $scope.cloneError = false
        }

        $scope.gitClone = () => {
            if ($scope.gitPath === undefined || $scope.gitPath === null) {
                $scope.cloneError = true
                $scope.errClone = notPath
                $scope.successClone = false
                return
            }
            if ($scope.username === null || $scope.username === '') {
                $scope.cloneError = true
                $scope.errClone = userNameError
                $scope.successClone = false
                return
            }
            $scope.startSpin(cloneSpinner)
            gitService.clone($scope.repoName, $scope.gitPath, $scope.username)
                .then(_ => {
                    $scope.cloneError = false
                    $scope.stopSpin(cloneSpinner)
                    $scope.successClone = true
                    $scope.$apply()
                })
                .catch(_ => {
                    $scope.stopSpin(cloneSpinner)
                    $scope.cloneError = true
                    $scope.errClone = cloneError
                    $scope.successClone = false
                    $scope.$apply()
                })
        }
    }])