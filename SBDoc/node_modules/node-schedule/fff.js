var schedule = require('./');

// Create new cron for each iteration (creating 1-10 mins)
//for (var x = 1; x<10; x++){
//      var rule = new schedule.RecurrenceRule();
//      rule.minute = new schedule.Range(0, 59, x);
//      schedule.scheduleJob(rule, function() {
//     // Can I access the RULE which is being executed NOW somehow?!
//        console.log(this);
//     });
//}

var job = schedule.scheduleJob('* * * * * *', function() {
  console.log(this.spec);
});

job.spec = '* * * * * *';

