angular.module('myApp', [
  'ngMaterial',
  'ngRoute',
  'ngMessages',
  'authentication-module',
  'dashboard-module',
  'open2-Services',
  'ui.router',
  'firebase',
  'naif.base64'
])

//route config
.config(function($urlRouterProvider, $stateProvider, $mdThemingProvider) {
  $urlRouterProvider.otherwise('/'); // https://www.youtube.com/watch?v=QETUuZ27N0w
  $stateProvider
  .state('home',{
    url: '/',
    templateUrl: './authentication/login.html',
    controller: 'loginCtrl'
  })
  .state('dashboard',{
    url: '/dashboard',
    templateUrl: './dashboard/dashboard.html',
    controller: 'dashboardCtrl'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: './authentication/signup.html',
    controller: 'signupCtrl'
  });
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
    .primaryPalette('Open2Pallete');
  // NOTIFICATION BOX
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
})

/// this reversed the order of the events displayed on dashboard
.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})


// controller handles styling
.controller('AppCtrl', function ($scope, $timeout, Services, $mdSidenav, $log) {
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
})

.controller('SubheaderAppCtrl', function($scope) {
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
