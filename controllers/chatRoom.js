const asyncHandler = require('../middleware/async');
const ChatRoom = require('../models/chatRoom');

exports.getChat = asyncHandler(async (req, res) => {
  const chat = await ChatRoom.findOne({_id:req.params.id})
  res.status(200).json({ success: true, data: chat });
});

exports.createChat = asyncHandler(async (req, res) => {
    const checkChat = await ChatRoom.findOne({
        participant1: {$in: [req.body.sender, req.body.receiver]},
        participant2: {$in: [req.body.sender, req.body.receiver]}})
    if(checkChat)
    {
        res.status(200).json({ success: true, data: checkChat})
    }
    else{
    const chat = await ChatRoom.create({
        participant1:req.body.sender,
        participant2:req.body.receiver,
        chat:[]
      })
      res.status(200).json({ success: true, data: chat });
    }

  });
  exports.deleteChat = asyncHandler(async (req, res) => {
    const chat = await ChatRoom.deleteOne({_id:req.params.id})
    res.status(200).json({ success: true, data: {} });

  });