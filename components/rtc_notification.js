const webpush = require('web-push');
const Subscription = require('../models/subscriber');
const StaffType = require('../models/staffType');
const User = require('../models/user');
const Notification = require('../models/notification');
const privateVapidKey = 's92YuYXxjJ38VQhRSuayTb9yjN_KnVjgKfbpsHOLpjc';
const publicVapidKey =
  'BOHtR0qVVMIA-IJEru-PbIKodcux05OzVVIJoIBKQu3Sp1mjvGkjaT-1PIzkEwAiAk6OuSCZfNGsgYkJJjOyV7k';
webpush.setVapidDetails(
  'mailto:pmdevteam0@gmail.com',
  publicVapidKey,
  privateVapidKey
);
var notificationRTC = function (title, message, id, route) {
  const payload = JSON.stringify({
    title: title,
    message: message,
    route: route,
  });
  User.findOne({ _id: id }).then((user, err) => {
    var array = [];
    array.push({
      userId: user._id,
      read: false,
    });
    Notification.create({
      title: title,
      message: message,
      route: route,
      sendTo: array,
    }).then((test, err) => {});
    Subscription.find({ user: user._id }, (err, subscriptions) => {
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
                Notification.find({ 'sendTo.userId': user._id })
                  .populate('sendTo.userId')
                  .limit(1)
                  .sort({ $natural: -1 })
                  .then((not, err) => {
                    globalVariable.io.emit('get_data', not);
                  });
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
  });
};

module.exports = notificationRTC;
