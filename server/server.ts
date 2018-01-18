import * as express from 'express';
import * as http from 'http';
import * as fs from 'fs';
import * as https from 'https';
import { ServerResponse } from 'http';

var app = express();

var credentials;
try{
    var privateKey = fs.readFileSync('/etc/letsencrypt/live/raed-abdallah.com/privkey.pem', 'utf8');
    var certificate = fs.readFileSync('/etc/letsencrypt/live/raed-abdallah.com/fullchain.pem', 'utf8');
    
    credentials = { key: privateKey, cert: certificate };
}catch(e){}

app.get('*', (req, res) => {
    if(req.subdomains.find(s => s === 'eureka')) {
        res.send('you are in eureka subdomain');        
    } else if(req.subdomains.find(s => s === 'track')) {
        res.send('you are in track subdomain');        
    } else if(req.subdomains.find(s => s === 'elshelle')) {
        res.send('you are in elshelle subdomain');        
    } else {
        res.send("welcome to raed abdallah's website");
    }
});

var httpServer = http.createServer((req: any, res: any) => {
    if(credentials) {
        res.redirect('https://' + req.headers.host + req.url);
        return;
    }
    app(req, res);
});
httpServer.listen(80, () => {
    console.log(`http server running on port ${httpServer.address().port}`);
});

if(credentials)
{
    var httpsServer = https.createServer(credentials, app);
    httpsServer.listen(443, () => {
        console.log(`https server running on port ${httpsServer.address().port}`);
    });
}



