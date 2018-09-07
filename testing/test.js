const net = require('net');
var stdin = process.openStdin();

const NUM_OF_CLIENTS = 500;
var numOfRunningClients = 0;

for(var i = 0; i < NUM_OF_CLIENTS; i++){
    const client = net.createConnection({ host:'192.168.1.64', port: 8124 }, () => {
        numOfRunningClients++;
        console.log('connected! ' + numOfRunningClients);

        // stdin.addListener("data", d => {
        //     client.write('RAED: ' + d.toString());
        // });
        setInterval(() => {
            client.write('test data kjasdfkjldhfhd jkasdfhl kjsadfghadh fljkasdkjlf hsdkjhfglkasdj gf');
        }, 500);

    });

    client.on('data', data => {
        console.log(data.toString());
    })

    client.on('end', () => {
        console.log('disconnected');
    });
}