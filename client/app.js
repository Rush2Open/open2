
var app = angular.module('myApp', ['ngMaterial', 'ngRoute', 'ngMessages', 'ui.router']);
app.config(function($mdThemingProvider) {
  $mdThemingProvider.definePalette('Open2Pallete', {
    '50': 'FFBC4F',
    '100': 'FFBC4F',
    '200': 'FFBC4F',
    '300': 'FFBC4F',
    '400': 'FFBC4F',
    '500': 'FFBC4F', //this is our bar color
    '600': 'e53935', //mouse hover over NEW EVENT button color
    '700': '7CFC00',
    '800': '7CFC00',
    '900': '7CFC00',
    'A100': '7CFC00',
    'A200': '7CFC00',
    'A400': '7CFC00',
    'A700': '7CFC00',
  });
  $mdThemingProvider.theme('default')
    .primaryPalette('Open2Pallete')
});

//route config
app.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl: 'login.html',
    controller: 'loginCtrl'
  })
  .when('/dashboard', {
    templateUrl: 'dashboard.html'
  })
  .when('/signup', {
    templateUrl: 'signup.html'
  })
  .otherwise({
    redirectTo: '/'
  })
});

//state config
app.config(function($stateProvider){
  $stateProvider
      .state('userProfile', {
        url: '/userProfile',
        templateUrl: 'userProfile.html',
        controller: 'userProfileCtrl'
      })
});

/// login controller
app.controller('loginCtrl', function($scope, Services, $location) {


  $scope.redirectSignup = function() {
    $location.path('/signup');
  };


  $scope.submit = function() {
    var user = {
      username: $scope.username,
      password: $scope.password
    };

    //remember the current username to use later
  localStorage.setItem('username', $scope.username);

   //login the user
  Services.login(user);
  };

});


   // signup controller
app.controller('signupCtrl', function($scope, Services) {
  $scope.submit = function() {
    var user = {
      username: $scope.username,
      password: $scope.password
    };
    Services.signup(user);
  };
});


// dashboard controller
app.controller('dashboardCtrl', function($scope, Services,$mdDialog, $mdMedia, $route, $sce) {
  $scope.events = {};

  //// start uploading dashboard
  Services.uploadDashboard()
  .then(function(data){
    $scope.events.fetch = true;
    var myEvents = [];
    var eventsToJoin = [];

      //creating list of the events that current user attends or created himself
    data.forEach(function(item) {
      if(item.username===localStorage.getItem('username') && item.created_by === 0) {
        myEvents.push(
         {
          'eventname': item.eventname,
          'id': item.id,
          'timestamp': item.timestamp,
          'username': item.username,
          'createdBy': item.created_by,
          'status': 'unjoin'
        });
      }
      else if (item.username=== localStorage.getItem('username') && item.created_by ===1 ) {
        myEvents.push({
          'eventname': item.eventname,
          'id': item.id,
          'timestamp': item.timestamp,
          'username': item.username,
          'createdBy': item.created_by,
          'status': 'created by me'

        });
       }
    });


     //creating the list of events that are created by the user's friends, but aren't joined by the user
    data.forEach(function(item) {
     if (item.username!== localStorage.getItem('username') && item.created_by === 1) {
       eventsToJoin.push({
        'eventname': item.eventname,
        'id': item.id,
        'timestamp': item.timestamp,
        'username': item.username,
        'createdBy': item.created_by,
        'status': 'join'
      });
      }
    });

  $scope.events.list = eventsToJoin;
  $scope.events.eventsIgoTo = myEvents;


}); // end of .then

////////////////end of uploading dashboard


 // join or unjoin event

 $scope.join = function(id, status) {
     //join
  if(status === 'join') {
    var joinInfo = {
      'eventId': id,
      'user': localStorage.getItem('username')
    };
    Services.joinEvent(joinInfo);
    $route.reload();
  }
   //unjoin
  else if(status === 'unjoin') {

  // delete the record about user's attendance from database
   Services.unjoinEvent(id); // this doesn't work for come reason.
  }

};


 Services.uploadFriendslist()
 .then(function(data){
    //console.log("friendslist i got from server ", data.data)
    $scope.friends = data.data;

 });


  //this is our pop up dialog box

  $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
   $scope.showAdvanced = function(ev) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'inviteForm.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: useFullScreen
    })

    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });
  };
  //this the end of our pop up dialog box.


  $scope.time = {
    value: new Date(2016, 3, 9)
  };  //end of our time selector


  $scope.click = function() {
    var eventInfo = {
      'event' : $scope.user.activity,
      'time' : $scope.time.value,
      'username': localStorage.getItem('username')
    }


    Services.eventsPost(eventInfo)
    .then(function(respData){
      //console.log('i got this back from server/database', respData);
      $route.reload(); //
    });
  };


}); ///////// end of dahboard controller

