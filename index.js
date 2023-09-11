import express from "express";
import mongoose from "mongoose";
import _ from "lodash";

const app = express();
const port = 3000;
var title = "Today";

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-williams:Test123@cluster0.0pdib7y.mongodb.net/todolistDB");

const itemSchema = mongoose.Schema ({
    name: String
});

const Item = mongoose.model("item", itemSchema);

const listItemScehma = mongoose.Schema ({
    name: String,
    items: [itemSchema]
});

const List = mongoose.model('list', listItemScehma)




const programming = Item ({
    name: "Learning programmation"
});

const play = Item ({
    name: "Play video games"
});

const training = Item ({
    name: "Go training"
});

const defaultItem = [programming, play, training];

// programming.save();
// play.save();
// training.save();

app.get("/", (req, res) => {
    const result = Item.find().exec();
    result.then((data) => {
        renderIndex(res, title, data);
    }); 
});

app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    const result = List.findOne({name: customListName}).exec();
    result.then((data) => {
        if (data == null) {
            const list = new List({
                name: customListName,
                items: defaultItem
            });
        
            list.save();
            res.redirect("/" + customListName);
        } else {
            renderIndex(res, data.name, data.items)
        }
    });
}); 

function renderIndex(res, listName, items) {
    res.render("index.ejs", {
        listName: listName,
        items: items
    }
    )
}

app.post("/add", (req, res) => {
    const listName = req.body.list;
    const newItem = Item ({
        name: req.body.task
    });


    if (listName === "Today"){
        newItem.save();    
        res.redirect('/');
    } else {
        const result = List.findOne({name: listName}).exec();
        result.then(data => {
            data.items.push(newItem);
            data.save();
            res.redirect('/' + listName);
        });
    }
    
});

app.post("/delete", async (req, res) => {
    const checkedItemId = req.body.checkbox
    const listName = req.body.listName;
    await sleep(600);
    if (listName === "Today") {
        if (checkedItemId != null) {
            Item.findByIdAndDelete(checkedItemId).exec();
        }
        res.redirect('/')
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}).exec();
        res.redirect('/' + listName)
    }

    
});

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

app.listen(port, (req, res) => {
    console.log(`Listen on port: ${port}`);
});