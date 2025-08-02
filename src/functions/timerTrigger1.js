const { app } = require('@azure/functions');

app.timer('timerTrigger1', {
    schedule: '* * * * */5 *',   // every 5 seconds
    handler: (myTimer, context) => {
        context.log('Timer function processed request.');
    }
});
