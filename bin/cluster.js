let os = require('os');
let cluster = require('cluster');

if(cluster.isMaster){
    const cpus = os.cpus().length;
    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }
    cluster.on('exit',function (worker, code) {
        if(code !== 0 && !worker.exitedAfterDisconnect){
            cluster.fork();
        }
    });
}else {
    require('./www');
}