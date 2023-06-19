const app = require("express")();
const server = require("http").createServer(app);
const port = process.env.PORT || 4001;
// var robot = require("robotjs");

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

var users = {};

var allUsers = [];

io.on("connection", (socket) => {
    socket.on("connected", function (prop) {
        try {
            io.emit("connectedUsers", prop.user)

            const room = prop?.room

            if (allUsers[room]) {
                allUsers[room].push(prop.user)
            }
            else {
                allUsers[room] = []
                allUsers[room].push(prop.user)
            }


            const userId = prop.user?.userId
            if (users[room]) {
                users[room][userId] = socket.id
            }
            else {

                users[room] = {}
                users[room][userId] = socket.id
            }
        } catch (error) {

        }

    });

    socket.on("getUsers", function (prop) {
        try {
            for (const [key, value] of Object.entries(users[prop?.room])) {
                io.to(value).emit("getAllUsers", allUsers[prop?.room])
            }
        } catch (error) {

        }

    })

    socket.on("canvas-data", async (prop) => {
        try {
            for (const [key, value] of Object.entries(users[prop?.room])) {
                io.to(value).emit("canvas-data", prop.data)
            }
        } catch (error) {

        }

    })

    socket.on("shareTrack", function (prop) {
        try {
            for (const [key, value] of Object.entries(users[prop?.room])) {
                io.to(value).emit("shareTrack", prop)
            }
        } catch (error) {

        }
    })
    socket.on("check-user", function (prop) {
        try {
            let checkExistUser = Object.values(users).find((ele) => Object.keys(ele).find((ele) => ele == prop.id))
            if (checkExistUser) {
                io.to(checkExistUser[prop.id]).emit("check-user", true)
            }
        } catch (error) {
            console.log("user not found")
        }


    })
    socket.on("requestShare", async function (data) {
        try {

            io.to(users[data?.room][data.id]).emit("requestShare", data)
        } catch (error) {
            console.log(error)
        }
    });
    socket.on("requestRejected", async function (data) {
        try {
            for (const [key, value] of Object.entries(users[data?.room])) {
                io.to(value).emit("requestRejected", data?.id)
            }
        } catch (error) {

        }
    });

    socket.on("requestCameraTurnOn", async function (data) {
        try {

            io.to(users[data?.room][data.id]).emit("requestCameraTurnOn", data)
        } catch (error) {
            console.log(error)
        }
    });

    socket.on("muteVideo", async function (data) {
        try {
            io.to(users[data?.room][data.id]).emit("muteVideo", data)
        } catch (error) {
            console.log(error)
        }
    });

    socket.on("requestMicTurnOn", async function (data) {
        try {

            io.to(users[data?.room][data.id]).emit("requestMicTurnOn", data)
        } catch (error) {
            console.log(error)
        }
    });

    socket.on("muteAudio", async function (data) {
        try {
            for (const [key, value] of Object.entries(users[data?.room])) {
                io.to(value).emit("muteAudio", data)
            }
        }
        catch (err) {
            console.log(err)
        }
    });

    socket.on("unmuteAudio", async function (data) {
        try {
            for (const [key, value] of Object.entries(users[data?.room])) {
                io.to(value).emit("unmuteAudio", data)
            }
        }
        catch (err) {
            console.log(err)
        }
    });

    socket.on("clear", async function (prop) {
        try {
            for (const [key, value] of Object.entries(users[prop?.room])) {
                io.to(value).emit("clear", prop.data)
            }
        }
        catch (err) {

        }
    })

    socket.on("allow-annotate", async = (prop) => {
        try {
            for (const [key, value] of Object.entries(users[prop?.room])) {

                io.to(value).emit("allow-annotate", prop)
            }
        } catch (error) { }
    })
    socket.on("open-whiteboard", async function (prop) {
        try {
            for (const [key, value] of Object.entries(users[prop?.room])) {
                io.to(value).emit("open-whiteboard", prop.data)
            }
        } catch (error) {

        }
    });

    socket.on("sendEvent", async function (data) {
        try {
            io.to(users[data?.room][data.leadTeacherId]).emit("thumbsReceived", data)
        } catch (error) {

        }
    });
    socket.on("mute", async function (prop) {
        try {
            for (const [key, value] of Object.entries(users[prop?.room])) {

                io.to(value).emit("mute", prop)
            }

        } catch (error) {

        }
    });
    socket.on("stillMuteCamera", async function (prop) {
        try {
            for (const [key, value] of Object.entries(users[prop?.room])) {
                io.to(value).emit("stillMuteCamera", prop?.id)
            }
        } catch (error) {

        }

    })

    socket.on("stillMuteMic", async function (prop) {
        try {
            for (const [key, value] of Object.entries(users[prop?.room])) {
                io.to(value).emit("stillMuteMic", prop?.id)
            }
        } catch (error) {

        }

    })
    socket.on("sendScratchLinktoAll", async function (data) {
        try {
            for (const [key, value] of Object.entries(users[data?.room])) {
                io.to(value).emit("scratchReceived", data)
            }
        } catch (error) {

        }
    });

    socket.on("sendScratchLink", async function (data) {
        try {
            io.to(users[data?.room][data?.user?.userId]).emit("scratchReceived", data)
        } catch (error) {

        }
    });

    socket.on("ScratchCloseToAll", async function (prop) {
        try {
            for (const [key, value] of Object.entries(users[prop?.room])) {
                io.to(value).emit("ScratchCloseToAll", prop.data)
            }
        } catch (error) {

        }
    })


    socket.on("scratchCloseforUser", async function (data) {
        try {
            io.to(users[data?.room][data.userId]).emit("scratchCloseforUser", data)
        } catch (error) {

        }
    });

    socket.on("popQuestionsToAll", async function (prop) {
        try {
            for (const [key, value] of Object.entries(users[prop?.room])) {
                io.to(value).emit("popQuestionsToAll", prop.question)
            }
        } catch (error) {

        }

    })

    socket.on("closeQuestionsToAll", async function (prop) {
        try {
            for (const [key, value] of Object.entries(users[prop?.room])) {

                io.to(value).emit("closeQuestionsToAll", prop.data)
            }
        } catch (error) {

        }

    });

    socket.on("sendAnswer", async function (params) {
        try {
            io.to(users[params?.room][params.leadTeacherId]).emit("AnswerReceived", params)
        } catch (error) {

        }

    });

    socket.on("popToAll", async function (prop) {
        try {
            for (const [key, value] of Object.entries(users[prop?.room])) {
                io.to(value).emit("popToAll", prop.data)
            }
        } catch (error) {

        }

    });
    socket.on("shareStatsToAll", async function (prop) {
        try {
            for (const [key, value] of Object.entries(users[prop?.room])) {
                io.to(value).emit("shareStatsToAll", prop)
            }
        } catch (error) {

        }



    });
    socket.on("closeStatsToAll", async function (prop) {
        try {
            for (const [key, value] of Object.entries(users[prop?.room])) {
                io.to(value).emit("closeStatsToAll", prop.data)
            }
        } catch (error) {

        }

    });
    socket.on("shareAnswers", async function (prop) {

        try {
            for (const [key, value] of Object.entries(users[prop?.room])) {
                io.to(value).emit("shareAnswers", prop)
            }
        } catch (error) {

        }


    });
    socket.on("closeAnswers", async function (prop) {
        try {
            for (const [key, value] of Object.entries(users[prop?.room])) {
                io.to(value).emit("closeAnswers", prop.data)
            }
        } catch (error) {

        }


    });

    socket.on("ended", async function (params) {
        try {
            delete users[params?.room][params?.user]
            allUsers[params?.room] = allUsers[params?.room].filter((e) => e.userId !== params?.user)
            for (const [key, value] of Object.entries(users[params?.room])) {
                io.to(value).emit("getAllUsers", allUsers[params?.room])
            }

        } catch (error) {

        }

    })

    socket.on("screenClosed", async function (params) {
        try {
            for (const [key, value] of Object.entries(users[params?.room])) {
                io.to(value).emit("screenClosed", params?.id)
            }
        } catch (error) {

        }

    })

    socket.on("disconnect", (data) => {
        try {
            for (const [key, value] of Object.entries(users)) {
                for (const [_key, _value] of Object.entries(value)) {
                    if (_value === socket.id) {
                        delete users[key][_key]
                        allUsers[key] = allUsers[key].filter((e) => e.userId !== parseInt(_key))
                        for (const [__key, __value] of Object.entries(users[key])) {
                            io.to(__value).emit("getAllUsers", allUsers[key])
                        }
                    }
                }
            }
        } catch (error) {
        }

    });
});
server.listen(port, () => console.log(`Listening on port ${port}`));