/**
 * Created by carlen on 3/23/17.
 */

app.controller('listController', ['$scope', 'localStorageService', function ($scope, localStorageService) {
    const user = localStorageService.get('user')
    $scope.repositoryList = user.repositoryList

    if (!user) {
        //TODO(carlen) redirect to home
    }
}])