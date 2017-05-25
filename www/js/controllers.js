

angular.module('starter.controllers', [])
.controller('loginCtrl' ,function($scope,$state,serviceDB, $rootScope,$location ,$cordovaToast){
    var login={}
     var options = { dimBackground: true };
  SpinnerPlugin.activityStart("loading...", options);

    $rootScope.userNam='';
    $scope.password='';

$scope.login=function(usn){
    login.Uname=$rootScope.userName=usn;
    login.Pwd=$scope.password;
   console.log($rootScope.userName);
   if($rootScope.userName==undefined||$rootScope.userName==""){
   $cordovaToast.show('Failed to login', 'long', 'center')
     return false;
   }
   if($scope.password==undefined||$scope.password==""){
   	   $cordovaToast.show('Failed to login', 'long', 'center')
     return false;
   }
 

 /* if($scope.userName==100637 && $scope.password==88848){
       $state.go('mDelear');
   }else if($scope.userName==2005 && $scope.password==88848){
       $state.go('delear');
   }else{
       $state.go('retailer');
   }
}*/
	 var promise = serviceDB.login(login, '/loginValidate');       
       promise.then(function(res) {
         console.log(res.data);
				SpinnerPlugin.activityStop();
 
		     if(res.data.done) {
					
				   if(login.Uname > 1000 && login.Uname <1000000) { 
				 $scope.password = document.getElementById("pwd").value='';
					 $location.path('/mDelear');
           } else if(login.Uname > 1000000 && login.Uname < 2000000) { 
           $scope.password = document.getElementById("pwd").value='';
							 $location.path('/delear');
           } else if(login.Uname > 2000000) { 
           $scope.password = document.getElementById("pwd").value='';
							 $location.path('/retailer');
           
		     } else {
                  $cordovaToast.show('Failed to login', 'long', 'center')
                  return false;
			     //  $scope.loginErrMsg = res.data.message;
		     }
	     }}, function(res) {
            // console.log(res);
                 SpinnerPlugin.activityStop();
		        $cordovaToast.show('Failed to login', 'long', 'center')
                  return false; 
	     });


}
}) 
.controller('masterDelearCtrl' ,function($scope,$state,serviceDB,$rootScope,$cordovaToast){
$scope.masterDelear=[];

$scope.home=true;
console.log('I am in master delear')
var id = $rootScope.userName
		var tName = "MasterDealer";
		var promise = serviceDB.toServer({"Id":id, "TName":tName}, '/getBalanceAmount'); 
		     
        promise.then(function(res) {
          console.log(res);
		  $scope.balanceAmount = res.data.data[0].Balance;
		  $scope.curUser = res.data.data[0];
		  console.log($scope.balanceAmount);
		  
	   }, function(res) {
          console.log(res);
	   });	
$scope.masterDelear=
[
{name:"Current Balance",clas:'icon ionIcon ion-cash'},
{name:"Complain",clas:'icon ionIcon ion-ios-email'},
{name:"Complain List",clas:'icon ionIcon ion-ios-email'},
{name:"Change Password",clas:'icon ionIcon ion-key'},
{name:"Reports",clas:'icon ionIcon ion-document-text'},
{name:"Add Balance"},
{name:"Revert Balance"},

]
$scope.master=function(delear){
$scope.home=false;
    console.log(delear);
    if(delear.name=='Current Balance'){
    	
        $state.go('mCurrentBalance')
    }else if(delear.name=='Complain'){
        $state.go('mDelear.complain')
    }else if(delear.name=='Complain List'){
        $state.go('login')
    }else if(delear.name=='Change Password'){
    	$scope.pages='changePassword'
    	$state.go('mchangePassword')
    }
    else if(delear.name=='Reports'){
        $state.go('report')
    }else if(delear.name=='Add Balance'){
        $state.go('addBalance')
    }else if(delear.name=='Revert Balance'){
        $state.go('revertBalance')
    }
}


		

	
$scope.changePassword = function(newpwd) {
	console.log(newpwd)
	console.log('I am in master deler change password')
	if(newpwd==undefined||newpwd.newpassword==undefined || newpwd.newpassword==""){
			 $cordovaToast.show('Enter New Password', 'long', 'center')
         return false
	}
	if( newpwd==undefined||newpwd.cnewpassword==undefined || newpwd.cnewpassword==""){
			 $cordovaToast.show('Enter Confirm Password', 'long', 'center')
			 return false
	}
		if(newpwd.newpassword != newpwd.cnewpassword) {
			 console.log("password does not match");
			 $cordovaToast.show('New password does not match confirm password', 'long', 'center')
			 return false;
		}
		newpwd["Id"] =$rootScope.userName;
		newpwd["tName"] = "MasterDealer";
		var promise = serviceDB.toServer(newpwd, '/changePassword');       
        promise.then(function(res) {
		  if(res.data.done) {
            $scope.newpwd = {};
            $cordovaToast.show('Changed Password Successfully', 'long', 'center')
		  }else{
		  	 $cordovaToast.show('invalid old password', 'long', 'center')
		  }
          console.log(res);
	   }, function(res) {
            $cordovaToast.show('Unable to change password', 'long', 'center')
	   });	
	}

})
.controller('reportCtrl',function($scope,$state){
    $scope.reports=[];
    $scope.reports=[
     {name:'Recharge Report',clss:'icon ionIcon ion-document-text'},{name:'Refund Report',clss:'icon ionIcon ion-document-text'},
     {name:'Topup History',clss:'icon ionIcon ion-document-text'},{name:'Account Report',clss:'icon ionIcon ion-document-text'}
    ]
    $scope.repo=function(report){
      if(report.name=='Recharge Report'){
          $state.go('rechargeReport')
      }else if(report.name=='Refund Report'){
          $state.go('rechargeReport')
      }else if(report.name=='Topup History'){
          $state.go('rechargeReport')
      }else {
          $state.go('rechargeReport')
      }
    }

})
.controller('delearCtrl',function($scope,$state,$rootScope,serviceDB,$cordovaToast){
	var id = $rootScope.userName
		var tName = "Dealer";
		var promise = serviceDB.toServer({"Id":id, "TName":tName}, '/getBalanceAmount'); 
		     
        promise.then(function(res) {
          console.log(res);
		  $scope.balanceAmount = res.data.data[0].Balance;
		  $scope.curUser = res.data.data[0];
		  console.log($scope.balanceAmount);
		  
	   }, function(res) {
          console.log(res);
	   });
    $scope.delear=
[
{name:"Current Balance",clas:'icon ionIcon ion-cash'},
{name:"Complain",clas:'icon ionIcon ion-ios-email'},
{name:"Complain List",clas:'icon ionIcon ion-ios-email'},
{name:"Change Password",clas:'icon ionIcon ion-key'},
{name:"Reports",clas:'icon ionIcon ion-document-text'},
{name:"Add Balance"},
{name:"Revert Balance"},
{name:"Add Retailer"}
]
$scope.delr=function(delear){
    console.log(delear);
    if(delear.name=='Current Balance'){
        $state.go('dCurrentBalance')
    }else if(delear.name=='Complain'){
        $state.go('complain')
    }else if(delear.name=='Complain List'){
        $state.go('login')
    }else if(delear.name=='Change Password'){
         $state.go('dChangePassword')
    }
    else if(delear.name=='Reports'){
        $state.go('report')
    }else if(delear.name=='Add Balance'){
        $state.go('addBalance')
    }else if(delear.name=='Revert Balance'){
        $state.go('revertBalance')
    }else if(delear.name=='Add Retailer'){
        $state.go('addRetailer')
    }
}
$scope.changePassword = function(newpwd) {
	console.log(newpwd)
	console.log('I am in deler change password')
	if(newpwd==undefined||newpwd.newpassword==undefined || newpwd.newpassword==""){
			 $cordovaToast.show('Enter New Password', 'long', 'center')
         return false
	}
	if( newpwd==undefined||newpwd.cnewpassword==undefined || newpwd.cnewpassword==""){
			 $cordovaToast.show('Enter Confirm Password', 'long', 'center')
			 return false
	}
		if(newpwd.newpassword != newpwd.cnewpassword) {
			 console.log("password does not match");
			 $cordovaToast.show('New password does not match confirm password', 'long', 'center')
			 return false;
		}
		if(newpwd.newpassword != newpwd.cnewpassword) {
			 console.log("password does not match");
             $scope.pwdChangeMsg = "password does not match";
			 return;
		}
		newpwd["Id"] = $rootScope.userName;
		newpwd["tName"] = "Dealer";
		var promise = serviceDB.toServer(newpwd, '/changePassword');       
        promise.then(function(res) {
		  if(res.data.done) {
            $scope.newpwd = {};
            $cordovaToast.show('Changed Password Successfully', 'long', 'center')
		  }else{
		  	 $cordovaToast.show('invalid old password', 'long', 'center')

		  }
		   	
          console.log(res);
	   }, function(res) {
          $cordovaToast.show('Unable to change password', 'long', 'center')
	   });	
	}
})
.controller('retailerCtrl',function($scope,$state,serviceDB,$rootScope,$cordovaToast){
	$rootScope.recharge={};
		var id = $rootScope.userName
		var tName = "Retailer";
		var promise = serviceDB.toServer({"Id":id, "TName":tName}, '/getBalanceAmount'); 
		     
        promise.then(function(res) {
          console.log(res);
		  $scope.balanceAmount = res.data.data[0].Balance;
		  $scope.curUser = res.data.data[0];
		  console.log($scope.balanceAmount);
		  
	   }, function(res) {
          console.log(res);
	   });
    $scope.retailer=
[
{name:"Mobile Recharge",clas:'icon ionIcon ion-android-phone-portrait'},
{name:"DTH Recharge",clas:'icon ionIcon ion-easel'},
{name:"Postpaid Recharge",clas:'icon ionIcon ion-android-phone-portrait'},
{name:"Recharge Transaction",clas:'icon ionIcon ion-document-text'},
{name:"Search Transaction",clas:'icon ionIcon ion-document-text'},
{name:"Current Balance",clas:'icon ionIcon ion-cash'},
{name:"Complain",clas:'icon ionIcon ion-ios-email'},
{name:"Complain List",clas:'icon ionIcon ion-ios-email'},
{name:"Change Password",clas:'icon ionIcon ion-key'},
{name:"Reports",clas:'icon ionIcon ion-document-text'}
]
$scope.retlr=function(ret){
    

if(ret.name=='Mobile Recharge'){
    $state.go('mobileRecharge')
}else if(ret.name=='DTH Recharge'){
    $state.go('dthRecharge')
}else if(ret.name=='Postpaid Recharge'){
    $state.go('postPaidRecharge')
} else if(ret.name=='Recharge Transaction'){
   $state.go('login');
}else if(ret.name=='Search Transaction'){
    $state.go('searchTransaction');
} else if(ret.name=='Current Balance'){
        $state.go('rCurrentBalance')
    }else if(ret.name=='Complain'){
        $state.go('complain')
    }else if(ret.name=='Complain List'){
        $state.go('login')
    }else if(ret.name=='Change Password'){
         $state.go('rChangePassword')
    }
    else if(ret.name=='Reports'){
        $state.go('report')
    }
}
$scope.changePassword = function(newpwd) {
	console.log('I am in Retailer change password')
	if(newpwd==undefined||newpwd.newpassword==undefined || newpwd.newpassword==""){
			 $cordovaToast.show('Enter New Password', 'long', 'center')
         return false
	}
	if( newpwd==undefined||newpwd.cnewpassword==undefined || newpwd.cnewpassword==""){
			 $cordovaToast.show('Enter Confirm Password', 'long', 'center')
			 return false
	}
		if(newpwd.newpassword != newpwd.cnewpassword) {
			 console.log("password does not match");
			 $cordovaToast.show('New password does not match confirm password', 'long', 'center')
			 return false;
		}
		if(newpwd.newpassword != newpwd.cnewpassword) {
			 console.log("password does not match");
             $scope.pwdChangeMsg = "password does not match";
			 return;
		}
		if(newpwd.newpassword != newpwd.cnewpassword) {
			 console.log("password does not match");
             $scope.pwdChangeMsg = "password does not match";
			 return;
		}
		newpwd["Id"] = $rootScope.userName;
		newpwd["tName"] = "Retailer";
		var promise = serviceDB.toServer(newpwd, '/changePassword');       
        promise.then(function(res) {
		  if(res.data.done) {
           $scope.newpwd = {};
            $cordovaToast.show('Changed Password Successfully', 'long', 'center')
		  }else{
		   	 $cordovaToast.show('invalid old password', 'long', 'center')

		  }
		  
          console.log(res);
	   }, function(res) {
         $cordovaToast.show('Unable to change password', 'long', 'center')
	   });	
	}
})
.controller('retailerHomeCtrl',function($scope,$state,$rootScope){

      $scope.mobileRecharge=
[
{name:"Airtel",src:'img/airtel.jpg'},
{name:"Vodafone",src:'img/vodafone.jpg'},
{name:"Aircel",src:'img/aircel.jpg'},
{name:"BSNL-TOPUP",src:'img/bsnl.jpg'},
{name:"VIRGIN-GSM",src:'img/docomo.jpg'},
{name:"DOCOMO",src:'img/docomo.jpg'},
{name:"RECHARGE VIDEOCON",src:'img/videocon.jpg'},
{name:"RECHARGE VIDEOCON-SPL",src:'img/videocon.jpg'},
{name:"RELIANCE-GSM",src:'img/relianc.jpg'},
{name:"RELIANCE-CDMA",src:'img/relianc.jpg'},
{name:"Idea",src:'img/idea.jpg'},
{name:"VIRGIN-CDMA",src:'img/docomo.jpg'},
{name:"TATA INDICOM",src:'img/tataInd.jpg'},
{name:"MTS",src:'img/mts.jpg'},
{name:"JIO",src:'img/jio.jpg'},
{name:"UNINOR",src:'img/uninor.jpg'},
{name:"UNINOR-SPL",src:'img/uninor.jpg'},
{name:"BSNL-3G",src:'img/bsnl.jpg'},
{name:"BSNL-STV",src:'img/bsnl.jpg'},
{name:"DOCOME-SPECIAL",src:'img/docomo.jpg'},
{name:"LOOP MOBILE",src:'img/loop.jpg'},
{name:"BSNL Recharge",src:'img/bsnl.jpg'},
{name:"MTNL-Recharge",src:'img/img.jpg'},
{name:"MTNL-TOPUP",src:'img/img.jpg'},
{name:"Tata Walky",src:'img/tataWalky.jpg'},

]
$scope.dthRecharge=[
{name:'Dish TV DTH',src:'img/dish.png'},
{name:'Tata Sky DTH',src:'img/sky.png'},
{name:'Big TV DTH',src:'img/bigTV.jpg'},
{name:'Videocon DTH',src:'img/videcon.png'},
{name:'Sun DTH',src:'img/sun.png'},
{name:'Airtel DTH',src:'img/airtelDTH.png'}
]
$scope.postPaidRecharge=[
{name:'POSTPAID AIRTEL',src:'img/airtel.jpg'},
{name:'POSTPAID IDEA',src:'img/idea.jpg'},
{name:'POSTPAID VODAFONE',src:'img/vodafone.jpg'},
{name:'POSTPAID BSN',src:'img/bsnl.jpg'},
{name:'POSTPAID DOCOMO',src:'img/docomo.jpg'},
{name:'POSTPAID RELICE CDMA/GSM',src:'img/relianc.jpg'}
]
$scope.mobilRecg=function(rechargeType,mobilename){
	console.log(rechargeType)
	console.log(mobilename)
	$rootScope.recharge.type=rechargeType;
	$rootScope.recharge.name=mobilename;
    $state.go('recharge')
}
})