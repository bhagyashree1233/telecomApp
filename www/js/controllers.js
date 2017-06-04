angular.module('starter.controllers', [])
    .controller('loginCtrl', function($scope, $state, serviceDB, $rootScope, $location, $ionicHistory) {
        $scope.login = {}
        $scope.loginSub = function(usn) {
            console.log($scope.login.Uname);
            if ($scope.login.Uname == undefined || $scope.login.Uname == "") {
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
              $rootScope.hideDbLoading()
                console.log(res.data);

                

                if (res.data.done == true) {
                    if ($scope.login.Uname > 1000 && $scope.login.Uname < 5000000) {
                        $location.path('/mDelear');
                    } else if ($scope.login.Uname > 5000000 && $scope.login.Uname < 10000000) {
                        $scope.password = document.getElementById("pwd").value = '';
                        $location.path('/delear');
                    } else if ($scope.login.Uname > 10000000) {
                        $scope.password = document.getElementById("pwd").value = '';
                        $location.path('/retailer');

                    } else {
                      $rootScope.hideDbLoading()
                        console.log('Hello');
                        $rootScope.ShowToast('Failed to login')
                        return false;
                    }
                } else {
                  $rootScope.hideDbLoading()
                    $rootScope.ShowToast('unable to login')
                }
            }, function(res) {
                $rootScope.hideDbLoading();
                $rootScope.ShowToast('Failed to login')
                return false;
            });


        }
        $scope.goBack = function() {
            $ionicHistory.goBack();
        }
    })
    .controller('masterDelearCtrl', function($scope, $filter, $state, serviceDB, $rootScope, $interval, authentication) {
        $scope.masterDelear = [];
        $scope.CurrenBalance = '';
        $scope.newpwd = {};
        $scope.transferDetails = {};
        $scope.curreBalMode = false;
        $scope.reports = [];
        $scope.compalin={};
        $scope.complainList=[];
        var cancel = ''
        $scope.curid = authentication.currentUser().userId;
        var type = '';
        console.log('I am in master delear')
        $scope.getBalance = function() {
            var tName = 'MasterDealer';
            var promise = serviceDB.toServer({
                "Id": $scope.curid,
                "TName": tName
            }, '/getBalanceAmount');
            promise.then(function(res) {
                console.log(res.data.data.length);
                if (res.data.data.length > 0) {
                    $scope.CurrenBalance = res.data.data[0].Balance
                } else {
                    $rootScope.ShowToast('No Balance Found');
                }
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
                $state.go('mComplain')
            } else if (delear.name == 'Complain List') {
                $state.go('mComplainList')
            } else if (delear.name == 'Change Password') {
                $scope.pages = 'changePassword'
                $state.go('mchangePassword')
            } else if (delear.name == 'Reports') {
                $state.go('mReports')
            } else if (delear.name == 'Add Balance') {
                $state.go('mAddBalance')
            } else if (delear.name == 'Revert Balance') {
                $state.go('revertBalance')
            }
        }

        $scope.start = function() {
            $interval(function() {
                // window.location.reload();
                $scope.getBalance();
            }, 5000);

        }

        $scope.transferMoney = function() {

            $scope.transferDetails["SenderId"] = $scope.curid;
            $scope.transferDetails["CurSenderBalance"] = $scope.CurrenBalance;

            if (Number($scope.transferDetails.Amount < 1)) {
                $rootScope.ShowToast('Invalid Amount');
                return;
            }
            if ((Number($scope.CurrenBalance) - Number($scope.transferDetails.Amount)) < 0) {
                $rootScope.ShowToast('Invalid Amount');
                return;
            }
            if ($scope.transferDetails.RecieverId > 5000000 && $scope.transferDetails.RecieverId < 10000000) {
                type = 'Dealer';
            } else if ($scope.transferDetails.RecieverId > 10000000) {
                type = 'Retailer';
            } else {
                $rootScope.ShowToast('Invalid id');
            }
            var promise = serviceDB.toServer({
                "Id": $scope.transferDetails.RecieverId,
                "TName": type
            }, '/getBalanceAmount');
            //get Balance
            promise.then(function(res) {

                if (res.data.data[0] != undefined) {
                    $scope.CurrenDelBalance = res.data.data[0].Balance;
                    $scope.transferDetails.RecieverBalance = $scope.CurrenDelBalance;
                    console.log($scope.CurrenDelBalance);
                    console.log($scope.transferDetails.RecieverBalance + 'Delear Balance');
                    //add balence
                    var promise = serviceDB.toServer($scope.transferDetails, '/addMoneyTransferDetails');
                    $rootScope.showDbLoading();
                    promise.then(function(res) {
                        $rootScope.hideDbLoading();
                        console.log(res);
                        $scope.transferDetails = {}
                        $rootScope.ShowToast('add balace success');
                    }, function(res) {
                        console.log(res);
                        $rootScope.hideDbLoading();
                        $scope.transferDetails = {}
                        $rootScope.ShowToast('Unable to add balace');
                    });
                } else {
                    $rootScope.hideDbLoading();
                    $rootScope.ShowToast('Invalid id');
                }

            }, function(res) {
                console.log(res);

                $rootScope.hideDbLoading();

                $rootScope.ShowToast('Unable to get balace');
            });
        }
        $scope.complaint=function(){
                
        }
        var oneMonth=12*24*60*60*1000;
        $scope.accountReport = function(accouReport) {
            $scope.transferDetails["SenderId"] = $scope.curid;
            var tempReport = accouReport;
            tempReport["Id"] = $scope.curid;
            tempReport.From=new Date(tempReport.From);
            tempReport.From.setHours(0);
            tempReport.From.setMinutes(0);
            tempReport.From.setSeconds(0);
            tempReport.From.setMilliseconds(0);
            tempReport.From.setDate(tempReport.From.getDate());
            tempReport.FromDate = $filter('date')(tempReport.From,
             "y-MM-d hh:mm:ss")
            tempReport.To = new Date(tempReport.To);
            tempReport.To.setHours(23);
            tempReport.To.setMinutes(59);
            tempReport.To.setSeconds(59);
            tempReport.To.setMilliseconds(999);
          tempReport.To.setDate(tempReport.To.getDate());
            
         var diffDays = Math.round(Math.abs((tempReport.To.getTime() -tempReport.From.getTime() )/(oneMonth)));
            console.log(diffDays);
            if(diffDays>30){
                $rootScope.ShowToast('Plse select within 30 days ');
             return false     
          }
          tempReport.ToDate = $filter('date')(tempReport.To, "y-MM-d hh:mm:ss");
			var promise = serviceDB.toServer(tempReport, '/getAccountReports'); 
        promise.then(function(res) {
          console.log(res);
		  $scope.accountReportList = res.data.data;
    }, function(res) {
          console.log(res);
	    });
		 
	
        }

        $scope.refundReport=function(){
               
        }
         
         $scope.complainList=function(){
           var promise= serviceDB.toServer($scope.curid,'/getComplains');
            promise.then(function(res){
                    console.log(res)
                   $scope.complainList= res.data.data;
            },function(error){}
            )
     }

        $scope.reports = [{
            name: 'Recharge Report',
            clss: 'icon ionIcon ion-document-text'
        }, {
            name: 'Refund Report',
            clss: 'icon ionIcon ion-document-text'
        }, {
            name: 'Account Report',
            clss: 'icon ionIcon ion-document-text'
        }]
        $scope.repo = function(report) {
            if (report.name == 'Recharge Report') {
                $state.go('mRecrechargeReport')
            } else if (report.name == 'Refund Report') {
                $state.go('mRfdrechargeReport')
            } else if (report.name == 'Account Report') {
                $state.go('mAccrechargeReport')
            }
        }

        $scope.changePassword = function() {
            console.log($scope.newpwd)
            console.log('I am in master deler change password')
            if ($scope.newpwd.newpassword == undefined || $scope.newpwd.newpassword == "") {
                $rootScope.ShowToast('Enter New Password')
                return false
            }
            if ($scope.newpwd.cnewpassword == undefined || $scope.newpwd.cnewpassword == "") {
                $rootScope.ShowToast('Enter Confirm Password')
                return false
            }
            if ($scope.newpwd.newpassword != $scope.newpwd.cnewpassword) {
                $rootScope.ShowToast('New password does not match confirm password')
                console.log("password does not match");
                return false;
            }
            $scope.newpwd["Id"] = $scope.curid;
            $scope.newpwd["tName"] = "MasterDealer";
            var promise = serviceDB.toServer($scope.newpwd, '/changePassword');
            $rootScope.showDbLoading();
            promise.then(function(res) {
                if (res.data.done) {
                    $rootScope.hideDbLoading();
                    $rootScope.ShowToast('Changed Password Successfully')

                    $scope.newpwd = {};
                } else {
                    $rootScope.hideDbLoading();
                    $rootScope.ShowToast('invalid old password')

                }
                console.log(res);
            }, function(res) {
                $rootScope.hideDbLoading();
                $rootScope.ShowToast('Unable to change password')

            });
        }
        $scope.goBack = function() {
            console.log('Hai');
            window.history.back();
        }
    })

    .controller('reportCtrl', function($scope, $state) {

        $scope.goBack = function() {
            $ionicHistory.goBack();
        }
    })
    .controller('delearCtrl', function($interval, $scope, $state, $rootScope, serviceDB, $cordovaToast, authentication, $filter) {
        var id = '';
        id = authentication.currentUser().userId;
        var tName = "Dealer";
        $scope.CurrenBalance = '';
        $scope.retailer = {};
        $scope.newpwd = {};
        $scope.transferDetails = {};
        var promise = serviceDB.toServer({
            "Id": id,
            "TName": tName
        }, '/getBalanceAmount');

        promise.then(function(res) {
            if (res.data.data[0] != undefined) {
                $scope.CurrenBalance = res.data.data[0].Balance;
            } else {
                $rootScope.ShowToast('Unable to get balance')

            }

        }, function(res) {
            $rootScope.ShowToast('Unable to get balance')
        });

        $scope.getMasterIdByDId = function() {

            var promise = serviceDB.toServer({
                "Dealerid": id
            }, '/getMIdByDId');
            promise.then(function(res) {
                console.log(res.data.data);
                if (res.data.data.length > 0) {
                    $scope.ParentMasterDealerId = res.data.data[0].ParentMasterDealerId;
                } else {
                    $rootScope.ShowToast('Unable to get Master Id')


                }

            }, function(res) {
                $rootScope.ShowToast('Unable to get Master Id')
            });
        }

        $scope.getListOfScheme = function(sType) {
            var promise = serviceDB.toServer({
                Type: sType
            }, '/getScheme');
            promise.then(function(res) {
                if (res.data.data != undefined) {
                    $scope.schemeList = res.data.data;
                    console.log($scope.schemeList)
                } else {
                    $rootScope.ShowToast('Unable to get Scheme List')

                }
            }, function(res) {
                $rootScope.ShowToast('Unable to get  Scheme List')
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
                } else {
                    $rootScope.ShowToast('Unable to get Retailer type')

                }
            }, function(res) {
                $rootScope.ShowToast('Unable to get Retailer type')

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
                $state.go('mComplainList')
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
            $scope.retailer["SenderId"] = id;
            $scope.retailer["CurSenderBalance"] = $scope.CurrenBalance;
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
            $rootScope.showDbLoading();

            promise.then(function(res) {
                $rootScope.hideDbLoading()
                if (res.data.done) {
                    $rootScope.ShowToast('Added Successfully');
                    $scope.retailer = {};

                } else {
                    $rootScope.ShowToast('Unable to add Retailer');

                }


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
                type = 'Retailer';
            } else {
                $rootScope.ShowToast('Invalid id');
            }
            var promise = serviceDB.toServer({
                "Id": $scope.transferDetails.RecieverId,
                "TName": type
            }, '/getBalanceAmount');
            promise.then(function(res) {
                console.log();
                if (res.data.data[0] != undefined) {
                    $scope.CurrenDelBalance = res.data.data[0].Balance;

                    $scope.transferDetails.RecieverBalance = $scope.CurrenDelBalance;
                    console.log($scope.CurrenDelBalance);
                    console.log($scope.transferDetails.RecieverBalance + 'Delear Balance');

                    var promise = serviceDB.toServer($scope.transferDetails, '/addMoneyTransferDetails');
                    $rootScope.showDbLoading();
                    promise.then(function(res) {
                        if (res.data.done) {
                            $rootScope.hideDbLoading()
                            console.log(res);
                            $scope.transferDetails = {}
                        } else {
                            $rootScope.ShowToast('Unable to add balace');
                        }


                    }, function(res) {
                        $rootScope.hideDbLoading()
                        console.log(res);
                        $rootScope.ShowToast('Unable to add balace');
                    });
                } else {
                    $rootScope.ShowToast('Invalid id');
                }
            });
        }
        $scope.accountReport = function(accouReport) {
            $scope.transferDetails["SenderId"] = id;
            var tempReport = accouReport;
            tempReport["Id"] = id;
            console.log()
            tempReport.FromDate=new Date();
            tempReport.FromDate.setHours(0);
            tempReport.FromDate.setMinutes(0);
            tempReport.FromDate.setSeconds(0);
            tempReport.FromDate.setMilliseconds(0);
            tempReport.FromDate = $filter('date')(tempReport.FromDate,
             "y-MM-d hh:mm:ss")
            

            tempReport.ToDate = new Date();
            tempReport.ToDate.setHours(23);
            tempReport.ToDate.setMinutes(59);
            tempReport.ToDate.setSeconds(59);
            tempReport.ToDate.setMilliseconds(999);
          tempReport.ToDate.setDate(tempReport.ToDate.getDate());
		tempReport.ToDate = $filter('date')(tempReport.ToDate, "y-MM-d hh:mm:ss");
		
		
			var promise = serviceDB.toServer(tempReport, '/getAccountReports'); 
        promise.then(function(res) {
          console.log(res);
		  $scope.accountReportList = res.data.data;
		  
	    }, function(res) {
          console.log(res);
	    });
		 
	
        }
        $scope.changePassword = function() {
            console.log('Hai');
            console.log($scope.newpwd)
            console.log('I am in master deler change password')
            if ($scope.newpwd.newpassword == undefined || $scope.newpwd.newpassword == "") {
                $rootScope.ShowToast('Enter New Password')

                return false
            }
            if ($scope.newpwd.cnewpassword == undefined || $scope.newpwd.cnewpassword == "") {
                $rootScope.ShowToast('Enter Confirm Password')

                return false
            }
            if ($scope.newpwd.newpassword != $scope.newpwd.cnewpassword) {
                console.log("password does not match");
                $rootScope.ShowToast('New password does not match confirm password')

                return false;
            }
            $scope.newpwd["Id"] = id;
            $scope.newpwd["tName"] = "Dealer";
            var promise = serviceDB.toServer($scope.newpwd, '/changePassword');
            $rootScope.showDbLoading();
            promise.then(function(res) {
                $rootScope.hideDbLoading()
                if (res.data.done) {

                    $scope.newpwd = {};
                    $rootScope.ShowToast('Changed Password Successfully')

                } else {
                    $rootScope.ShowToast('invalid old password')


                }
                console.log(res);
            }, function(res) {
                $rootScope.hideDbLoading()
                $rootScope.ShowToast('Unable to change password')

            });
        }
        $scope.goBack = function() {
            window.history.back();
        }
    })
    .controller('retailerCtrl', function($scope, $interval, $state, serviceDB, $rootScope, $cordovaToast, authentication) {
        var id = '';
        var tName = '';

        $scope.newpwd = {};
        id = authentication.currentUser().userId;
        tName = "Retailer";
        $scope.CurrenBalance = '';
        var promise = serviceDB.toServer({
            "Id": id,
            "TName": tName
        }, '/getBalanceAmount');

        promise.then(function(res) {
            console.log(res);
            if (res.data.data != undefined) {
                $scope.CurrenBalance = res.data.data[0].Balance;

            }
        }, function(res) {
            $rootScope.ShowToast('Unable to get balence')

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
        $scope.start = function() {
            $interval(function() {
                window.location.reload(true);
            }, 5000);

        }
        $scope.accountReport = function(accouReport) {
            $scope.transferDetails["SenderId"] = id;
            var tempReport = accouReport;
            tempReport["Id"] = id;
            console.log()
            tempReport.FromDate=new Date();
            tempReport.FromDate.setHours(0);
            tempReport.FromDate.setMinutes(0);
            tempReport.FromDate.setSeconds(0);
            tempReport.FromDate.setMilliseconds(0);
            tempReport.FromDate = $filter('date')(tempReport.FromDate,
             "y-MM-d hh:mm:ss")
            

            tempReport.ToDate = new Date();
            tempReport.ToDate.setHours(23);
            tempReport.ToDate.setMinutes(59);
            tempReport.ToDate.setSeconds(59);
            tempReport.ToDate.setMilliseconds(999);
          tempReport.ToDate.setDate(tempReport.ToDate.getDate());
		tempReport.ToDate = $filter('date')(tempReport.ToDate, "y-MM-d hh:mm:ss");
		
		
			var promise = serviceDB.toServer(tempReport, '/getAccountReports'); 
        promise.then(function(res) {
          console.log(res);
		  $scope.accountReportList = res.data.data;
		  
	    }, function(res) {
          console.log(res);
	    });
		 
	
        }
        $scope.changePassword = function() {
            console.log($scope.newpwd)
            console.log('I am in master deler change password')
            if ($scope.newpwd.newpassword == undefined || $scope.newpwd.newpassword == "") {
                $rootScope.ShowToast('Enter New Password')

                return false
            }
            if ($scope.newpwd.cnewpassword == undefined || $scope.newpwd.cnewpassword == "") {
                $rootScope.ShowToast('Enter Confirm Password')

                return false
            }
            if ($scope.newpwd.newpassword != $scope.newpwd.cnewpassword) {
                console.log("password does not match");
                $rootScope.ShowToast('New password does not match confirm password')

                return false;
            }
            $scope.newpwd["Id"] = id;
            $scope.newpwd["tName"] = "Retailer";
            var promise = serviceDB.toServer($scope.newpwd, '/changePassword');
            $rootScope.showDbLoading();
            promise.then(function(res) {
                $rootScope.hideDbLoading()
                if (res.data.done) {
                    $scope.newpwd = {};
                    $rootScope.ShowToast('Changed Password Successfully')

                } else {
                    $rootScope.ShowToast('invalid old password')
                }
                console.log(res);
            }, function(res) {
                $rootScope.hideDbLoading()
                $rootScope.ShowToast('Unable to change password')
            });
        }
        $scope.goBack = function() {
            window.history.back();
        }
    })
    .controller('retailerHomeCtrl', function($scope, $state, $rootScope, authentication, serviceDB) {
        var id = '';
        var tName = ''
        id = authentication.currentUser().userId;
        tName = 'Retailer';
        $scope.recharge = {};

        $scope.rechargeDetails = {};
        $scope.CurrenBalance = '';
        var promise = serviceDB.toServer({
            "Id": id,
            "TName": tName
        }, '/getBalanceAmount');

        promise.then(function(res) {
            console.log(res);
            if (res.data.data != undefined) {
                $scope.CurrenBalance = res.data.data[0].Balance;

            }
        }, function(res) {
            $cordovaToast.show('Unable to get balence', 'long', 'center')
        });
        $scope.mobileRecharge = [{
                id: "A",
                name: "Airtel",
                src: 'img/airtel.jpg'
            }, {
                id: "V",
                name: "Vodafone",
                src: 'img/vodafone.jpg'
            }, {
                id: "AIR",
                name: "Aircel",
                src: 'img/aircel.jpg'
            }, {
                id: "BT",
                name: "BSNL-TOPUP",
                src: 'img/bsnl.jpg'
            }, {
                id: "D",
                name: "DOCOMO",
                src: 'img/docomo.jpg'
            }, {
                id: "RG",
                name: "RELIANCE-GSM",
                src: 'img/relianc.jpg'
            }, {
                id: "RC",
                name: "RELIANCE-CDMA",
                src: 'img/relianc.jpg'
            }, {
                id: "I",
                name: "Idea",
                src: 'img/idea.jpg'
            }, {
                id: "TI",
                name: "TATA INDICOM",
                src: 'img/tataInd.jpg'
            }, {
                id: "M",
                name: "MTS",
                src: 'img/mts.jpg'
            }, {
                id: "JO",
                name: "JIO",
                src: 'img/jio.jpg'
            }, {
                id: "U",
                name: "UNINOR",
                src: 'img/uninor.jpg'
            }, {
                id: "US",
                name: "UNINOR-SPL",
                src: 'img/uninor.jpg'
            }, {
                id: "BS",
                name: "BSNL-STV",
                src: 'img/bsnl.jpg'
            }, {
                id: "DS",
                name: "DOCOME-SPECIAL",
                src: 'img/docomo.jpg'
            }, {
                id: "TB",
                name: "BSNL Recharge",
                src: 'img/bsnl.jpg'
            },

        ]
        $scope.dthRecharge = [{
            id: "DTV",
            name: 'Dish TV DTH',
            src: 'img/dish.png'
        }, {
            id: "TTV",
            name: 'Tata Sky DTH',
            src: 'img/sky.png'
        }, {
            id: "BTV",
            name: 'Big TV DTH',
            src: 'img/bigTV.jpg'
        }, {
            id: "VTV",
            name: 'Videocon DTH',
            src: 'img/videcon.png'
        }, {
            id: "STV",
            name: 'Sun DTH',
            src: 'img/sun.png'
        }, {
            id: "ATV",
            name: 'Airtel DTH',
            src: 'img/airtelDTH.png'
        }]
        $scope.postPaidRecharge = [{
                id: "PA",
                name: 'POSTPAID AIRTEL',
                src: 'img/airtel.jpg'
            }, {
                id: "PI",
                name: 'POSTPAID IDEA',
                src: 'img/idea.jpg'
            }, {
                id: "PV",
                name: 'POSTPAID VODAFONE',
                src: 'img/vodafone.jpg'
            }, {
                id: "PB",
                name: 'POSTPAID BSN',
                src: 'img/bsnl.jpg'
            }, {
                id: "PD",
                name: 'POSTPAID DOCOMO',
                src: 'img/docomo.jpg'
            }, {
                id: "PR",
                name: "Postpaid Reliance CDMA",
                src: 'img/relianc.jpg'
            },
            {
                id: "PR",
                name: "Postpaid Reliance GSM",
                src: 'img/relianc.jpg'
            }
        ]
        $scope.mobilRecg = function(rechargeType, mobilename, id) {
            $rootScope.mobile = {};
            $rootScope.mobile.type = rechargeType;
            $rootScope.mobile['name'] = mobilename;
            $rootScope.mobile['id'] = id;
            $state.go('recharge')
        }
        $scope.rechargeSubmit = function(recharge) {
            $scope.rechargeDetails['RetailerId'] = authentication.currentUser().userId;
            $scope.rechargeDetails['RechargeType'] = $rootScope.mobile.type;
            $scope.rechargeDetails['Company'] = $rootScope.mobile.name;
            $scope.rechargeDetails['OperatorCode'] = $rootScope.mobile.id;
            $scope.rechargeDetails['RechargeAmount'] = $scope.recharge.amount;
            $scope.rechargeDetails['CustomerName'] = $scope.recharge.Cusname;
            $scope.rechargeDetails['MobileNo'] = $scope.recharge.number;
            if (isNaN($scope.rechargeDetails.MobileNo) || $scope.rechargeDetails.MobileNo.length != 10) {
                console.log("Enter valid mobile number");
                $scope.rechargeError = "Enter valid mobile number";
                return;
            }
            if (isNaN($scope.rechargeDetails.RechargeAmount)) {
                $rootScope.ShowToast('Amount should be a number')


                return;
            }
            if (Number($scope.rechargeDetails.RechargeAmount) > Number($scope.CurrenBalance)) {
                $rootScope.ShowToast('Insufficient Blanace ')


                return;
            }
            var promise = serviceDB.toServer($scope.rechargeDetails, "/recharge");
            $rootScope.showDbLoading();
            promise.then(function(res) {
                if (res.data.done) {
                    $rootScope.hideDbLoading();
                    $rootScope.ShowToast('Successfully recharged')
                    console.log(res);
                    $scope.recharge = {}
                } else {
                    $rootScope.ShowToast('Unable to recharged')
                }
                //	var promise = serviceDB.toServer(details, "/recharge");
            }, function(res) {

                $rootScope.hideDbLoading();
                $rootScope.ShowToast('Unable to recharge')
                $scope.rechargeDetails = {}
            })

        }
        $scope.goBack = function() {
            window.history.back();
        }
    })