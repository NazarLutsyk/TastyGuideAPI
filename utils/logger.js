module.exports = function (enable) {
    function log(msg, obj) {
        if (enable) {
            console.log("====================================================================");
            console.log("From:");
            console.log((new Error().stack).split("at ")[2].trim());
            console.log((new Error().stack).split("at ")[3].trim());
            if (arguments.callee.caller.name)
                console.log("Caller: " + arguments.callee.caller.name);
            if (msg)
                console.log("Message: " + msg);
            if (obj) {
                console.log("Metainfo: ");
                console.log(obj);
            }
        }
    }
    global.log = log;
};