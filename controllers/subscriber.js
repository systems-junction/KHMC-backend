const Subscription = require('../models/subscriber')
const asyncHandler = require('../middleware/async');
exports.getSubscriber = asyncHandler(async (req, res) => {
    res.status(200).json({
        data: 'Invalid Request Bad',
      });
});

exports.postSubscriber = asyncHandler(async (req, res) => {
    const obj = {
        user: req.body.user,
        endpoint: req.body.subscription.endpoint,
        keys: req.body.subscription.keys,
      };
    const exist = await Subscription.findOne({user:req.body.user})
    if(exist)
      {
        await Subscription.deleteOne({user:req.body.user})
      }
    const subscriptionModel = new Subscription(obj);
    subscriptionModel.save((err, subscription) => {
        if (err) {
          console.error(`Error occurred while saving subscription. Err: ${err}`);
          res.status(500).json({
            error: 'Technical error occurred',
          });
        } else {
          res.json({
            data: 'Subscription saved.',
          });
        }
      });
});
