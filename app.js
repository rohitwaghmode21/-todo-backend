const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

const loginRoutes = require("./routes/login");

app.use("/api/v1", loginRoutes);

main().catch((err) => console.log(err));
async function main(){
    await mongoose.connect("mongodb+srv://nitwrohit12345:Rohit12345@cluster0.mjzehea.mongodb.net/assignment?retryWrites=true&w=majority");
    console.log("Database connection sucessful....")
}

app.get("/", (req, res) => {
    res.send("Ok..")
})

app.listen(8080, () => {
    console.log("Server started at 8080 port...")
})