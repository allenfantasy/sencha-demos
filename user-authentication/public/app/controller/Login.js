Ext.define('UserAuth.controller.Login', {
  extend: 'Ext.app.Controller',
  config: {
    refs: {
      loginView: 'loginview',
      mainMenuView: 'mainmenuview'
    },
    control: {
      loginView: {
        signInCommand: 'onSignInCommand'
      },
      mainMenuView: {
        signOffCommand: 'onSignOffCommand'
      }
    }
  },

  // Session Token

  authToken: null,

  // Transitions
  getSlideLeftTransition: function() {
    return { type: 'slide', direction: 'left' }
  },
  getSlideRightTransition: function() {
    return { type: 'slide', direction: 'right' }
  },

  onSignInCommand: function(view, username, password) {
    console.log('Username: ' + username + '\n' + 'Password: ' +  password);

    var me = this,
        loginView = me.getLoginView(),
        app = me.getApplication();

    if (username.length === 0 || password.length === 0) {
      loginView.showSignInFailedMessage('Please enter your username and password.');
      return ;
    }

    loginView.setMasked({
      xtype: 'loadmask',
      message: 'Signing In...'
    });

    Ext.Ajax.request({
      url: app.domainAddress + '/sign_in',
      method: 'POST',
      params: {
        name: username,
        password: password,
        remember_me: 1
      },

      success: function(response) {
        var loginResponse = Ext.decode(response.responseText);

        if (loginResponse.success) {
          // The server will send a token that can be used throughout the app to confirm that the user is authenticated.
          me.authToken = loginResponse.authToken;

          //console.log("TOKEN: " + me.authToken);
          app.cookie.set('authToken', me.authToken);

          me.signInSuccess(response); // Just simulating success
        } else {
          me.signInFailure(loginResponse.message);
        }
      },

      failure: function(response) {
        me.authToken = null;
        me.signInFailure("Login failed. Please try again later.");
      }
    });
  },

  signInSuccess: function(response) {
    console.log('Signed in.');
    var loginView = this.getLoginView();
    mainMenuView = this.getMainMenuView();
    loginView.setMasked(false);

    Ext.Viewport.animateActiveItem(mainMenuView, this.getSlideLeftTransition());
  },

  signInFailure: function(message) {
    var loginView = this.getLoginView();
    loginView.showSignInFailedMessage(message);;
    loginView.setMasked(false);
  },

  onSignOffCommand: function() {
    var me = this,
        app = this.getApplication();

    Ext.Ajax.request({
      url: app.domainAddress + '/sign_off',
      method: 'POST',
      params: {
        authToken: me.authToken
      },

      success: function(response) {
        me.authToken = null;

        app.cookie.set('authToken', null);

        console.log("TOKEN: " + me.authToken);
        console.log("sign off success");
      },

      failure: function(response) {
        console.log("sign off failure");
      }
    });

    Ext.Viewport.animateActiveItem(this.getLoginView(), this.getSlideRightTransition());
  },

  launch: function() {
    // do init
  },

})
