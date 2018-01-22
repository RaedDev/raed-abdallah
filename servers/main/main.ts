import * as express from 'express';
import * as path from 'path';
import * as compress from 'compression';

export let mainApp = express();

mainApp.use(compress());
mainApp.use(express.static(path.join(__dirname, '../../apps/main/dist')));

mainApp.get('*', (req: any, res: any) => {
    res.sendFile(path.join(__dirname, '../../apps/main/dist/index.html'));
});

