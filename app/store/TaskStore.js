Ext.define('ToDoListApp.store.TaskStore', {
    extend: 'Ext.data.Store',
    requires: [ 'ToDoListApp.model.Task' ],
    config: {
        autoLoad: true,
        //autoSync: true,
        model: 'ToDoListApp.model.Task',
        storeId: 'TaskStore',
        proxy: {
            type: 'rest',
            url: 'http://localhost:9292/tasks',
            reader: {
                type: 'json',
                rootProperty: 'data'
            },
            writer: {
                type: 'json'
            },
            id: 'senchatasks'
        },
        sorters: [{
            property: 'dueDate',
            direction: 'ASC'
        }],
        grouper: function (record) {
            if (record && record.get('dueDate')) {
                return record.get("dueDate").toDateString();
            }
        },
        listeners : {
            load : function(store, records, successful, operation, eOpts) {
                console.log("After loading: " + store.getCount());
                var app = Ext.app.Application.appInstance;
                app.getController('TaskController').updateTaskCount();
        }
    }
    },
    
});

