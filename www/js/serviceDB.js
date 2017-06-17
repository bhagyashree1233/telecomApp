angular.module('starter.service', [])

.factory('serviceDB', function($http, $q, authentication) {
   
  function toServer(doc2send, Url) {
   //Url = "http://telecom.azurewebsites.net"+Url;
   Url="http://192.168.0.12:80"+Url;
    console.log(doc2send);
    console.log(Url);

    var deferred = $q.defer();  
    var req =              
    {  
      method: 'POST', 
      url: Url,
      data: jQuery.param(doc2send), 
      headers: 
      {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+authentication.getToken()
      }
    }   
         console.log(authentication.getToken());    
     console.log(req);     

     $http(req).then(function(res) {
       console.log(res.data);
       deferred.resolve(res); 
     },function(res) {
       console.log(res) 
       deferred.reject(res);
    });

    return deferred.promise;
  }

  function login(doc2send, Url) {
  //Url = "http://telecom.azurewebsites.net"+Url;
 Url="http://192.168.0.12:80"+Url;
    console.log(Url);
   console.log('entered login service func....');
    var deferred = $q.defer();  
    var req =              
    {  
      method: 'POST', 
      url: Url,
      data: jQuery.param(doc2send), 
      headers: 
      {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }   
          
     $http(req).then(function(res) {
       console.log(res.data);
       if(res.data.done) {
          authentication.saveToken(res.data.token);  
       }
       deferred.resolve(res); 
     },function(res) { 
     
       console.log(res);
       deferred.reject(res);
    });

    return deferred.promise;
  }

  function recharge(doc2send, Url) {
    console.log(doc2send);


    var deferred = $q.defer();  
    var req =              
    {  
      method: 'GET', 
      url: Url,
      data: jQuery.param(doc2send), 
      headers: 
      {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }   
          
     console.log(req);     

     $http(req).then(function(res) {
       console.log(res.data);
       deferred.resolve(res); 
     },function(res) { 
       console.log('error ');
       deferred.reject(res);
    });

    return deferred.promise;
  } 

  return {
      toServer : toServer,
      login : login,
      recharge : recharge
  } 
})

.factory('authentication', function($window) {

    function saveToken(token) {
      $window.localStorage['auth-token'] = token;
    };

    function getToken() {
      return $window.localStorage['auth-token'];
    };

    function logout() {
      $window.localStorage.removeItem('auth-token');
    };

    function isLoggedIn () {
      var token = getToken();
      console.log(token);
      var payload;

      if(token){
        payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);

         return payload.exp > Date.now() / 1000;
      } else {
         return false;
      }
    };

     function currentUser() {
      if(isLoggedIn()){
        var token = getToken();
        var payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);

        console.log(payload);
      
       return {
        userId : payload.userId
       };
      }
     };

    return {
      saveToken : saveToken,
      getToken : getToken,
      logout : logout,
      isLoggedIn : isLoggedIn,
      currentUser : currentUser
    };
    
  
})
