const Thread = require('../models/Thread');
const User = require('../models/User');
const Message = require('../models/Message');

module.exports = {
    findThread: async (req, res) => {
        try {
            let currentUser = await User.findOne({
                username: req.user.username
            });
            let otherUser = await User.findOne({
                username: req.body.username
            });
            let thread = await Thread.findOne({
                users: {
                    $all: [currentUser._id, otherUser._id]
                }
            })

            if (!thread) {
                await Thread.create({
                    users: [currentUser._id, otherUser._id]
                })
            }

            res.redirect(`/thread/${otherUser.username}`)

        } catch (error) {
            console.log(error);
        }
    },

    openThread: async (req, res) => {
        try {
            let otherUser = await User.findOne({
                username: req.params.username
            });
            let thread = await Thread.findOne({
                users: {
                    $all: [req.user._id, otherUser._id]
                }
            });
            let messages = await Message.find({
                thread: thread._id
            });

            messages.forEach(message => {
                if (message.user.toString() !== req.user._id.toString()) {
                    message.isMine = true;
                }
                if (message.content.startsWith('http') &&
                    message.content.endsWith('.jpg') || message.content.endsWith('.png')) {
                    message.isImage = true;
                }
            });

            let otherIsBlocked = false;
            let amBlocked = false;
            if (otherUser.blockedUsers.includes(req.user.username)) {
                amBlocked = true;
            }
            if (req.user.blockedUsers.includes(req.params.username)) {
                otherIsBlocked = true;
            }

            res.render('threads/chatroom', {
                username: req.params.username,
                messages,
                threadId: thread._id,
                otherIsBlocked,
                amBlocked
            });
        } catch (error) {
            console.log(error);
        }
    },

    sendMessage: async (req, res) => {
        let content = req.body.message;
        let user = await User.findOne({
            username: req.params.username
        });
        let thread = req.body.threadId;

        try {
            await Message.create({
                content,
                user: user._id,
                thread
            });

            res.redirect('/thread/' + req.params.username);
        } catch (error) {
            console.log(error);
        }
    },

    removeThread: async (req, res) => {
        try {
            await Message.remove({
                thread: req.params.threadId
            });
            await Thread.findByIdAndRemove(req.params.threadId);
            res.redirect('/')
        } catch (error) {
            console.log(error);
        }
    }
}