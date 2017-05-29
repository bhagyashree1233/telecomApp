angular.module('starter.controllers', [])
 .controller('loginCtrl', function($scope, $state, serviceDB, $rootScope, $location) {
  $scope.login = {}
  $scope.loginSub = function(usn) {
  	console.log($scope.login.Uname);
   if ( $scope.login.Uname == undefined ||  $scope.login.Uname == "") {
    $rootScope.ShowToast('Failed to login')
    return false;
   }
   if ($scope.login.Pwd == undefined || $scope.login.Pwd == "") {
    $rootScope.ShowToast('Failed to login')
    return false;
   }
   $rootScope.showDbLoading();
   var promise = serviceDB.login($scope.login, '/loginValidate');
   promise.then(function(res) {
    console.log(res.data);
    $rootScope.hideDbLoading()
    if (res.data.done) {
     if ($scope.login.Uname > 1000 && $scope.login.Uname < 1000000) {
      $location.path('/mDelear');
     } else if ($scope.login.Uname > 1000000 && $scope.login.Uname < 2000000) {
      $scope.password = document.getElementById("pwd").value = '';
      $location.path('/delear');
     } else if ($scope.login.Uname > 2000000) {
      $scope.password = document.getElementById("pwd").value = '';
      $location.path('/retailer');

     } else {
      $rootScope.ShowToast('Failed to login')
      return false;
     }
    }
   }, function(res) {
    $rootScope.hideDbLoading();
    $rootScope.ShowToast('Failed to login')
    return false;
   });


  }
 })
 .controller('masterDelearCtrl', function($scope, $state, serviceDB, $rootScope, $interval, authentication) {
  $scope.masterDelear = [];
  $scope.CurrenBalance = '';
  $scope.newpwd={};
  $scope.transferDetails = {};
  var id='';
  id=authentication.currentUser().userId;
  var type='';
  console.log('I am in master delear')
  $scope.getBalance = function() {
   var tName = 'MasterDealer';
   var promise = serviceDB.toServer({
    "Id": id,
    "TName": tName
   }, '/getBalanceAmount');
   promise.then(function(res) {
    $scope.CurrenBalance = res.data.data[0].Balance
   }, function(res) {
    console.log(res);
    $rootScope.ShowToast('Failed to get Balance')

   });
  }

  $scope.getBalance();


  $scope.masterDelear = [{
    name: "Current Balance",
    clas: 'icon ionIcon ion-cash'
   }, {
    name: "Complain",
    clas: 'icon ionIcon ion-ios-email'
   }, {
    name: "Complain List",
    clas: 'icon ionIcon ion-ios-email'
   }, {
    name: "Change Password",
    clas: 'icon ionIcon ion-key'
   }, {
    name: "Reports",
    clas: 'icon ionIcon ion-document-text'
   }, {
    name: "Add Balance"
   }, {
    name: "Revert Balance"
   },

  ]
  $scope.master = function(delear) {
   $scope.home = false;
   console.log(delear);
   if (delear.name == 'Current Balance') {

    $state.go('mCurrentBalance')
   } else if (delear.name == 'Complain') {
    $state.go('mDelear.complain')
   } else if (delear.name == 'Complain List') {
    $state.go('login')
   } else if (delear.name == 'Change Password') {
    $scope.pages = 'changePassword'
    $state.go('mchangePassword')
   } else if (delear.name == 'Reports') {
    $state.go('report')
   } else if (delear.name == 'Add Balance') {
    $state.go('mAddBalance')
   } else if (delear.name == 'Revert Balance') {
    $state.go('revertBalance')
   }
  }

  $scope.start = function() {
  $interval(function() {
    window.location.reload();
   }, 5000);

  }
  $scope.transferMoney = function() {
   
   $scope.transferDetails["SenderId"] = id;
   $scope.transferDetails["CurSenderBalance"] = $scope.CurrenBalance;

   if (Number($scope.transferDetails.Amount < 1)) {
    $rootScope.ShowToast('Invalid Amount');
    return;
   }
   if ((Number($scope.CurrenBalance) - Number($scope.transferDetails.Amount)) < 0) {
    $rootScope.ShowToast('Invalid Amount');
    return;
   }
   if ($scope.transferDetails.RecieverId> 1000000 && $scope.transferDetails.RecieverId < 2000000) {
      type='Dealer';
     } else if ($scope.transferDetails.RecieverId > 2000000) {
      type='Retailer';
     } else{
    $rootScope.ShowToast('Invalid id');
     }
   var promise = serviceDB.toServer({
    "Id": $scope.transferDetails.RecieverId,
    "TName": type
   }, '/getBalanceAmount');
   promise.then(function(res) {
     console.log();
     if(res.data.data[0]!=undefined){
    $scope.CurrenDelBalance = res.data.data[0].Balance;

    $scope.transferDetails.RecieverBalance = $scope.CurrenDelBalance;
    console.log($scope.CurrenDelBalance);
    console.log($scope.transferDetails.RecieverBalance + 'Delear Balance');

    var promise = serviceDB.toServer($scope.transferDetails, '/addMoneyTransferDetails');
    promise.then(function(res) {
     console.log(res);
     $scope.transferDetails={}
    }, function(res) {
     console.log(res);
     $scope.transferDetails={}
     $rootScope.ShowToast('Unable to add balace');
    });
    }else{
       $rootScope.ShowToast('Invalid id');
    }
   });
  }

  $scope.changePassword = function() {
   console.log($scope.newpwd)
   console.log('I am in master deler change password')
   if ($scope.newpwd.newpassword == undefined || $scope.newpwd.newpassword == "") {
    $cordovaToast.show('Enter New Password', 'long', 'center')
    return false
   }
   if ( $scope.newpwd.cnewpassword == undefined || $scope.newpwd.cnewpassword == "") {
    $cordovaToast.show('Enter Confirm Password', 'long', 'center')
    return false
   }
   if ($scope.newpwd.newpassword != $scope.newpwd.cnewpassword) {
    console.log("password does not match");
    $cordovaToast.show('New password does not match confirm password', 'long', 'center')
    return false;
   }
   $scope.newpwd["Id"] = id;
   $scope.newpwd["tName"] = "MasterDealer";
   var promise = serviceDB.toServer($scope.newpwd, '/changePassword');
   promise.then(function(res) {
    if (res.data.done) {
     $scope.newpwd = {};
     $cordovaToast.show('Changed Password Successfully', 'long', 'center')
    } else {

     $cordovaToast.show('invalid old password', 'long', 'center')
     $scope.newpwd = {};
    }
    console.log(res);
   }, function(res) {
    $cordovaToast.show('Unable to change password', 'long', 'center')
     $scope.newpwd = {};
   });
  }

 })
 .controller('reportCtrl', function($scope, $state) {
  $scope.reports = [];
  $scope.reports = [{
   name: 'Recharge Report',
   clss: 'icon ionIcon ion-document-text'
  }, {
   name: 'Refund Report',
   clss: 'icon ionIcon ion-document-text'
  }, {
   name: 'Topup History',
   clss: 'icon ionIcon ion-document-text'
  }, {
   name: 'Account Report',
   clss: 'icon ionIcon ion-document-text'
  }]
  $scope.repo = function(report) {
   if (report.name == 'Recharge Report') {
    $state.go('rechargeReport')
   } else if (report.name == 'Refund Report') {
    $state.go('rechargeReport')
   } else if (report.name == 'Topup History') {
    $state.go('rechargeReport')
   } else {
    $state.go('rechargeReport')
   }
  }

 })
 .controller('delearCtrl', function($interval, $scope, $state, $rootScope, serviceDB, $cordovaToast, authentication, $filter) {
   var id='';
   id= authentication.currentUser().userId;
  var tName = "Dealer";
  $scope.CurrenBalance = '';
  $scope.retailer={};
  $scope.newpwd={};
  $scope.transferDetails={};
  var promise = serviceDB.toServer({
   "Id": id,
   "TName": tName
  }, '/getBalanceAmount');

  promise.then(function(res) {
   if(res.data.data[0]!=undefined){
  $scope.CurrenBalance = res.data.data[0].Balance;
   }else{
   $cordovaToast.show('Unable to get balance', 'long', 'center')
   }

  }, function(res) {
   $cordovaToast.show('Unable to get balance', 'long', 'center')
  });

  $scope.getMasterIdByDId = function() {
   
   var promise = serviceDB.toServer({
    "Dealerid": id
   }, '/getMIdByDId');
   promise.then(function(res) {
    console.log(res.data.data);
    if (res.data.data != "failure") {
     $scope.ParentMasterDealerId = res.data.data[0].ParentMasterDealerId;
    }else{
         $cordovaToast.show('Unable to get Master Id', 'long', 'center')

    }

   }, function(res) {
    console.log(res);
   });
  }

  $scope.getListOfScheme = function(sType) {
   var promise = serviceDB.toServer({
    Type: sType
   }, '/getScheme');
   promise.then(function(res) {
    if(res.data.data!=undefined){
    $scope.schemeList = res.data.data;
    console.log($scope.schemeList)
    }else{
        $cordovaToast.show('Unable to Scheme List', 'long', 'center')

    }
   }, function(res) {
         $cordovaToast.show('Unable to Scheme List', 'long', 'center')
   });
  }
  $scope.start = function() {
   $interval(function() {
    window.location.reload(true);
   }, 5000);

  }
  $scope.getListOfRetailerType = function() {
   var promise = serviceDB.toServer({}, '/getRetailerType');
   promise.then(function(res) {
    console.log("success");
    console.log(res);

    if (res.data.data != "failure") {
     $scope.retailerTypeList = res.data.data;
    }else{
        $cordovaToast.show('Unable to get Retailer type', 'long', 'center')
    }
   }, function(res) {
        $cordovaToast.show('Unable to get Retailer type', 'long', 'center')
   });
  }
  $scope.getListOfRetailerType();
  $scope.getListOfScheme('retailer');
  $scope.getMasterIdByDId();
  $rootScope.statelist = ["Karnataka", "Andra Pradesh", "Kerala", "TamilNadu"];

  var citylist = [{
   "city": "Bangalore",
   "state": "Karnataka"
  }, {
   "city": "Mysore",
   "state": "Karnataka"
  }, {
   "city": "Raichur",
   "state": "Karnataka"
  }, {
   "city": "Tumkur",
   "state": "Karnataka"
  }, {
   "city": "Shivamoga",
   "state": "Karnataka"
  }, {
   "city": "Davanagere",
   "state": "Karnataka"
  }, {
   "city": "Belagavi",
   "state": "Karnataka"
  }, {
   "city": "Hyderabad",
   "state": "Andra Pradesh"
  }, {
   "city": "Tirupathi",
   "state": "Andra Pradesh"
  }, {
   "city": "Trivendrum",
   "state": "Kerala"
  }, {
   "city": "Kochi",
   "state": "Kerala"
  }, {
   "city": "Chennai",
   "state": "TamilNadu"
  }];

  $rootScope.loadCities = function(selState) {
   console.log(selState);
   $rootScope.cities = ($filter('filter')(citylist, {
    state: selState
   }));
  }
  $scope.delear = [{
   name: "Current Balance",
   clas: 'icon ionIcon ion-cash'
  }, {
   name: "Complain",
   clas: 'icon ionIcon ion-ios-email'
  }, {
   name: "Complain List",
   clas: 'icon ionIcon ion-ios-email'
  }, {
   name: "Change Password",
   clas: 'icon ionIcon ion-key'
  }, {
   name: "Reports",
   clas: 'icon ionIcon ion-document-text'
  }, {
   name: "Add Balance"
  }, {
   name: "Revert Balance"
  }, {
   name: "Add Retailer"
  }]
  $scope.delr = function(delear) {
   console.log(delear);
   if (delear.name == 'Current Balance') {
    $state.go('dCurrentBalance')
   } else if (delear.name == 'Complain') {
    $state.go('complain')
   } else if (delear.name == 'Complain List') {
    $state.go('login')
   } else if (delear.name == 'Change Password') {
    $state.go('dChangePassword')
   } else if (delear.name == 'Reports') {
    $state.go('report')
   } else if (delear.name == 'Add Balance') {
    $state.go('dAddBalance')
   } else if (delear.name == 'Revert Balance') {
    $state.go('revertBalance')
   } else if (delear.name == 'Add Retailer') {
    $state.go('dAddRetailer')
   }
  }

  $scope.addNewRetailer = function() {
   
   console.log($scope.retailer)
   console.log($scope.getMasterIdByDId());
   $scope.retailer["LoginStatus"] = "success";
   $scope.retailer["ParentDealerId"] = id;
   $scope.retailer["ParentMasterDealerId"] = $scope.ParentMasterDealerId;
   if ($scope.retailer.Name == "" || $scope.retailer.Name == undefined) {
    $rootScope.ShowToast('name required');
    return;
   }
   if ($scope.retailer.Address == "" || $scope.retailer.Address == undefined) {
    $rootScope.ShowToast('address required');
    return;
   }

   if ($scope.retailer.State == "" || $scope.retailer.State == undefined) {
    $rootScope.ShowToast('select state');
    return;
   }
   if ($scope.retailer.Mobile == "" || $scope.retailer.Mobile == undefined) {
    $rootScope.ShowToast('Mobile number required');
    return;
   } else if (Number.isNaN($scope.retailer.Mobile) || $scope.retailer.Mobile.length < 10 || $scope.retailer.Mobile.length > 10) {
    $rootScope.ShowToast('Mobile number');
    return;
   }
   if ($scope.retailer.RetailerType == "" || $scope.retailer.RetailerType == undefined) {
        $rootScope.ShowToast('Select retailer type');

    return;
   }
   if ($scope.retailer.PanNo == undefined) {
        $rootScope.ShowToast('Pan no required');
   }
   if ($scope.retailer.PinCode == "" || $scope.retailer.PinCode == undefined) {
    $rootScope.ShowToast('Pincode no required');
    return;
   }

   if ($scope.retailer.ParentDealerId == "" || $scope.retailer.ParentDealerId == undefined) {
        $rootScope.ShowToast('ParentDealerId not defined');

    return;
   }
   if (Number.isNaN($scope.retailer.PinCode)) {
        $rootScope.ShowToast('Enter valid pincode');

    return;
   }
   if ($scope.retailer.City == "" || $scope.retailer.City == undefined) {
            $rootScope.ShowToast('Select city');

    return;
   }
   if ($scope.retailer.LandLine == undefined) {
    $scope.retailer.LandLine = "";
   } else
   if ($scope.retailer.LandLine != "" && Number.isNaN($scope.retailer.LandLine)) {
    console.log('Enter valid landline number');
            $rootScope.ShowToast('Enter valid Landline Number');
    return;
   }
   if ($scope.retailer.EmailId == "" || $scope.retailer.EmailId == undefined) {
    console.log('email required');
                $rootScope.ShowToast('Email id required');

    return;
   }
   if ($scope.retailer.ContactPerson == "" || $scope.retailer.ContactPerson == undefined) {
    $rootScope.ShowToast('Enter Contact Person');
    return;
   }
   if ($scope.retailer.Scheme == "" || $scope.retailer.Scheme == undefined) {
    $rootScope.ShowToast('Select Scheme');
    return;
   }

   if ($scope.retailer.Balance == "" || $scope.retailer.Balance == undefined) {
    $scope.retailer.Balance = 0;
   }
   if ($scope.retailer.Balance != 0 && Number.isNaN($scope.retailer.Balance)) {
        $rootScope.ShowToast('Invalid Balance');

    return;
   }



   //  var promise = serviceDB.toServer(retailer, 'http://telecom.azurewebsites.net/addRetailer');       
   var promise = serviceDB.toServer($scope.retailer, '/addRetailer');


   promise.then(function(res) {
    console.log("success");

    console.log(res);
   }, function(res) {
    console.log(res);

   });

  }
    $scope.transferMoney = function() {
   
   $scope.transferDetails["SenderId"] = id;
   $scope.transferDetails["CurSenderBalance"] = $scope.CurrenBalance;

   if (Number($scope.transferDetails.Amount < 1)) {
    $rootScope.ShowToast('Invalid Amount');
    return;
   }
   if ((Number($scope.CurrenBalance) - Number($scope.transferDetails.Amount)) < 0) {
    $rootScope.ShowToast('Invalid Amount');
    return;
   }
   if ($scope.transferDetails.RecieverId > 2000000) {
      type='Retailer';
     } else{
    $rootScope.ShowToast('Invalid id');
     }
   var promise = serviceDB.toServer({
    "Id": $scope.transferDetails.RecieverId,
    "TName": type
   }, '/getBalanceAmount');
   promise.then(function(res) {
     console.log();
     if(res.data.data[0]!=undefined){
    $scope.CurrenDelBalance = res.data.data[0].Balance;

    $scope.transferDetails.RecieverBalance = $scope.CurrenDelBalance;
    console.log($scope.CurrenDelBalance);
    console.log($scope.transferDetails.RecieverBalance + 'Delear Balance');

    var promise = serviceDB.toServer($scope.transferDetails, '/addMoneyTransferDetails');
    promise.then(function(res) {
     console.log(res);
     $scope.transferDetails={}
    }, function(res) {
     console.log(res);
     $scope.transferDetails={}
     $rootScope.ShowToast('Unable to add balace');
    });
    }else{
       $rootScope.ShowToast('Invalid id');
    }
   });
  }
  $scope.changePassword = function() {
   console.log('Hai');
   console.log($scope.newpwd)
   console.log('I am in master deler change password')
   if ($scope.newpwd.newpassword == undefined || $scope.newpwd.newpassword == "") {
    $cordovaToast.show('Enter New Password', 'long', 'center')
    return false
   }
   if ( $scope.newpwd.cnewpassword == undefined || $scope.newpwd.cnewpassword == "") {
    $cordovaToast.show('Enter Confirm Password', 'long', 'center')
    return false
   }
   if ($scope.newpwd.newpassword != $scope.newpwd.cnewpassword) {
    console.log("password does not match");
    $cordovaToast.show('New password does not match confirm password', 'long', 'center')
    return false;
   }
   $scope.newpwd["Id"] = id;
   $scope.newpwd["tName"] = "Dealer";
   var promise = serviceDB.toServer($scope.newpwd, '/changePassword');
   promise.then(function(res) {
    if (res.data.done) {
     $scope.newpwd = {};
     $cordovaToast.show('Changed Password Successfully', 'long', 'center')
    } else {

     $cordovaToast.show('invalid old password', 'long', 'center')
     $scope.newpwd = {};
    }
    console.log(res);
   }, function(res) {
    $cordovaToast.show('Unable to change password', 'long', 'center')
     $scope.newpwd = {};
   });
  }
 })
 .controller('retailerCtrl', function($scope, $state, serviceDB, $rootScope, $cordovaToast, authentication) {
 var id='';
 var tName='';
 $rootScope.recharge = {};
 $scope.newpwd={};
   id = authentication.currentUser().userId;
   tName = "Retailer";
  $scope.CurrenBalance = '';
  var promise = serviceDB.toServer({
   "Id": id,
   "TName": tName
  }, '/getBalanceAmount');

  promise.then(function(res) {
   console.log(res);
   if(res.data.data!=undefined){
  $scope.CurrenBalance = res.data.data[0].Balance;
   
   }
  }, function(res) {
     $cordovaToast.show('Unable to get balence', 'long', 'center')
  });
  
 
  $scope.retailer = [{
   name: "Mobile Recharge",
   clas: 'icon ionIcon ion-android-phone-portrait'
  }, {
   name: "DTH Recharge",
   clas: 'icon ionIcon ion-easel'
  }, {
   name: "Postpaid Recharge",
   clas: 'icon ionIcon ion-android-phone-portrait'
  }, {
   name: "Recharge Transaction",
   clas: 'icon ionIcon ion-document-text'
  }, {
   name: "Search Transaction",
   clas: 'icon ionIcon ion-document-text'
  }, {
   name: "Current Balance",
   clas: 'icon ionIcon ion-cash'
  }, {
   name: "Complain",
   clas: 'icon ionIcon ion-ios-email'
  }, {
   name: "Complain List",
   clas: 'icon ionIcon ion-ios-email'
  }, {
   name: "Change Password",
   clas: 'icon ionIcon ion-key'
  }, {
   name: "Reports",
   clas: 'icon ionIcon ion-document-text'
  }]
  $scope.retlr = function(ret) {


   if (ret.name == 'Mobile Recharge') {
    $state.go('mobileRecharge')
   } else if (ret.name == 'DTH Recharge') {
    $state.go('dthRecharge')
   } else if (ret.name == 'Postpaid Recharge') {
    $state.go('postPaidRecharge')
   } else if (ret.name == 'Recharge Transaction') {
    $state.go('login');
   } else if (ret.name == 'Search Transaction') {
    $state.go('searchTransaction');
   } else if (ret.name == 'Current Balance') {
    $state.go('rCurrentBalance')
   } else if (ret.name == 'Complain') {
    $state.go('complain')
   } else if (ret.name == 'Complain List') {
    $state.go('login')
   } else if (ret.name == 'Change Password') {
    $state.go('rChangePassword')
   } else if (ret.name == 'Reports') {
    $state.go('report')
   }
  }

  $scope.changePassword = function() {
   console.log($scope.newpwd)
   console.log('I am in master deler change password')
   if ($scope.newpwd.newpassword == undefined || $scope.newpwd.newpassword == "") {
    $cordovaToast.show('Enter New Password', 'long', 'center')
    return false
   }
   if ( $scope.newpwd.cnewpassword == undefined || $scope.newpwd.cnewpassword == "") {
    $cordovaToast.show('Enter Confirm Password', 'long', 'center')
    return false
   }
   if ($scope.newpwd.newpassword != $scope.newpwd.cnewpassword) {
    console.log("password does not match");
    $cordovaToast.show('New password does not match confirm password', 'long', 'center')
    return false;
   }
   $scope.newpwd["Id"] = id;
   $scope.newpwd["tName"] = "Retailer";
   var promise = serviceDB.toServer($scope.newpwd, '/changePassword');
   promise.then(function(res) {
    if (res.data.done) {
     $scope.newpwd = {};
     $cordovaToast.show('Changed Password Successfully', 'long', 'center')
    } else {

     $cordovaToast.show('invalid old password', 'long', 'center')
     $scope.newpwd = {};
    }
    console.log(res);
   }, function(res) {
    $cordovaToast.show('Unable to change password', 'long', 'center')
     $scope.newpwd = {};
   });
  }
 })
 .controller('retailerHomeCtrl', function($scope, $state, $rootScope, authentication, serviceDB) {

  $scope.mobileRecharge = [{
    id: "AIR",
    name: "Airtel",
    src: 'img/airtel.jpg'
   }, {
    name: "Vodafone",
    src: 'img/vodafone.jpg'
   }, {
    name: "Aircel",
    src: 'img/aircel.jpg'
   }, {
    name: "BSNL-TOPUP",
    src: 'img/bsnl.jpg'
   }, {
    name: "VIRGIN-GSM",
    src: 'img/docomo.jpg'
   }, {
    name: "DOCOMO",
    src: 'img/docomo.jpg'
   }, {
    name: "RECHARGE VIDEOCON",
    src: 'img/videocon.jpg'
   }, {
    name: "RECHARGE VIDEOCON-SPL",
    src: 'img/videocon.jpg'
   }, {
    name: "RELIANCE-GSM",
    src: 'img/relianc.jpg'
   }, {
    name: "RELIANCE-CDMA",
    src: 'img/relianc.jpg'
   }, {
    name: "Idea",
    src: 'img/idea.jpg'
   }, {
    name: "VIRGIN-CDMA",
    src: 'img/docomo.jpg'
   }, {
    name: "TATA INDICOM",
    src: 'img/tataInd.jpg'
   }, {
    name: "MTS",
    src: 'img/mts.jpg'
   }, {
    name: "JIO",
    src: 'img/jio.jpg'
   }, {
    name: "UNINOR",
    src: 'img/uninor.jpg'
   }, {
    name: "UNINOR-SPL",
    src: 'img/uninor.jpg'
   }, {
    name: "BSNL-3G",
    src: 'img/bsnl.jpg'
   }, {
    name: "BSNL-STV",
    src: 'img/bsnl.jpg'
   }, {
    name: "DOCOME-SPECIAL",
    src: 'img/docomo.jpg'
   }, {
    name: "LOOP MOBILE",
    src: 'img/loop.jpg'
   }, {
    name: "BSNL Recharge",
    src: 'img/bsnl.jpg'
   }, {
    name: "MTNL-Recharge",
    src: 'img/img.jpg'
   }, {
    name: "MTNL-TOPUP",
    src: 'img/img.jpg'
   }, {
    name: "Tata Walky",
    src: 'img/tataWalky.jpg'
   },

  ]
  $scope.dthRecharge = [{
   name: 'Dish TV DTH',
   src: 'img/dish.png'
  }, {
   name: 'Tata Sky DTH',
   src: 'img/sky.png'
  }, {
   name: 'Big TV DTH',
   src: 'img/bigTV.jpg'
  }, {
   name: 'Videocon DTH',
   src: 'img/videcon.png'
  }, {
   name: 'Sun DTH',
   src: 'img/sun.png'
  }, {
   name: 'Airtel DTH',
   src: 'img/airtelDTH.png'
  }]
  $scope.postPaidRecharge = [{
   name: 'POSTPAID AIRTEL',
   src: 'img/airtel.jpg'
  }, {
   name: 'POSTPAID IDEA',
   src: 'img/idea.jpg'
  }, {
   name: 'POSTPAID VODAFONE',
   src: 'img/vodafone.jpg'
  }, {
   name: 'POSTPAID BSN',
   src: 'img/bsnl.jpg'
  }, {
   name: 'POSTPAID DOCOMO',
   src: 'img/docomo.jpg'
  }, {
   name: 'POSTPAID RELICE CDMA/GSM',
   src: 'img/relianc.jpg'
  }]
  $scope.mobilRecg = function(rechargeType, mobilename, id) {
   console.log(rechargeType)
   console.log(mobilename)
   $rootScope.recharge.type = rechargeType;
   $rootScope.recharge.name = mobilename;
   $rootScope.recharge.id = id;
   $state.go('recharge')
  }
  $scope.rechargeSubmit = function(recharge) {
   $scope.rechargeDetails = {};
   console.log(recharge.number);
   console.log(recharge.amount);
   $scope.rechargeDetails['RetailerId'] = authentication.currentUser().userId;
   $scope.rechargeDetails['RechargeType'] = $rootScope.recharge.type;
   $scope.rechargeDetails['Company'] = $rootScope.recharge.name;
   $scope.rechargeDetails['OperatorCode'] = $rootScope.recharge.id;
   $scope.rechargeDetails['RechargeAmount'] = recharge.amount;
   $scope.rechargeDetails['CustomerName'] = recharge.Cusname;
   $scope.rechargeDetails['MobileNo'] = recharge.number;
   var promise = serviceDB.toServer($scope.rechargeDetails, "/recharge");
   promise.then(function(res) {
    console.log('recharge entered')
    console.log(res);

    //	var promise = serviceDB.toServer(details, "/recharge");
   }, function(res) {
    console.log(res);
   })

  }
 })