import * as express from 'express';
import * as path from 'path';
import * as compress from 'compression';

export let notesApp = express();

notesApp.use(compress());
notesApp.use(express.static(path.join(__dirname, '../../apps/notes/dist')));

notesApp.get('*', (req: any, res: any) => {
    res.sendFile(path.join(__dirname, '../../apps/notes/dist/index.html'));
});

