const mongoose = require("mongoose");

mongoose.connect(process.env.mongo_url);

const db = mongoose.connection;

db.on("connected",()=>{
    console.log("connected to mongodb database");
});

db.on("error",()=>{
    console.log("database connection failed");
});
