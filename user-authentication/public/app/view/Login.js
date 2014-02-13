Ext.define('UserAuth.view.Login', {
  extend: 'Ext.form.Panel',
  alias: 'widget.loginview',
  requires: ['Ext.form.FieldSet', 'Ext.form.Password', 'Ext.Label', 'Ext.Img', 'Ext.util.DelayedTask'],
  config: {
    title: 'Login',
    items: [
      {
        xtype: 'image',
        src: Ext.Viewport.getOrientation() == 'portrait' ? '../../../img/login.png' : '../../../img/login-small.png', // direction
        style: Ext.Viewport.getOrientation() == 'portrait' ? 'width:80px; height: 80px; margin: auto;' : 'width: 40px; height: 40px; margin: auto;'
      },
      {
        xtype: 'label',
        html: 'Login failed. Please enter the correct credentials.',
        itemId: 'signInFailedLabel',
        hidden: true,
        hideAnimation: 'fadeOut',
        showAnimation: 'fadeIn',
        style: 'color: #990000; margin: 5px 0px'
      },
      {
        xtype: 'fieldset',
        title: 'Login Example',
        items: [
          {
            xtype: 'textfield',
            placeHolder: 'Username',
            itemId: 'userNameTextField',
            name: 'name', // differ from tutorial
            required: true
          },
          {
            xtype: 'passwordfield',
            placeHolder: 'Password',
            itemId: 'passwordTextField',
            name: 'password', // differ from tutorial
            required: true
          }
        ]
      },
      {
        xtype: 'button',
        itemId: 'logInButton',
        ui: 'action',
        padding: '10px',
        margin: '10px',
        text: 'Log In'
      }
    ],
    listeners: [
      {
        delegate: '#logInButton',
        event: 'tap',
        fn: 'onLogInButtonTap'
      }
    ]
  },
  // callback fn
  onLogInButtonTap: function() {
    var me = this,
        usernameField = me.down('#userNameTextField'),
        passwordField = me.down('#passwordTextField'),
        label = me.down('#signInFailedLabel');
        username = usernameField.getValue(),
        password = passwordField.getValue();

    label.hide();

    // Using a delayed task in order to give the hide animation above
    // time to finish before executing the next steps

    var task = Ext.create('Ext.util.DelayedTask', function() {
      label.setHtml('');

      // call controller's callback fn
      me.fireEvent('signInCommand', me, username, password);

      usernameField.setValue('');
      passwordField.setValue('');
    });

    task.delay(500);
  },

  showSignInFailedMessage: function(message) {
    var label = this.down('#signInFailedLabel');
    label.setHtml(message);
    label.show();
  }

})
