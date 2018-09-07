import * as mongo from 'mongodb';
import { Answer } from '../../apps/track/src/app/classes/answer';
import { User } from '../../apps/track/src/app/classes/user';
import { Question } from '../../apps/track/src/app/classes/question';

var answer: Answer;
var db: mongo.Db;

let USERS: User[] = [
    {email: "test@test.com"},
    {email: "anotherone@gmail.com"},
    {email: "raed.dev@gmail.com"}
]

let QUESTIONS: Question[] = [
    {question: "Rate your day out of 10", frequency: {timeframe: "day", times: 1}, isPublic: false, type: "radio"},
    {question: "What is your favourate color", frequency: {timeframe: "once", times: 1}, isPublic: true, type: "radio"},
    {question: "How many pages did you read?", frequency: {timeframe: "week", times: 1}, isPublic: false, type: "radio"},
    {question: "Discribe your day in maximum 3 words", frequency: {timeframe: "day", times: 1}, isPublic: false, type: "text"},
    {question: "What is more important softskils or hardskills?", frequency: {timeframe: "once", times: 1}, isPublic: false, type: "text"}
]

let ANSWERS: Answer[] = [
    {answer: "some answer"},
    {answer: "some another answer"},
    {answer: "answer 1"},
    {answer: "answer 2"},
    {answer: "answer 3"},
    {answer: "answer 4"},
    {answer: "answer 5"},
    {answer: "answer 6"},
    {answer: "answer 7"},
    {answer: "answer 8"},
    {answer: "answer 9"},
]

export function runTest(_db: mongo.Db){
    console.log('test running');
    db = _db;
    process.stdin.addListener("data", d => {
        if(d.includes("questions")){
            db.collection('questions').find({}).toArray((err, data) => {
                if(err) { console.log(err); return; }
                data.forEach(d => {
                    console.log(d);
                })
            });
        }else if(d.includes("answers")){
            db.collection('answers').aggregate([{$lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }}, {$project: { answer: 1, user: 1 }}]).toArray((err, data) => {
                if(err) { console.log(err); return; }
                data.forEach(d => {
                    console.log(d);
                })
            });
        }
    });

    clearAll().then(() => {
        return createUsers();
    }).then(users => {
        return createQuestions(users).then(questions => {
            return createAnswers(users, questions);
        })
    }).then(answers => {
        console.log("done");
    });
}

function clearAll(): Promise<any>{
    return db.dropCollection("users").then(() =>{
        db.dropCollection("questions")
    }).then(() => {
        db.dropCollection("answers")
    })
}

function createUsers(): Promise<any> {
    return db.collection("users").insert(USERS);
}

function createQuestions(users: mongo.InsertOneWriteOpResult): Promise<any>{
    // pick a user to be the one who created this 
    QUESTIONS.forEach(q => {
        q.userId = users.ops[Math.floor(Math.random() * users.ops.length)]._id;
    })

    return db.collection("questions").insert(QUESTIONS);
}

function createAnswers(users: mongo.InsertOneWriteOpResult, questions: mongo.InsertOneWriteOpResult): Promise<any> {
    // pick a user to be the one who created this and a question 

    for(var i = 0; i < ANSWERS.length; i++) {
        let a: Answer = ANSWERS[i];
        
        let qId = questions.ops[Math.floor(Math.random() * questions.ops.length)]._id;
        db.collection("questions").update({_id: qId}, { $push: { answers: a }});

        a.userId = users.ops[Math.floor(Math.random() * users.ops.length)]._id;
        a.questionId = qId;
    }

    return db.collection("answers").insert(ANSWERS);
}
