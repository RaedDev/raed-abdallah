import * as express from 'express';

export let trackApp = express();

trackApp.get('*', (req: any, res: any) => {
    res.send("welcome to the track app");
});