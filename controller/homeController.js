/**
 * Created by carlen on 3/22/17.
 */

app.controller('homeController', ['$scope', function ($scope) {
    if (!user.log) {
        $('#loginModal').modal({backdrop: 'static', keyboard: false})
        $('#loginModal').modal('show')
    }
}]);