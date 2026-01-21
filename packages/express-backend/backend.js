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

app.get("/users/id/:id", (req, res) => {
    const id = req.params["id"]; // or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found");
    }
    else {
        res.send(result);
    }
});

app.get("/users/name/:name", (req, res) => {
    const name = req.params["name"]; // or req.params.name
    let result = findUserByName(name);
    if (result === undefined) {
        res.status(404).send("Resource not found");
    }
    else {
        res.send(result);
    }
});

app.get("/users/job/:job", (req, res) => {
    const job = req.params.job; // or req.params["job"]
    let result = findUserByJob(job);
    if (result === undefined) {
        res.status(404).send("Resource not found");
    }
    else {
        res.send(result);
    }
});

const addUser = (user) => {
    users["users_list"].push(user);
    return user
};

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd)
    res.send();
});

app.delete("/users/id/:id", (req, res) => {
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
        res.send();
    }
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});