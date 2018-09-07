const net = require('net');
var stdin = process.openStdin();

var clients = [];
const server = net.createServer(c => {
    clients.push(c);
    console.log('someone has connected, clients connected: ' + clients.length);
    c.on('end', () => {
        clients.splice(clients.findIndex(otherClient => otherClient === c), 1);
        console.log('client disconnected, clients connected: ' + clients.length);
    })
    c.on('data', data => { 
        //c.write("Server");
        console.log(data.toString());
    })

    stdin.addListener("data", d => c.write(d.toString()));
});

server.on('error', err => { throw err });
server.listen(8124, () => console.log('server running on port 8124...'))