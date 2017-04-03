/**
 * Created by carlen on 3/23/17.
 */

app.controller('listController', ['$scope', 'localStorageService', function ($scope, localStorageService) {
    const user = localStorageService.get('user')
    $scope.repositoryList = user.repositoryList
    const deleteModal = $('#deleteModal')

    if (!user) {
        //TODO(carlen) redirect to home
    }

    $scope.deleteEvent = name => {
        $scope.deleteRepoName = name
        deleteModal.modal('show')
    }

    $scope.closeModalEvent = () => {
        $scope.deleteRepoName = ''
        deleteModal.modal('hide')
    }

    $scope.deleteRepoEvent = () => {

    }
}])