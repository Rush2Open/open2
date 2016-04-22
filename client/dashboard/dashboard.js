angular.module('dashboard-module', ['firebase'])
.controller('dashboardCtrl', function($scope, Services,$mdDialog, $mdMedia, $route, $sce, $firebaseAuth, $firebaseArray, $firebaseObject, $state) {
  $scope.events = {};

  $scope.ref = new Firebase("https://fiery-inferno-8987.firebaseio.com");
  $scope.authObj = $firebaseAuth($scope.ref);
  $scope.uid;
  $scope.info;
  $scope.checkAuthentication = function() {
    $scope.authObj.$onAuth(function(authData) {
      if (authData) {
        $scope.uid = authData.auth.uid;
        $scope.getFriends($scope.uid);

        Services.uploadUserProfile($scope.uid)
        .then(function(data){
          console.log('data: ', data.data);
          $scope.info = data.data;


        });
      } else {
        $state.go('home');
      }
    })
  }
  // start uploading dashboard
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
    //end of uploading dashboard


    //chat functionality
    $scope.showChat = false;

    $scope.displayChat = function() {
      console.log($scope.showChat + "is now");
      if($scope.showChat === false) {
        $scope.showChat = true;
        $scope.clearChat();
      } else {
        $scope.showChat = false;
      }
    };

    $scope.messages = $firebaseArray($scope.ref);
    $scope.newMessage = function(event) {
      if(event.keyCode === 13 && $scope.msg) {
        var username = $scope.info[0].username;
        $scope.messages.$add({from: username, body: $scope.msg});
        $scope.msg = "";
      }
    }

    $scope.clearChat = function(){
      $scope.ref.remove();
    }

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


    $scope.userList = [];
    $scope.getUserNames = function(){
      Services.getUsernames().then(function(usernames){
        usernames.data.forEach(function(name){
          $scope.userList.push(name);
        })

      })
    }
    $scope.getUserNames();


    $scope.addFriend = function(username){
      Services.addFriend($scope.uid, username).then(function(usernames){

        alert("you added " + username);
        $state.reload();


      })
    }


    $scope.myFriends = [];
    $scope.getFriends = function(uid){
      Services.getFriends(uid).then(function(friends){

        console.log("hi")
        friends.data.forEach(function(name){
          $scope.myFriends.push(name);
        })
        console.log("my Friends", $scope.myFriends)
      })
    }

    $scope.checkAuthentication();


    $scope.searchBarShown = false;

    $scope.showSearchBar = function(){
      if($scope.searchBarShown === false){
        $scope.searchBarShown = true;
      } else {
        $scope.searchBarShown = false;
      }
    };


    //pop up dialog box
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
    }; //end of pop up dialog box.

    $scope.time = {
      value: new Date(2016, 3, 9)
    };

    $scope.click = function() {
      var eventInfo = {
        'event' : $scope.user.activity,
        'time' : $scope.time.value,
        'username': localStorage.getItem('username')
      }
      console.log(eventInfo);

      Services.eventsPost(eventInfo)
      .then(function(respData){
        //console.log('i got this back from server/database', respData);
        console.log("addEvent Promiss returning", respData);
      });
    };
  });
