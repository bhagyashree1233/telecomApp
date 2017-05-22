// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','starter.controllers','starter.service'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider,$urlRouterProvider) {
   

    $stateProvider.state('changePassword', {
        url: '/changePassword',
        templateUrl: 'templates/changePassword.html'

    })
     .state('addBalance', {
        url: '/addBalance',
        templateUrl: 'templates/addBalance.html'

    })
    .state('addRetailer', {
        url: '/addRetailer',
        templateUrl: 'templates/addRetailer.html'

    })
     .state('currentBalance', {
        url: '/currentBalance',
        templateUrl: 'templates/currentBalance.html'

    })
     .state('complain', {
        url: '/complain',
        templateUrl: 'templates/complain.html'

    })
     .state('dthRecharge', {
        url: '/dthRecharge',
        templateUrl: 'templates/dthRecharge.html'

    })
    .state('login', {
        url: '/login',
        controller:'loginCtrl',
        templateUrl: 'templates/login.html'

    })
    .state('masterDealerHome', {
        url: '/masterDealerHome',
        controller:'masterDelearCtrl',
        templateUrl: 'templates/mastreDealerHome.html'


    })
    .state('mobileRecharge', {
        url: '/mobileRecharge',
        templateUrl: 'templates/mobileRecharge.html'

    })
    .state('postPaidRecharge', {
        url: '/postPaidRecharge',
        templateUrl: 'templates/postPaidRecharge.html'

    })
    .state('recharge', {
        url: '/recharge',
        templateUrl: 'templates/recharge.html'

    })
    .state('rechargeReport', {
        url: '/rechargeReport',
        templateUrl: 'templates/rechargeReport.html'

    })
    .state('report', {
        url: '/report',
        templateUrl: 'templates/reports.html',
        controller:'reportCtrl'
    })
     .state('retailerHome', {
        url: '/retailerHome',
        templateUrl: 'templates/retailerHome.html'

    })
    .state('revertBalance', {
        url: '/revertBalance',
        templateUrl: 'templates/revertBalance.html'

    })
    .state('searchTransaction', {
        url: '/searchTransaction',
        templateUrl: 'templates/searchTransaction.html'

    })
    .state('delearHome', {
        url: '/delearHome',
        templateUrl: 'templates/delearHome.html',
       controller:'delearCtrl'
    })
    ;
      
    
   
  $urlRouterProvider.otherwise('login');
})