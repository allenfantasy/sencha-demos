Ext.define('ToDoListApp.model.Task', {
    extend: 'Ext.data.Model',
    config: {
        identifier: 'uuid',
        fields: [{
            name: 'id',
            type: 'int'
        }, {
            name: 'completed',
            type: 'boolean'
        }, {
            name: 'dueDate',
            type: 'date'
        }, {
            name: 'title',
            type: 'string',
            defaultValue: ''
        }, {
            name: 'description',
            type: 'string'
        }],
        idProperty: 'id',

        // PROXY
        proxy: {
            type: 'rest',
            url: location.protocol + "//" + location.host + '/tasks',
            reader: {
                type: 'json',
                rootProperty: 'data'
            },
            writer: {
                type: 'json'
            },
            id: 'senchatasks'
        },
    }
});

