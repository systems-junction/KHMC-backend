const webpush = require("web-push");
const Subscription = require('../models/subscriber')
const StaffType = require('../models/staffType')
const User = require('../models/user')
const Notification = require('../models/notification')
const privateVapidKey = "s92YuYXxjJ38VQhRSuayTb9yjN_KnVjgKfbpsHOLpjc";
const publicVapidKey = "BOHtR0qVVMIA-IJEru-PbIKodcux05OzVVIJoIBKQu3Sp1mjvGkjaT-1PIzkEwAiAk6OuSCZfNGsgYkJJjOyV7k"
webpush.setVapidDetails(
  "mailto:pmdevteam0@gmail.com",
  publicVapidKey,
  privateVapidKey
);
var  notification = function ( title, message, type)
{
  const payload = JSON.stringify({ title: title,message:message });
  StaffType.findOne({type:type}).then((type, err) => {
    User.find({staffTypeId:type._id}).then((user,err)=>{
      var array = [];
      for(var j = 0; j<user.length; j++ )
        {
        array.push({
          userId:user[j]._id,
          read:false})          
        }
      Notification.create({
        title:title,
        message:message,
        sendTo:array
      }).then((test,err)=>{
      for(var i = 0; i<user.length; i++ )
        {
        Subscription.find({user:user[i]._id}, (err, subscriptions) => {
          if (err) {
            console.error(`Error occurred while getting subscriptions`);
            res.status(500).json({
              error: 'Technical error occurred',
            });
          } else {
            let parallelSubscriptionCalls = subscriptions.map((subscription) => {
              return new Promise((resolve, reject) => {
                const pushSubscription = {
                  endpoint: subscription.endpoint,
                  keys: {
                    p256dh: subscription.keys.p256dh,
                    auth: subscription.keys.auth,
                  },
                };
                const pushPayload = payload;
                webpush
                  .sendNotification(pushSubscription, pushPayload)
                  .then((value) => {
                    globalVariable.io.emit("get_data", test)
                    resolve({
                      status: true,
                      endpoint: subscription.endpoint,
                      data: value,
                    });
                  })
                  .catch((err) => {
                    reject({
                      status: false,
                      endpoint: subscription.endpoint,
                      data: err,
                    });
                  });
              });
            });
          }
        });
      }

    })//maybe wrong      
    })
  })
}

module.exports=notification