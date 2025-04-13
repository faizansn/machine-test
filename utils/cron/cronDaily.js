const db = require('../../src/models/index');
const moment = require("moment");
const { insertIntoNotification } = require('../../src/services/notification');

exports.createRecurrenceTasks = async () => {
    const tasks = await db.task
      .find({ isRecurred: false, recurrence: { $ne: "once" } })
      .lean();
    const dailyRecurrenceTasks = tasks.filter((t) => t.recurrence == "daily");
    const weeklyRecurrenceTasks = tasks.filter((t) => t.recurrence == "weekly");
    const monthlyRecurrenceTasks = tasks.filter((t) => t.recurrence == "montly");

    handleDailyRecurrenceTasks(dailyRecurrenceTasks);
    handleWeeklyRecurrenceTasks(weeklyRecurrenceTasks);
    handleMonthlyRecurrenceTasks(monthlyRecurrenceTasks);
}

function handleDailyRecurrenceTasks(tasks) {
    const bodyArray = tasks.map((t) => {
        const { createdAt, updatedAt, submissionMedia, submissionDescription, _id, status, ...rest } = t;
        const nextDueDate = moment(t.dueDate).add(1, "days");

        db.task.findByIdAndUpdate(t._id, {dueDate: nextDueDate});
        insertIntoNotification("New Task Assigned", `New task has been assigned to you`, t.assignedTo, t.createdBy, "assignedTask", "Task")


        return { ...rest, isRecurred: true, dueDate: nextDueDate, taskRecurredFrom: _id };
    });

    db.task.create(bodyArray);
}

function handleWeeklyRecurrenceTasks(tasks) {
    const oneWeekAgo = moment().subtract(7, 'days');

    const filteredTasks = tasks.filter(t => moment(t.createdAt).isBefore(oneWeekAgo));

    const bodyArray = filteredTasks.map(t => {
        const { createdAt, updatedAt, submissionMedia, submissionDescription, _id, status, ...rest } = t;
        const nextDueDate = moment(t.dueDate).add(7, "days");

        db.task.findByIdAndUpdate(t._id, {dueDate: nextDueDate});
        insertIntoNotification("New Task Assigned", `New task has been assigned to you`, t.assignedTo, t.createdBy, "assignedTask", "Task")

        return { ...rest, isRecurred: true, dueDate: nextDueDate, taskRecurredFrom: _id };
    })

    db.task.create(bodyArray);
}

function handleMonthlyRecurrenceTasks(tasks) {
    const oneMonthAgo = moment().subtract(1, 'months');

    const filteredTasks = tasks.filter(t => moment(t.createdAt).isBefore(oneMonthAgo));
    
    const bodyArray = filteredTasks.map((t) => {
        const { createdAt, updatedAt, submissionMedia, submissionDescription, _id, status, ...rest } = t;
        const nextDueDate = moment(t.dueDate).add(1, "months");
        
        db.task.findByIdAndUpdate(t._id, {dueDate: nextDueDate});
        insertIntoNotification("New Task Assigned", `New task has been assigned to you`, t.assignedTo, t.createdBy, "assignedTask", "Task")

        return { ...rest, isRecurred: true, taskRecurredFrom: _id , dueDate: nextDueDate };
    });

    db.task.create(bodyArray)
}

exports.getOverduedTasks = async () => {
    const tasks = await db.task.find({ dueDate: { $lte: Date.now() }});
    tasks.forEach((t) => {
        db.task.findByIdAndUpdate(t._id, { status: "overdue" });
        insertIntoNotification("Task Overdued", `Your task "${t.title}" has passed its due date which was on ${t.dueDate}`, t.assignedTo, t.createdBy, "Overdue Task", "Task")
    })
}
