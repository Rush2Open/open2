angular.module('open2-Services',[])
  /// factory for get/post requests
    .factory('Services', function($http, $state) {
      var username;

   // login
   var login = function(user) {
     console.log('user.username: ', user.username);
     return $http({
       method: 'POST',
       url: 'http://localhost:8080/index/homepage',
       data: user
     })
   };

  // logout

  var logout = function(){
    $state.go('home');
  };


  // signup

  var signup = function(user) {
    console.log(user);
    return $http({
      method: 'POST',
      url: 'http://localhost:8080/signup/newuser',
      data: user
    })
  };

   // get the event info from database
   var uploadDashboard = function() {
     return $http({
       method: 'GET',
       url: 'http://localhost:8080/dashboard/upload',
     })
     .then(function(resp){
      //console.log("data in uploadDashboard", resp.data)
      return resp.data;
    });
   };


  //// Twillio notification
  var notify = function(sendText){
    return $http({
      method: 'POST',
      url: 'http://localhost:8080/dashboard',
      data: sendText
    })
    .then(function(data){
      console.log("Sent the Messages", data);
    })
    .catch(function(err){
      $state.go('home');
      console.log(err);
    })
  };


     // new event request
     var eventsPost = function(eventInfo) {
    //console.log('eventinfo inside events post', eventInfo);
    console.log("INSIDE EVENT POST SERVICES", eventInfo);
    return $http({
      method: 'POST',
      url: 'http://localhost:8080/dashboard/events',
      data: eventInfo
    });

  };

  var uploadUserProfile = function(id) {
    var uid = {
      id: id
    };
    return $http({
      method: 'POST',
      url: 'http://localhost:8080/dashboard/userProfile',
      data: uid
    });
  };

   // add a record to database when user joins an event
   var joinEvent = function(eventId) {
     return $http({
       method: 'POST',
       url: 'http://localhost:8080/dashboard/join',
       data: eventId
     });
   };


   //remove the record of user from database// this isn't handled in the backend
   var unjoinEvent = function(userEventId) {
     return $http({
       method: 'POST',
       url: 'http://localhost:8080/dashboard/unjoin',
       data: userEventId
     });

   };

   var getUsernames = function(){
     return $http({
       method: 'GET',
       url: 'http://localhost:8080/friends/getUsernames'
     });
   }

  var addFriend = function(uid, username){
    var adding = {
      id: uid,
      username2: username
    }
    return $http.post('/friends/add', adding);
   }

   var getFriends = function(uid){
    console.log("THIS IS THE UID THAT WE NEED PLZ THANKZ", uid);
    var gettingFriends = {
      id: uid
    }
    return $http.post('/friends', gettingFriends);
   }

   return {
     login: login,
     uploadDashboard: uploadDashboard,
     notify: notify,
     eventsPost: eventsPost,
     signup: signup,
     logout: logout,
     username: username,
     joinEvent: joinEvent,
     unjoinEvent: unjoinEvent,
     getUsernames: getUsernames,
     uploadUserProfile: uploadUserProfile,
     addFriend: addFriend,
     getFriends: getFriends
   };

 });
