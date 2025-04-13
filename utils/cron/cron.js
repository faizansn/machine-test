const cron = require("node-cron");
const { getOverduedTasks, createRecurrenceTasks } = require("./cronDaily");

function start() {
    cron.schedule("1 0 * * *", async () =>{
        await createRecurrenceTasks();
        await getOverduedTasks();
    })
}

module.exports = { start };