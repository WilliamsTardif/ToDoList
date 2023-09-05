import express from "express";
import mongoose from "mongoose"

const app = express();
const port = 3000;
var todayDate = "";
var todayList = ["Bread", "Cheese", "coffee"];
var workList = [];
var futureList = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemSchema = mongoose.Schema ({
    name: {
        type: String,
        required: [true, 'Must have a name to be created.']
    }
});

const Item = mongoose.model("item", itemSchema);

// const programming = Item ({
//     name: "Learning programmation"
// });

// const play = Item ({
//     name: "Play video games"
// });

// const training = Item ({
//     name: "Go training"
// });

// programming.save();
// play.save();
// training.save();

app.get("/", (req, res) => {
    var date = getTodayDate();
    todayDate = date;
    const result = Item.find().exec();
    result.then((data) => {
        console.log(data);
        res.render("index.ejs",
            {
                date: todayDate,
                items: data,
            }
        )
    }); 
});

app.post("/add", (req, res) => {
    try {
        const newItem = Item ({
            name: req.body.task
        });
    
        newItem.save();    
    } catch(e) {
        console.log(e.message);
    }
    
    res.redirect('/')
});

app.get("/work", (req, res) => {
    res.render(
        "work.ejs",
        {
            items: workList,
        }
        );
});

app.post("/addWork", (req, res) => {
    workList.push(req.body.task);
    res.redirect('/work')
});

app.get("/future", (req, res) => {
    res.render(
        "future.ejs",
        {
            items: futureList
        }
    );
});

app.post("/addFuture", (req, res) => {
    futureList.push(req.body.task);
    res.redirect('/future')
});

app.listen(port, (req, res) => {
    console.log(`Listen on port: ${port}`);
});


function getTodayDate() {
    var date = new Date();
    var day = date.getDay();
    var month = getMonthName(date.getMonth());
    var year = date.getFullYear();
    return `${day} ${month} ${year}`;
}


function getMonthName(mounth) {
    var monthName = "January";
    switch(mounth) {
        case 1:
            monthName = "Fabuary";
            break;
        case 2:
            monthName = "March";
            break;
        case 3:
            monthName = "April";
            break;
        case 4:
            monthName = "May";
            break;
        case 5:
            monthName = "June";
            break;
        case 6:
            monthName = "July";
            break;
        case 7:
            monthName = "August";
            break;
        case 8:
            monthName = "September";
            break;
        case 9:
            monthName = "October";
            break;
        case 10:
            monthName = "November";
            break;
        case 11:
            monthName = "December";
            break;
    }
    return monthName;
}
 