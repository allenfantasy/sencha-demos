Ext.define('UserAuth.view.MainMenu', {
  extend: 'Ext.Panel',
  requires: ['Ext.TitleBar'],
  alias: 'widget.mainmenuview', // `xtype: 'mainmenuview'` also works
  config: {
    layout: {
      type: 'fit'
    },
    items: [
      {
        xtype: 'titlebar',
        title: 'Main Menu',
        docked: 'top',
        items: [
          {
            xtype: 'button',
            text: 'Log Off',
            itemId: 'logOffButton',
            align: 'right'
          }
        ]
      }
    ],

    listeners: [
      {
        delegate: '#logOffButton', // binding object selector
        event: 'tap', // trigger event
        fn: 'onLogOffButtonTap' // function name
      }
    ]
  },
  onLogOffButtonTap: function() {
    this.fireEvent('signOffCommand');
  }
});
