/**
 * Created by carlen on 3/23/17.
 */

app.controller('listController', ['$scope', 'localStorageService', 'blihService', 'usSpinnerService', '$state',
    function ($scope, localStorageService, blihService, usSpinnerService, $state) {
        const user = localStorageService.get('user')
        $scope.repositoryList = user.repositoryList
        const deleteModal = $('#deleteModal')
        const deleteSpinner = 'deleteSpinner'
        const wesh = msg => console.log(msg)

        if (!user) {
            //TODO(carlen) redirect to home
        }

        $scope.startSpin = id => usSpinnerService.spin(id)

        $scope.stopSpin = id => usSpinnerService.stop(id)

        $scope.goToAcl = name => $state.go('acl', { repoName: name })

        $scope.deleteEvent = name => {
            $scope.deleteRepoName = name
            deleteModal.modal('show')
        }

        $scope.closeModalEvent = () => {
            $scope.deleteRepoName = ''
            deleteModal.modal('hide')
        }

        //TODO(carlendev) add error gestion
        $scope.deleteRepoEvent = () => {
            $scope.startSpin(deleteSpinner)
            blihService.deleteRepo(user.userName, user.token, $scope.deleteRepoName)
                .then(res => {
                    blihService.getRepositoryList(user.userName, user.token).then(list => {
                        user.repositoryList = list.split('\n')
                        localStorageService.set('user', user)
                        user.repositoryList.pop()
                        $scope.repositoryList = user.repositoryList
                        $scope.$apply()
                        $scope.stopSpin(deleteSpinner)
                        deleteModal.modal('hide')
                    })
                })
                .catch(err => {
                    wesh('err')
                    wesh(err)
                })
        }
}])