
export default class {
  var authenticationFrameQ = $q(function(resolve, reject){

    var frame = $('<iframe src="'+accountsBaseUrl+'/app/authorize.html'+'" style="display:none"></iframe>');

    $("body").prepend(frame);

    frame.load(function(evt){
      resolve(evt.target || evt.srcElement);
    });

    $timeout(function(){
      reject('accounts is not available / call is made from an unauthorized domain');
    }, 5000);
  });

  var pToken;
      var pCookieToken;

      //============================================================
      //
      //
      //============================================================
      function getCookieToken() {
          return pCookieToken;
      }

  //============================================================
  //
  //
  //============================================================
  function getToken() {

    return $q.when(authenticationFrameQ).then(function(authenticationFrame){

      if(!authenticationFrame) {
        pToken = pToken || null;
      }

      if(pToken!==undefined) {
        return $q.when(pToken || null);
      }

      pToken = null;

      var defer = $q.defer();
      var unauthorizedTimeout = $timeout(function(){
        console.error('accounts is not available / call is made from an unauthorized domain');
        defer.resolve(null);
      }, 1000);

      var receiveMessage = function(event)
      {
        $timeout.cancel(unauthorizedTimeout);

        if(event.origin!=accountsBaseUrl)
          return;

        var message = JSON.parse(event.data);

        if(message.type=='authenticationToken') {
          defer.resolve(message.authenticationToken || null);

          if(message.authenticationEmail)
            $rootScope.lastLoginEmail = message.authenticationEmail;
        }
        else {
          defer.reject('unsupported message type');
        }
      };

      $window.addEventListener('message', receiveMessage);

      pToken = defer.promise.then(function(t){

        pCookieToken = pToken = t;

        return t;

      }).finally(function(){

        $window.removeEventListener('message', receiveMessage);

      });

      authenticationFrame.contentWindow.postMessage(JSON.stringify({ type : 'getAuthenticationToken' }), accountsBaseUrl);

      return pToken;

    }).catch(function(error){

      pToken = null;

      console.error(error);

      throw error;

    });
  }

  //============================================================
    //
    //
    //============================================================
  function setToken(token, email) { // remoteUpdate:=true

    return $q.when(authenticationFrameQ).then(function(authenticationFrame){

      pToken = token || undefined;

      if(authenticationFrame) {

        var msg = {
          type : "setAuthenticationToken",
          authenticationToken : token,
          authenticationEmail : email
        };

        authenticationFrame.contentWindow.postMessage(JSON.stringify(msg), accountsBaseUrl);
      }

      if(email) {
        $rootScope.lastLoginEmail = email;
      }
    });
  }
}
