angular.module('starter.globalcontroller', [])

.controller('global', function($rootScope, $scope,  $cordovaToast,$ionicLoading,authentication,serviceDB
) {
    console.log('Hello hai');


 $rootScope.closeView = function() {

        $ionicHistory.goBack(-1);
    }

    $rootScope.showDbLoading = function() {
        console.log("ShowDBloading");
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><p>LOADING...</p>',
            showDelay: 0
        }).then(function() {
            console.log("The loading indicator is now displayed");
        });
    }
    ;

    $rootScope.hideDbLoading = function() {
        $ionicLoading.hide().then(function() {
            console.log("The loading indicator is now hidden");
        });
    }
    ;

    $rootScope.ShowToast = function(message, longx) {
        if (window.cordova) {
            if (longx == true) {

                $cordovaToast.showLongCenter(message).then(function(success) {
                    // success
                    console.log("Toast Success");
                }, function(error) {
                    // error
                    console.log("Toast Failed");
                });
            } else {
                $cordovaToast.showShortCenter(message).then(function(success) {
                    // success
                    console.log("Toast Success");
                }, function(error) {
                    // error
                    console.log("Toast Failed");
                });

            }
        }

    }
  

	$rootScope.GetSchemebyType= function (req, res) {
  var type = req.body.Type;

   connection.query("SELECT * FROM Scheme WHERE Type = '" + type + "'", function (err, result) {
    if (err) {
       console.log('unable to get scheme');
       console.log(err);
       res.send({data:"failure"});
    } else {
       console.log(result);
       res.send({data:result});
    };
  }); 
}


})
