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
                // TODO: maybe we can do store operation in erase's callback?
                store.remove(task);
                task.erase();
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
        var store = list.getStore();
        task.set('completed', !done);
        task.save(); // PUT
        store.load(); // try out

        e.stopEvent(); // stop 'itemsingletap' event to bubble.
    },

    showTask: function(list, index, target, task, e, eOpts) {
        // TODO: datepicker timezone issue
        this.getTaskForm().setRecord(task); // retrieve or create a TaskForm. Then set the record.
        this.getDeleteButton().setHidden(false);
        this.showForm();

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
        if (null === store.findRecord("id", task.get('id'))) {
            store.add(task);
            console.log("ADDING id: " + task.get("id"));
            task.save({
                success: function(record, operation) {
                    var responseText = Ext.decode(operation.getResponse().responseText);
                    //console.log('success', arguments);
                    record.setId(responseText["id"]);
                    record.phantom = false;
                    console.log(record);
                }
            });
        }
        else {
            console.log("UPDATING");
            task.save();
        }
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

