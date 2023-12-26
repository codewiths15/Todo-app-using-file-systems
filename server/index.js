const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");

// app.use(express.json());
// app.get("/gettask", (req, res) => {
//   const dataobj = fs.readFileSync(`${__dirname}/data.json`, "utf-8");
//   const data = JSON.parse(dataobj);
//   console.log(data);
//   res.send(data);
// });

// //The addUser endpoint
// // Parse JSON request body

// const newData = {
//   task3: {
//     id: 13,
//     Name: "Home",
//     Time: "Home",
//     email: "saffron@gmail.com",
//   },
// };

// app.get("/addUser", (req, res) => {
//   // Write the updated merged data back to data.json

//   let existingData = {};

//   // Read existing data from data.json (if any)
//   try {
//     const data = fs.readFileSync("data.json", "utf8");
//     existingData = JSON.parse(data);
//   } catch (err) {
//     // File doesn't exist or is empty
//     console.error("Error reading data:", err);
//   }

//   // Merge the new data with existing data
//   var datal=req.params;
//   var word= datal.word;

//   existingData[word]=newData
//   fs.writeFileSync("data.json", JSON.stringify(existingData), "utf-8");
//   console.log('New data written');
// });

// app.listen(3000, () => {
//   console.log("Server is listening on port 3000");
// });

app.use(express.json());
app.use(cors({ origin: "*" }));

const tasks = JSON.parse(fs.readFileSync(`${__dirname}/data.json`));

app.get("/gettask", (req, res) => {
  res.status(200).send(tasks);
});

app.get("/gettask/:id", (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1; // to convert the id from array to string

  if (id > tasks.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid Id",
    });
  }
  const task = tasks.find((el) => el.id === id);
  res.status(200).send(task);
});

app.post("/addtask", (req, res) => {
  const newId = tasks[tasks.length - 1].id + 1;
  const newTask = Object.assign({ id: newId }, req.body);
  tasks.push(newTask);
  fs.writeFile(`${__dirname}/data.json`, JSON.stringify(tasks), (err) => {
    res.status(201).send(newTask);
  });

  // console.log(req.body);
  // res.send("done");
});

app.put("/updatetask/:id", (req, res) => {
  const id = req.params.id * 1; // Convert the id from string to a number

  // Check if the id is valid (within the range of tasks)
  if (id <= 0 || id > tasks.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid Id",
    });
  }

  const updatedTaskIndex = id - 1; // Adjust index to match array indexing (assuming task IDs start from 1)

  // Update the existing task with the new values from req.body
  tasks[updatedTaskIndex] = {
    ...tasks[updatedTaskIndex], // Maintain existing properties
    ...req.body, // Update with new properties/values
  };

  // Write updated tasks array to the file
  fs.writeFile(`${__dirname}/data.json`, JSON.stringify(tasks), (err) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Error updating task",
      });
    }
    res.status(200).json({
      status: "success",
      data: tasks[updatedTaskIndex], // Send the updated task in the response
    });
  });
});


app.delete('/deletetask/:id', (req, res) => {
  const id = req.params.id * 1; // Convert the id to a number

  if (id <= 0 || id > tasks.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id'
    });
  }

  const deletedTaskIndex = id - 1; // Adjust index to match array indexing (assuming task IDs start from 1)

  const deletedTask = tasks.splice(deletedTaskIndex, 1)[0]; // Remove task from array by index

  fs.writeFile(`${__dirname}/data.json`, JSON.stringify(tasks), (err) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Error deleting task'
      });
    }
    res.status(200).json({
      status: 'success',
      data: deletedTask // Send the deleted task in the response
    });
  });
});

app.listen(8000, () => {
  console.log("Server is listening on port 8000");
});
