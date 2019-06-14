(function () {

  'use strict';

  angular
    .module('app')
    .service('authService', authService);

  authService.$inject = ['$state', 'angularAuth0', '$timeout'];

  function authService($state, angularAuth0, $timeout) {

    var accessToken;
    var idToken;
    var expiresAt;

    function getIdToken() {
      return idToken;
    }

    function getAccessToken() {
      return accessToken;
    }

    function login() {
      console.log("login before angularAuth0.authorize();")
      angularAuth0.authorize();
    }

    function handleAuthentication() {
      //parseHash(options, cb) - https://auth0.github.io/auth0.js/global.html#parseHash
      angularAuth0.parseHash(function(err, authResult) {
        console.log("handleAuthentication - angularAuth0.parseHash callback")
        console.log("handleAuthentication - angularAuth0.parseHash authResult", authResult);

        if (authResult && authResult.accessToken && authResult.idToken) {
          localLogin(authResult);
          $state.go('home');
        } else if (err) {
          $timeout(function() {
            $state.go('home');
          });
          console.log(err);
          alert('Error: ' + err.error + '. Check the console for further details.');
        }
        else {
          console.log("handleAuthentication - angularAuth0.parseHash callback else clause")
        }
      });
    }

    function localLogin(authResult) {
      // Set isLoggedIn flag in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      // Set the time that the access token will expire at
      expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
      accessToken = authResult.accessToken;
      idToken = authResult.idToken;
    }

    function renewTokens() {
      console.log("in renewTokens ")
      angularAuth0.checkSession({},
        function(err, result) {
          if (err) {
            console.log(err);
          } else {
            localLogin(result);
          }
        }
      );
    }

    function logout() {
      // Remove isLoggedIn flag from localStorage
      localStorage.removeItem('isLoggedIn');
      // Remove tokens and expiry time
      accessToken = '';
      idToken = '';
      expiresAt = 0;

      angularAuth0.logout({
        return_to: window.location.origin
      });

      $state.go('home');
    }

    function isAuthenticated() {
      // Check whether the current time is past the 
      // access token's expiry time
      console.log("in isAuthenticated ")
       
      var authenticated = localStorage.getItem('isLoggedIn') === 'true' && new Date().getTime() < expiresAt;
      console.log("in isAuthenticated, authenticated =", authenticated )
      return authenticated;
    }

    return {
      login: login,
      getIdToken: getIdToken,
      getAccessToken: getAccessToken,
      handleAuthentication: handleAuthentication,
      logout: logout,
      isAuthenticated: isAuthenticated,
      renewTokens: renewTokens
    }
  }
})();
