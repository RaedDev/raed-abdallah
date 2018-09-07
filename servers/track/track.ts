import * as express from 'express';
import * as mongo from 'mongodb';
import { runTest } from './db-test';

export let trackApp = express();
mongo.MongoClient.connect('mongodb://localhost:27017', function(err, client){
    if(err) { console.log(err); return; }
    console.log('connected to the database successfully.');

    const db = client.db('track');

    runTest(db);
});

trackApp.get('*', (req: any, res: any) => {
    res.send("welcome to the track app");
});