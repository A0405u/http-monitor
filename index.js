const si = require('systeminformation');
const http = require('http');

const host = "localhost";
const port = 8988;

const server = http.createServer(function (request, response) {
    if (request.method == "GET") receiveGet(request, response);
});

server.listen(port);
console.log(`Listening at port ${port}`);

// Send all messages from file in response to GET
async function receiveGet(request, response) {
    console.log("Get request received!");

    response.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    });
    response.end(JSON.stringify(await getInfo()));
    console.log("Messages have been sent!");
}

async function getInfo() {
    try {

        const os = await si.osInfo();
        const temperature = await si.cpuTemperature();
        const memory = await si.mem();
        const load = await si.currentLoad();
        const processes = await si.processes();
        const services = await si.services('*');
        const fs = await si.fsSize();

        return {
            hostname: os.hostname,
            temperature: temperature.main,
            memory: [
                parseFloat((memory.total / 1073741824.0).toFixed(2)),
                parseFloat((memory.available / 1073741824.0).toFixed(2)),
                parseFloat((memory.active / 1073741824.0).toFixed(2)),
            ],
            os: [
                os.distro,
                os.release
            ],
            load: parseFloat(load.currentLoad.toFixed(2)),
            processes: {
                all: processes.all,
                running: processes.running,
                sleeping: processes.sleeping,
            },
            // services: services,
            fs: readFS(fs)
        };
    }
    catch(error) {
        console.error(error);
    }
}

function readFS(fs) {

    array = [];
    for (let device of fs) {
        let parsed = [
            device.fs,
            device.size,
            device.used,
            device.available
        ];
        array.push(parsed);
    } 
    return array;
}