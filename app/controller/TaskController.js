Ext.define('ToDoListApp.controller.TaskController', {
    requires: ['Ext.MessageBox'],
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            navigationView:   'navigationview',
            taskList:         'tasklist',
            taskCountBar:     '#taskCountBar',
            createTaskButton: 'button[action=createTask]',
            saveButton:       'button[action=saveTask]',
            deleteButton:     'button[action=deleteTask]'
        },
        control: {
            taskList: {
                itemsingletap: 'showTask', // check
                disclose: 'changeDoneStatus', // check
                itemswipe: 'deleteTaskSwipe' // check
            },

            createTaskButton: {
                tap: 'createTask' // check
            },

            saveButton: {
                tap: 'saveTask' // check
            },

            deleteButton: {
                tap: 'deleteTask'  // check
            }
        },
        // routes: {}
    },

    launch: function () {
        //this.updateTaskCount();
    },

    // Event handlers
    deleteTask: function(button, e, eOpts) {
        var store = this.getTaskList().getStore();
        Ext.Msg.confirm('Delete this task?', 'You cannot undo this!', function (answer) {
            if (answer === 'yes') {
                var task = this.getTaskForm().getRecord();
                console.log("Store COUNT: " + store.getCount());
                // FIXME: 2 DELETE request to backend. Get rid of one.
                store.remove(task);
                //store.sync();
                task.erase();
                
                console.log("Store COUNT: " + store.getCount());
                this.showList();
            }
        }, this);
    },

    deleteTaskSwipe: function (list, index, target, record, e, eOpts) {
        var title = 'Delete the task "' + record.get('title') + '"?';
        Ext.Msg.confirm(title, 'You cannot undo this!', function (answer) {
            if (answer === 'yes') {
                var store = this.getTaskList().getStore();
                store.remove(record);
                this.updateTaskCount();
            }
        }, this);
    },

    changeDoneStatus: function (list, task, target, index, e, eOpts) {
        var done = task.get('completed');
        task.set('completed', !done);

        e.stopEvent(); // stop 'itemsingletap' event to bubble.
        //console.log("[EVENT] changeDoneStatus");
    },

    showTask: function(list, index, target, task, e, eOpts) {
        this.getTaskForm().setRecord(task); // retrieve or create a TaskForm. Then set the record.
        this.getDeleteButton().setHidden(false);
        this.showForm();
        //console.log("[EVENT] showTask");


        var delayedTask = Ext.create('Ext.util.DelayedTask', function() {
            list.deselect(index); // free the current item in 'selected' mode(blue background)
        });
        delayedTask.delay(500); // delay 500 milliseconds to execute
    },

    saveTask: function (button, e, eOpts) {
        var store = this.getTaskList().getStore();
        var task = this.getTaskForm().getRecord();
        this.getTaskForm().updateRecord(task);
        
        // Is it a new object?
        // FIX HERE.
        if (null === store.findRecord("id", task.get('id'))) {
            store.add(task);
            console.log("ADDING id: " + task.get("id"));
        }
        else {
            console.log("UPDATING");
            oldTask = store.findRecord("id", task.get('id'));
            //console.log(task);
            //console.log(oldTask);
            //console.log(task === oldTask);
            //oldTask.set(task.getData())
        }
        //task.save();
        //console.log("[METHOD] saveTask");
        //console.log("before save");
        //console.log("Store COUNT: " + store.getCount());
        //console.log(store.getNewRecords());
        store.sync();
        /*var tmp = store.sync({
            success: function(batch, syncOptions) {
                //store.load();
                //console.log("dirty:" + task.dirty);
                //console.log("phantom: " + task.phantom);
                //console.log("callback!");
                //console.log(options);
                var res = batch.operations[0].getResponse();
                var responseText = Ext.decode(res.responseText);
                //console.log(res);
                //task.phantom = false; // for created record
                //task.dirty = false; // for updated record
                //task.setId(responseText["id"]);
                console.log("Task: ");
                console.log(task);
            }
        });*/ // now request to backend.
        //console.log(tmp);
        //console.log(store.getNewRecords());
        // task.save()
        // task.dirty = false; // prevent further action.
        //console.log("after save");
        //console.log("Store COUNT: " + store.getCount());
        this.showList();
    },

    createTask: function(button, e, eOpts) {
        var newTask = Ext.create('ToDoListApp.model.Task', {
            title: '',
            description: '',
            completed: false,
            dueDate: new Date()
        });
        var store = this.getTaskList().getStore();
        console.log("[METHOD] createTask");
        console.log("Store COUNT: " + store.getCount());
        this.getTaskForm().setRecord(newTask);
        this.getDeleteButton().setHidden(true); // we don't need delete button to show up when creating task.
        this.showForm();
    },

    showForm: function () {
        this.getNavigationView().push(this.getTaskForm());
    },

    showList: function() {
        this.updateTaskCount();
        this.getNavigationView().pop(); // pop out the form. Get it done.
    },

    updateTaskCount: function () {
        var store = this.getTaskList().getStore();
        var count = store.getCount();
        //console.log("1st updateTaskcount: " + count);
        this.getTaskCountBar().setTitle(count + ' tasks');
    },

    getTaskForm: function () {
        if (!this.taskForm) {
            this.taskForm = Ext.widget('taskform');
        }
        return this.taskForm;
    }
});

