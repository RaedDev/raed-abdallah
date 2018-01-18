import * as express from 'express';
import * as http from 'http';
import * as fs from 'fs';
import * as https from 'https';

var app = express();

var credentials;
try{
    var privateKey = fs.readFileSync('/etc/letsencrypt/live/raed-abdallah.com/privkey.pem', 'utf8');
    var certificate = fs.readFileSync('/etc/letsencrypt/live/raed-abdallah.com/fullchain.pem', 'utf8');
    
    credentials = { key: privateKey, cert: certificate };
}catch(e){}

app.get('*', (req, res) => {
    res.send("welcome!");
});

var httpServer = http.createServer(app);
httpServer.listen(80, () => {
    console.log(`http server running on port ${httpServer.address().port}`);
});

if(credentials)
{
    var httpsServer = https.createServer(credentials, app);
    httpsServer.listen(443, () => {
        console.log(`https server running on port ${httpServer.address().port}`);
    });
}



