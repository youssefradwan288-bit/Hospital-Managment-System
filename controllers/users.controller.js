const { userModel } = require("../models/users.model");

const getUsers = (req, res) => {
  userModel
    .find({})
    .then((data) => {
      res.json({ massage: "users fetced", data });
    })
    .catch((err) => {
      console.log("error when get users", err);
    });
};

const addData = (req, res) => {
  userModel
    .create(req.body)
    .then((data) => {
      res.json({ massage: "users added"});
    })
    .catch((err) => {
      console.log("error when adding users", err);
    });
};

const updateData = (req, res) => {
  fs.readFileSync("./data.json", "utf8");

  const users = JSON.parse(data);

  users.push(req.body);

  fs.writeFile("./data.json", JSON.stringify(users), (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("File written successfully");
      res.send("post method");
    }
  });
};

const deleteData = (req, res) => {
  let data = fs.readFileSync("./data.json", "utf8");

  data = data.replace(req.body.name, "");

  fs.writeFileSync("./data.json", data);

  res.send("Name deleted successfully");
};

module.exports = { getUsers, addData, updateData, deleteData };
