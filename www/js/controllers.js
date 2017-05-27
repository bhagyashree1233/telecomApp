




angular.module('starter.controllers', [])
.controller('loginCtrl' ,function($scope,$state,serviceDB, $rootScope,$location ){
    var login={}
     var options = { dimBackground: true };
  

    $rootScope.userNam='';
    $scope.password='';

$scope.login=function(usn){
	//$cordovaSpinnerDialog.show("Login","Loading", true);
	$rootScope.showDbLoading();
    login.Uname=$rootScope.userName=usn;
    login.Pwd=$scope.password;
   console.log($rootScope.userName);
   if($rootScope.userName==undefined||$rootScope.userName==""){
   	$rootScope.ShowToast('Failed to login')
   
     return false;
   }
   if($scope.password==undefined||$scope.password==""){
   	   $rootScope.ShowToast('Failed to login')
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
				//$cordovaSpinnerDialog.hide();
               $rootScope.hideDbLoading()
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
                  $rootScope.ShowToast('Failed to login')
                  return false;
			     //  $scope.loginErrMsg = res.data.message;
		     }
	     }}, function(res) {
            // console.log(res);
              //   $cordovaSpinnerDialog.hide();
              $rootScope.hideDbLoading();
		       $rootScope.ShowToast('Failed to login')
                  return false; 
	     });


}
}) 
.controller('masterDelearCtrl' ,function($scope,$state,serviceDB,$rootScope,$interval,authentication){
$scope.masterDelear=[];
$scope.balanceAmount='';
$scope.home=true;
$scope.CurrenBalance=''
//authentication.currentUser().userId;

console.log('I am in master delear')


$scope.getBalance=function(){
       //    
var id =authentication.currentUser().userId;
		var tName ='MasterDealer';
		var promise = serviceDB.toServer({"Id":id, "TName":tName}, '/getBalanceAmount'); 
		     
        promise.then(function(res) {
		 $scope.CurrenBalance=res.data.data[0].Balance
	   }, function(res) {
        
	   }
	   );
	   
	   }

$scope.getDelearBalance=function(userId,tName){
       //    
var id =userId;
		var tName =tName;
		var promise = serviceDB.toServer({"Id":id, "TName":tName}, '/getBalanceAmount'); 
		     
        promise.then(function(res) {
		 $scope.CurrenDelBalance=res.data.data[0].Balance
	   }, function(res) {
       
	   }
	   );
	   
	   }
 $scope.getRetailerBalance=function(userId,tName){
       //    
var id =authentication.currentUser().userId;
		var tName ='MasterDealer';
		var promise = serviceDB.toServer({"Id":id, "TName":tName}, '/getBalanceAmount'); 
		     
        promise.then(function(res) {
		  $scope.RetailerBalance=res.data.data[0].Balance
	   }, function(res) {
        $scope.CurrenRetailerBalance=res.data.data[0].Balance
	   }
	   );
	   
	   }
$scope.getBalance();
	  

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
        $state.go('mAddBalance')
    }else if(delear.name=='Revert Balance'){
        $state.go('revertBalance')
    }
}


		
$scope.start= function(){$interval(function() {
  window.location.reload(true);
          }, 5000);
        
}

	$scope.transferMoney = function(transferDetails) {
		$scope.transferDetails={};
		$scope.getDelearBalance(transferDetails.userId,'Delear');
        $scope.transferDetails["SenderId"] =transferDetails.userId;
        //Current User ID
        //Current user Id Balance
        //Other person Balance
  $scope.transferDetails.Amount=transferDetails.amount;
		if(Number($scope.transferDetails.Amount) < 1 ) {
            console.log('Enter valid amount to transfer');
			$scope.transferMoneyErr = "Enter valid amount to transfer";
			return;
		}					               
		if((Number( $scope.CurrenBalance) - Number($scope.transferDetails.Amount)) < 0)
		{                                  
			console.log('Insufficient balance');
			$scope.transferMoneyErr = "Insufficient balance";
			return;                         
		}                                   
      $scope.transferDetails.RecieverBalance=$scope.CurrenDelBalance;
      console.log($scope.CurrenDelBalance);
        console.log($scope.transferDetails.RecieverBalance+'Delear Balance');
        var tempVar = Number($scope.transferDetails.RecieverBalance)+Number($scope.transferDetails.Amount);
        var promise = serviceDB.toServer({"Id":$scope.transferDetails.RecieverId, "TName":$scope.transferDetails.RecieverTName, "Balance":tempVar}, '/updateBalanceAmount'); 	     
        promise.then(function(res) {
          console.log(res.message);
		  $scope.balanceAmount = Number($scope.balanceAmount) - Number($scope.transferDetails.Amount);
		  $scope.updateBalance($scope.balanceAmount); 
          $scope.transferDetails["Balance"] = Number($scope.balanceAmount);
		  updateMoneyTransfer($scope.transferDetails);
	    }, function(res) {
          console.log(res);
	    });	 
		                    
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
.controller('delearCtrl',function($interval ,$scope,$state,$rootScope,serviceDB,$cordovaToast,authentication,$filter){

	var id =authentication.currentUser().userId;
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

		$scope.getMasterIdByDId = function() {
		var did = authentication.currentUser().userId;
	   var promise = serviceDB.toServer({"Dealerid":did}, '/getMIdByDId');        
       promise.then(function(res) {
	      //console.log("success");
          console.log(res.data.data);
		  if(res.data.data != "failure") {
            $rootScope. ParentMasterDealerId = res.data.data[0].ParentMasterDealerId;
		  }
		 
	   }, function(res) {
          console.log(res);
	   });
	}

	$scope.getListOfScheme = function(sType) {
	   var promise = serviceDB.toServer({Type:sType}, '/getScheme');       
       promise.then(function(res) {
		  console.log("success");
          console.log(res);
		  $scope.schemeList = res.data.data;
		  console.log($scope.schemeList)
	   }, function(res) {
          console.log(res);
	   });
	}
	$scope.start= function(){$interval(function() {
  window.location.reload(true);
          }, 5000);
        
}
$scope.getListOfRetailerType = function() {
	   var promise = serviceDB.toServer({}, '/getRetailerType');       
       promise.then(function(res) {
		  console.log("success");
          console.log(res);

		  if(res.data.data != "failure") { 
		    $scope.retailerTypeList = res.data.data;
		  }
	   }, function(res) {
          console.log(res);
	   });
	}
		$scope.getListOfRetailerType();
		$scope.getListOfScheme('retailer');
		$scope.getMasterIdByDId();
		 $rootScope.statelist = ["Karnataka","Andra Pradesh","Kerala", "TamilNadu"];

    var citylist = [
        {"city":"Bangalore", "state": "Karnataka"},
        {"city":"Mysore", "state": "Karnataka"},
        {"city":"Raichur", "state": "Karnataka"},
        {"city":"Tumkur", "state": "Karnataka"},
        {"city":"Shivamoga", "state": "Karnataka"},
        {"city":"Davanagere", "state": "Karnataka"},
        {"city":"Belagavi", "state": "Karnataka"},
        {"city":"Hyderabad", "state": "Andra Pradesh"},
        {"city":"Tirupathi", "state": "Andra Pradesh"},
        {"city":"Trivendrum", "state": "Kerala"},
        {"city":"Kochi", "state": "Kerala"},
        {"city":"Chennai", "state": "TamilNadu"}
    ]; 
 
     $rootScope.loadCities = function(selState) {
         console.log(selState);
        $rootScope.cities = ($filter('filter')(citylist, {state: selState}));  
     }
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
        $state.go('dAddRetailer')
    }else if(delear.name=='Revert Balance'){
        $state.go('revertBalance')
    }else if(delear.name=='Add Retailer'){
        $state.go('dAddRetailer')
    }
}

$scope.addNewRetailer = function(retailer) {
		//retailer["LoginStatus"] = "success";
		console.log(authentication.currentUser().userId)
		console.log(retailer)
		console.log($scope.getMasterIdByDId());
		retailer["LoginStatus"] = "success";
		retailer["ParentDealerId"] =authentication.currentUser().userId;
		retailer["ParentMasterDealerId"] = $rootScope. ParentMasterDealerId 
		//retailer["parentDealerId"] = 1;
		console.log(retailer);

		if(retailer.Name == "" || retailer.Name == undefined) {
            console.log('name required'); 
			$scope.retailerAddErrMsg = 'name required';
			return;
		}
		if(retailer.Address == "" || retailer.Address == undefined) {
			console.log('address required'); 
			$scope.retailerAddErrMsg = 'address required';
			return;
		}
		
		if(retailer.State == "" || retailer.State == undefined) {
			console.log('select your state'); 
			$scope.retailerAddErrMsg = 'select your state';
			return;
		}
		if(retailer.Mobile == "" || retailer.Mobile == undefined) {
			console.log('Mobile number required'); 
			$scope.retailerAddErrMsg = 'Mobile number required';
			return;
		}else if
		(Number.isNaN(retailer.Mobile) || retailer.Mobile.length < 10 || retailer.Mobile.length > 10) {
			console.log('Enter valid mobile number'); 
			$scope.retailerAddErrMsg = 'Enter valid mobile number';
			return;
		}
		if(retailer.RetailerType == "" || retailer.RetailerType == undefined) {
			console.log('select retailer type'); 
			$scope.retailerAddErrMsg = 'select retailer type';
			return;
		}
		if(retailer.PanNo == undefined) {
			retailer.PanNo = "";
		}
		if(retailer.PinCode == "" || retailer.PinCode == undefined) {
			console.log('Pin Code required'); 
			$scope.retailerAddErrMsg = 'Pin Code required';
			return;
		}
		
		if(retailer.ParentDealerId == "" || retailer.ParentDealerId == undefined) {
			console.log('select parent dealer'); 
			$scope.retailerAddErrMsg = 'select parent dealer';
			return;
		}
		if(Number.isNaN(retailer.PinCode)) {
			console.log('Enter valid pin code'); 
			$scope.retailerAddErrMsg = 'Enter valid pin code';
			return;
		}
		if(retailer.City == "" || retailer.City == undefined) {
			console.log('select city'); 
			$scope.dealerAddErrMsg = 'selectc city';
			return;
		}
		if(retailer.LandLine == undefined) {
			retailer.LandLine = "";
		}else
		if(retailer.LandLine != "" && Number.isNaN(retailer.LandLine)) {
			console.log('Enter valid landline number'); 
			$scope.dealerAddErrMsg = 'Enter valid landline number';
			return;
		}
		if(retailer.EmailId == "" || retailer.EmailId == undefined) {
			console.log('email required'); 
			$scope.retailerAddErrMsg = 'email required';
			return;
		}
		if(retailer.ContactPerson == "" || retailer.ContactPerson == undefined) {
			console.log('contact person required'); 
			$scope.retailerAddErrMsg = 'contact person required';
			return;
		}
		if(retailer.Scheme == "" || retailer.Scheme == undefined) {
			console.log('select scheme'); 
			$scope.dealerAddErrMsg = 'select scheme';
			return;
		}
		
		if(retailer.Balance == "" || retailer.Balance == undefined) {
			retailer.Balance = 0;
		}
		if(retailer.Balance != 0 && Number.isNaN(retailer.Balance)) {
			$scope.retailerAddErrMsg = 'Enter valid balance';
			return;
		}
		

        
           //  var promise = serviceDB.toServer(retailer, 'http://telecom.azurewebsites.net/addRetailer');       
	       var promise = serviceDB.toServer(retailer, '/addRetailer');       
		

          promise.then(function(res) {
		  console.log("success");
		  
          console.log(res);
	   }, function(res) {
          console.log(res);
		  
	   });
	   		
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
.controller('retailerCtrl',function($scope,$state,serviceDB,$rootScope,$cordovaToast,authentication){
	var id =authentication.currentUser().userId;
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