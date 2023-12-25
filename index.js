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
            temperature: temperature,
            memory: memory,
            os: os,
            load: load,
            processes: processes,
            services: services,
            fs: fs,
        };
    }
    catch(error) {
        console.error(error);
    }
}
