// backend.js
import express from "express";
import cors from "cors";

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

const app = express();
const port = 8000;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const findUserByName = (name) => {
    return users["users_list"].find(
        (user) => user["name"] === name
    );
};

const findUserById = (id) => {
    return users["users_list"].find(
        (user) => user["id"] === id
    );
};

const findUserByJob = (job) => {
    return users["users_list"].find(
        (user) => user["job"] === job
    );
};

app.get("/users", (req, res) => {
    const name = req.query.name; // or req.query["name"]
    if (name != undefined) {
        let result = findUserByName(name);
        result = { users_list: result };
        res.send(result);
    } else {
        res.send(users);
    }
});

app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; // or req.params.id
    let result = [];
    result[0] = findUserById(id);
    result[1] = findUserByName(id);
    result[2] = findUserByJob(id);
    console.log(result);

    // if any of the searches have something, send it
    // otherwise, send 404
    for (let i = 0; i < result.length; i++) {
        if (result[i] !== undefined) {
            res.send(result[i]);
            return;
        }
    }
    res.status(404).send("Resource not found");
});

const newId = () => {
    const strs = "abcdefghijklmnopqrstuvwxyz";
    const nums = "0123456789";
    let id = "";
    for (let i = 0; i < 6; i++) {
        if (i < 3)
            id += strs.charAt(Math.floor(Math.random() * strs.length));
        else
            id += nums.charAt(Math.floor(Math.random() * nums.length));
    }
    return id;
}

const addUser = (user) => {
    users["users_list"].push(user);
    return user
};

app.post("/users", (req, res) => {
    const newUser = req.body;
    newUser["id"] = newId();
    addUser(newUser);
    res.status(201).send(newUser); // Content created
});

app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    const result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found");
    } 
    else {
        // remove user by creating new list without that user
        users["users_list"] = users["users_list"].filter(
            (user) => user["id"] !== id
        );
        res.status(204).send(); // Delete successful, no content
    }
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});