// profile controller
app.controller('userProfileCtrl', function($scope, Services) {
  $scope.submitImage = function() {
    var image = {
      url: $scope.imageURL,
      type: $scope.imageType
    };
    Services.uploadImage(image);
  };
}); // end of profile controller


/// this reversed the order of the events displayed on dashboard
app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});


  /// factory for get/post requests
app.factory('Services', function($http, $location) {
  var username;

   // login
  var login = function(user) {
    console.log('services username inside signup', username);
    return $http({
      method: 'POST',
      url: 'http://localhost:8080/index/homepage',
      data: user
    })
    .then(function(resp){
      $location.path('/dashboard');
    })
    .catch(function(err){
      $location.path('/');
      console.log(err);
    })
  };

  // logout

  var logout = function(){
    $location.path('/');
  };


  // signup

  var signup = function(user) {
    return $http({
      method: 'POST',
      url: 'http://localhost:8080/signup/newuser',
      data: user
    })
    .then(function(resp){
      $location.path('/login');
    })
    .catch(function(err){
      $location.path('/');
      console.log(err);
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
      $location.path('/');
      console.log(err);
    })
  };


     // new event request
  var eventsPost = function(eventInfo) {
    //console.log('eventinfo inside events post', eventInfo);
    return $http({
      method: 'POST',
      url: 'http://localhost:8080/dashboard/events',
      data: eventInfo
    });

  };

     // get freinds list
  var uploadFriendslist = function() {
    return $http ({
      method: 'GET',
      url: 'http://localhost:8080/dashboard/friends'
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

  //upload an Image to userProfile
var uploadImage = function(image) {
    return $http({
       method: 'POST',
       url: 'http://localhost:8080/userProfile/uploadImage',
       data: image
    });
};

  return {
    login: login,
    uploadDashboard: uploadDashboard,
    notify: notify,
    eventsPost: eventsPost,
    signup: signup,
    logout: logout,
    username: username,
    uploadFriendslist: uploadFriendslist,
    joinEvent: joinEvent,
    unjoinEvent: unjoinEvent,
    uploadImage: uploadImage
  };

});
/// end of Services




  ///// controller handles styling

app.controller('AppCtrl', function ($scope, $timeout, Services, $mdSidenav, $log) {
  $scope.toggleLeft = buildDelayedToggler('left');
  $scope.toggleRight = buildToggler('right');
  $scope.logout = function(){
    Services.logout();
  }
  $scope.isOpenRight = function(){
    return $mdSidenav('right').isOpen();
  };
  /**
  * Supplies a function that will continue to operate until the
  * time is up.
  */
  function debounce(func, wait, context) {
    var timer;
    return function debounced() {
      var context = $scope,
      args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function() {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }
  /**
  * Build handler to open/close a SideNav; when animation finishes
  * report completion in console
  */
  function buildDelayedToggler(navID) {
    return debounce(function() {
      $mdSidenav(navID)
      .toggle()
      .then(function () {
        $log.debug("toggle " + navID + " is done");
      });
    }, 200);
  }
  function buildToggler(navID) {
    return function() {
      $mdSidenav(navID)
      .toggle()
      .then(function () {
        $log.debug("toggle " + navID + " is done");
      });
    }
  }
})
.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
  $scope.close = function () {
    $mdSidenav('left').close()
    .then(function () {
      $log.debug("close LEFT is done");
    });
  };
})
.controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
  $scope.close = function () {
    $mdSidenav('right').close()
    .then(function () {
      $log.debug("close RIGHT is done");
    });
  };
});

//NOTIFICATION BOX
app.config(function($mdThemingProvider) {
  $mdThemingProvider.definePalette('ojo', {
    '50': '#fffefe',
    '100': '#ffcfb2',
    '200': '#ffac7a',
    '300': '#ff7f32',
    '400': '#ff6c14',
    '500': '#f45c00',
    '600': '#d55000',
    '700': '#b74500',
    '800': '#983900',
    '900': '#7a2e00',
    'A100': '#fffefe',
    'A200': '#ffcfb2',
    'A400': '#ff6c14',
    'A700': '#b74500',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': '50 100 200 300 400 A100 A200 A400'
  });
});


app.controller('SubheaderAppCtrl', function($scope) {
  $scope.messages = [
    {
      what: 'Brunch this weekend?',
      who: 'Dain',
      when: '3:08PM',
      notes: " I'll be in your neighborhood doing errands"
    },
  ];
});



function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}
