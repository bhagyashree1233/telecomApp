var myapp = angular.module('starter', ['ionic', 'starter.controllers', 'starter.service', 'ngCordova', 'starter.globalcontroller']).run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {

            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
}).directive('whenScrolled', function() {
    return function(scope, elm, attr) {

        var raw = elm[0];
        console.log('Hai')
        console.log(raw)
        elm.bind('scroll', function() {
            console.log(raw.scrollTop)
            console.log(raw.offsetHeight)
            console.log(raw.scrollHeight)
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                console.log('raw.scrollHeight');
                scope.$apply(attr.whenScrolled);
            }
        });
    }
    ;
}).config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('login', {
        url: '/login',
        controller: 'loginCtrl',
        templateUrl: 'templates/login.html'

    }).state('retailerSideMenu', {
        url: "/retailerSideMenu",
        abstract: true,
        templateUrl: "retailerSideMenu.html"
    })
    .state('mDelear', {
        url: '/mDelear',
        controller: 'masterDelearCtrl',
        templateUrl: 'templates/mastreDealerHome.html'

    }).state('mCurrentBalance', {
        url: '/mCurrentBalance',
        controller: 'masterDelearCtrl',
        templateUrl: 'templates/currentBalance.html'

    }).state('mchangePassword', {
        url: '/mchangePassword',
        controller: 'masterDelearCtrl',
        templateUrl: 'templates/changePassword.html'

    }).state('mAddBalance', {
        url: '/mchangePassword',
        controller: 'masterDelearCtrl',
        templateUrl: 'templates/addBalance.html'

    }).state('mReports', {
        url: '/mReports',
        controller: 'masterDelearCtrl',
        templateUrl: 'templates/reports.html'

    }).state('mAccrechargeReport', {
        url: '/mAccrechargeReport',
        controller: 'masterDelearCtrl',
        templateUrl: 'templates/accountReport.html'

    }).state('mRfdrechargeReport', {
        url: '/mRfdrechargeReport',
        controller: 'masterDelearCtrl',
        templateUrl: 'templates/refundReport.html'

    }).state('mRecrechargeReport', {
        url: '/mRecrechargeReport',
        controller: 'masterDelearCtrl',
        templateUrl: 'templates/rechargeReport.html'
    }).state('mComplain', {
        url: '/mComplain',
        controller: 'masterDelearCtrl',
        templateUrl: 'templates/complain.html'
    }).state('mComplainList', {
        url: '/mComplainList',
        controller: 'masterDelearCtrl',
        templateUrl: 'templates/complainList.html'
    }).state('mRevertBalance', {
        url: '/mComplainList',
        controller: 'masterDelearCtrl',
        templateUrl: 'templates/revertBalance.html'
    }).state('delear', {
        url: '/delear',
        controller: 'delearCtrl',
        templateUrl: 'templates/delearHome.html'

    }).state('dCurrentBalance', {
        url: '/dCurrentBalance',
        controller: 'delearCtrl',
        templateUrl: 'templates/currentBalance.html'

    }).state('dChangePassword', {
        url: '/dChangePassword',
        controller: 'delearCtrl',
        templateUrl: 'templates/changePassword.html'

    }).state('dAddRetailer', {
        url: '/dAddRetailer',
        controller: 'delearCtrl',
        templateUrl: 'templates/addRetailer.html'
    }).state('dAddBalance', {
        url: '/dchangePassword',
        controller: 'delearCtrl',
        templateUrl: 'templates/addBalance.html'

    }).state('dReports', {
        url: '/dReports',
        controller: 'delearCtrl',
        templateUrl: 'templates/reports.html'

    }).state('dAccrechargeReport', {
        url: '/dAccrechargeReport',
        controller: 'delearCtrl',
        templateUrl: 'templates/accountReport.html'

    }).state('dComplain', {
        url: '/dComplain',
        controller: 'delearCtrl',
        templateUrl: 'templates/complain.html'
    }).state('dComplainList', {
        url: '/dComplainList',
        controller: 'delearCtrl',
        templateUrl: 'templates/complainList.html'
    }).state('dTopUpReport', {
        url: '/dTopUpReport',
        controller: 'delearCtrl',
        templateUrl: 'templates/topupReport.html'
    }).state('dRevertBalance', {
        url: '/mComplainList',
        controller: 'delearCtrl',
        templateUrl: 'templates/revertBalance.html'
    }).state('retailer', {
        url: '/retailer',
        controller: 'reportCtrl',
        templateUrl: 'templates/retailerHome.html'

    }).state('mobileRecharge', {
        url: '/mobileRecharge',
        controller: 'retailerHomeCtrl',
        templateUrl: 'templates/mobileRecharge.html'

    }).state('utility', {
        url: '/utility',
        controller: 'retailerHomeCtrl',
        templateUrl: 'templates/utility.html'

    })
    .state('dthRecharge', {
        url: '/dthRecharge',
        controller: 'retailerHomeCtrl',
        templateUrl: 'templates/dthRecharge.html'
    }).state('postPaidRecharge', {
        url: '/postPaidRecharge',
        controller: 'retailerHomeCtrl',
        templateUrl: 'templates/postPaidRecharge.html'
    }).state('recharge', {
        url: '/recharge',
        controller: 'retailerHomeCtrl',
        templateUrl: 'templates/recharge.html'
    }).state('rCurrentBalance', {
        url: '/rCurrentBalance',
        controller: 'retailerCtrl',
        templateUrl: 'templates/currentBalance.html'
    }).state('rChangePassword', {
        url: '/rChangePassword',
        controller: 'retailerCtrl',
        templateUrl: 'templates/changePassword.html'
    }).state('rComplain', {
        url: '/rComplain',
        controller: 'retailerCtrl',
        templateUrl: 'templates/complain.html'
    }).state('rComplainList', {
        url: '/rComplainList',
        controller: 'retailerCtrl',
        templateUrl: 'templates/complainList.html'
    }).state('rAccrechargeReport', {
        url: '/rAccrechargeReport',
        controller: 'retailerCtrl',
        templateUrl: 'templates/accountReport.html'

    }).state('rRfdrechargeReport', {
        url: '/rRfdrechargeReport',
        controller: 'retailerCtrl',
        templateUrl: 'templates/refundReport.html'

    }).state('rRecrechargeReport', {
        url: '/rRecrechargeReport',
        controller: 'retailerCtrl',
        templateUrl: 'templates/rechargeReport.html'
    }).state('rRecrechargeTransaction', {
        url: '/rRecrechargeTransaction',
        controller: 'retailerCtrl',
        templateUrl: 'templates/rechargeTransaction.html'
    }).state('rSearchTransaction', {
        url: '/rSearchTransaction',
        controller: 'retailerCtrl',
        templateUrl: 'templates/searchTransaction.html'
    }).state('rReports', {
        url: '/rReports',
        controller: 'retailerCtrl',
        templateUrl: 'templates/reports.html'

    })
    $urlRouterProvider.otherwise('/login');
    // if none of the above states are matched, use this as the fallback

    /*.state('mDelear.currentBalance', {
        url: '/currentBalance',
        templateUrl: 'templates/currentBalance.html',
         controller: 'masterDelearCtrl'
    })
    .state('mDelear.complain', {
        url: '/complain',
        views: {
            'mDelear-complain': {
                templateUrl: 'templates/complain.html',
                controller: 'masterDelearCtrl'
            }
        }

    })
    .state('mDelear.complainList', {
        url: '/complainList',
        views: {
            'mDelear-complain': {
                templateUrl: 'templates/masterDealerHome.html',
                controller: 'masterDelearCtrl'
            }
        }
    })
    .state('mDelear.changePassword', {
        url: '/changePassword',
        views: {
            'mDelear-changePassword': {
                

                controller: 'masterDelearCtrl',
                templateUrl: 'templates/changePassword.html'
            }
        }
    })
    .state('mDelear.reports', {
        url: '/reports',
        views: {
            'mDelear-reports': {
                templateUrl: 'templates/reports.html',
                controller: 'masterDelearCtrl'
            }
        }
    })

    .state('mDelear.addBalance',{
       url: '/addBalance',
        views: {
            'mDelear-addBalance': {
                templateUrl: 'templates/addBalance.html',
                controller: 'masterDelearCtrl'
            }
        }
    })
    .state('mDelear.revertBalance',{
       url: '/reports',
        views: {
            'mDelear-addBalance': {
                templateUrl: 'templates/revertBalance.html',
                
            }
        }
    })*/

});
