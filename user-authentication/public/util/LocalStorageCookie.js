// WARNING: paste from http://www.sencha.com/forum/showthread.php?132816-Cookie-Plugin-for-Sencha-Touch-(using-LocalStorage)
// TODO: check if this really works.

/*
// Usage (for example in your application controller):

// Initialize
app.cookie = new Ext.util.LocalStorageCookie();

// Initialize with config
app.cookie = new Ext.util.LocalStorageCookie({
	proxyId: 'com.mydomain.cookies',
});

// Set a value
app.cookie.set('some_setting', 'some_value');

// Get a value
app.cookie.get('some_setting');

// Delete a value
app.cookie.delete('some_setting');

*/
Ext.util.LocalStorageCookie = Ext.extend(Object, {
  
  proxyId: 'com.domain.cookies',
  
  constructor: function(config) {
    
    this.config = Ext.apply(this, config);
    
    // Create the cookie model
    Ext.regModel('LocalStorageCookie', {
      fields: [
        'id',
        'key',
        'value',
      ],
      proxy: {
        type: 'localstorage',
        id: this.proxyId,
      }
    });
    // Create the cookie store 
    this.store = new Ext.data.Store({
      model: "LocalStorageCookie",
    });    
    this.store.load();
  },
  
  // Get function
  get: function(key) {
    var indexOfRecord = this.store.find('key', key, 0, false, true, true); //<-- Forcing exact matching
    if (indexOfRecord == -1) {
      return null; //<-- returning null, since "-1" may be a valid and expected value from the store?
    }
    else {
      var record = this.store.getAt(indexOfRecord);
      return record.get('value');
    }
  },
  
  // Set function
  set: function(key, value) {
    var indexOfRecord = this.store.find('key', key, 0, false, true, true); //<-- Forcing exact matching
    if (indexOfRecord == -1) {
      var record = Ext.ModelMgr.create({key:key, value:value}, 'LocalStorageCookie');
    }
    else {
      var record = this.store.getAt(indexOfRecord);
      record.set('value', value);
      this.store.sync(); //<-- Syncing for good measure, may not be necessary
    }  
    return record.save();
  },

  // Delete function
  delete: function(key)
  {
    var indexOfRecord = this.store.find('key', key, 0, false, true, true);
    if (indexOfRecord == -1) {
      return false;
    }
    else {
      var record = this.store.removeAt(indexOfRecord);
      this.store.sync();
      return true;
    }
  }
});