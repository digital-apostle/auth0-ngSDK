(function () {

  'use strict';

  angular
    .module('app')
    .run(run);

  run.$inject = ['authService'];

  function run(authService) {

    if (localStorage.getItem('isLoggedIn') === 'true') {
      console.log("isLoggedIn == true, going to  authService.renewTokens()")
      authService.renewTokens();
    } else {
      // Handle the authentication
      // result in the hash
      console.log("app.run.js -  going to authService.handleAuthentication()")
      authService.handleAuthentication();
    }
  }

})();