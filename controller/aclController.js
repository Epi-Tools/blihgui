/**
 * Created by carlen on 4/6/17.
 */

app.controller('aclController', ['$scope', '$stateParams', 'localStorageService', 'usSpinnerService', 'blihService',
    function ($scope, $stateParams, localStorageService, usSpinnerService, blihService) {
        const user = localStorageService.get('user')
        const wesh = msg => console.log(msg)
        const getAclSpinner = 'getAclSpinner'
        $scope.repoName = $stateParams.repoName
        $scope.currentAcl = []

        if (!user) {
            //TODO(carlen) redirect to home
        }

        $scope.startSpin = id => usSpinnerService.spin(id)

        $scope.stopSpin = id => usSpinnerService.stop(id)

        $scope.getCurrentAcl = () => {
            $scope.startSpin(getAclSpinner)
            blihService.getAclRepo(user.userName, user.token, $scope.repoName)
                .then(msg => {
                    const acl = msg.split('\n')
                    acl.pop()
                    const aclSort = []
                    for (let i = 0, len = acl.length; i < len; ++i) aclSort.push(acl[i].split(':'))
                    $scope.currentAcl = aclSort
                    $scope.stopSpin(getAclSpinner)
                    $scope.$apply()
                })
                .catch(err => {
                    //No acl
                })
        }

        $scope.getCurrentAcl()
    }])