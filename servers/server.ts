import * as express from 'express';
import * as vhost from 'vhost';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import { trackApp } from './track/track';
import { mainApp } from './main/main';
import { notesApp } from './notes/notes'

var app = express();

//=========================== SSL certificates ====================================
var credentials;
try{
    var privateKey = fs.readFileSync('/etc/letsencrypt/live/www.raed-abdallah.com/privkey.pem', 'utf8');
    var certificate = fs.readFileSync('/etc/letsencrypt/live/www.raed-abdallah.com/fullchain.pem', 'utf8');
    
    credentials = { key: privateKey, cert: certificate };
}catch(e){}
//=================================================================================

// ======================================= Server setup ===================================
var domain = 'localhost';
//var domain = 'raed-abdallah.com';

app.use(vhost(`${domain}`, mainApp));
app.use(vhost(`www.${domain}`, mainApp));
//app.use(vhost(`track.${domain}`, trackApp));
//app.use(vhost(`notes.${domain}`, notesApp));

//===================== Creating server and forwarding to https ============================
var httpServer = http.createServer((req: http.ServerRequest, res: http.ServerResponse) => {
    if(credentials) {
        res.writeHead(301, { location: 'https://' + req.headers.host + req.url });
        res.end();
        
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



