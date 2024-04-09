(() => {
  port = 8080;
  // Import modules
  const express = require("express"),
    morgan = require("morgan"),
    fs = require("fs"),
    path = require("path"),
    bodyParser = require("body-parser"),
    uuid = require("uuid");
  // Assign functions
  const app = express(),
    accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
      flags: "a",
    });
  app.use(bodyParser.json());
  // TODO: Swagger Setup
  // API Documentation page route
  app.get("/documentation", (req, res) => {
    fs.readFile(
      path.join(__dirname, "public", "documentation.html"),
      "utf8",
      (err, data) => {
        if (err) {
          console.error("Error reading the documentation.html file:", err);
          return res.status(500).send("An error occurred");
        }
        const swaggerHtml = "<!-- Your Swagger UI HTML here -->";
        const finalHtml = data.replace(
          "<!-- Swagger UI Placeholder -->",
          swaggerHtml
        );
        res.send(finalHtml);
      }
    );
  });
  // Placeholders for DTO as JSON strings
  let users = [
    {
      Id: 1,
      Name: "Kim",
      FavModels: [],
    },
    {
      Id: 2,
      Name: "Joe",
      FavModels: ["Ring"],
    },
  ];
  let topModels = [
    {
      Title: "Ring",
      Description: "Jewelry",
      Category: {
        Name: "Product",
        Description: "Wearable Art",
      },
      Properties: {
        VertexCount: 141009,
        Materials: ["Physically Based"],
        FileSizeKB: 919,
      },
      Tags: [],
      ModelURL: "",
    },
    {
      Title: "Chair",
      Description: "Furniture",
      Category: {
        Name: "Product",
        Description: "Performative Design",
      },
      Properties: {
        VertexCount: 334908,
        Materials: ["PBM Corian - DuPont"],
        FileSizeKB: 1055,
      },
      Tags: [],
      ModelURL: "",
    },
    {
      Title: "DNA",
      Description: "Visualization",
      Category: {
        Name: "Tool",
        Description: "Grasshopper Plugin",
      },
      Properties: {
        VertexCount: 34060,
        Materials: [],
        FileSizeKB: 115,
      },
      Tags: [],
      ModelURL: "",
    },
  ];
  // Middleware-Chain: log, auth user, parse json, serve static, route app, handle err, listen req
  // Declaration: function(req, res, next) // Call/Invocation: app.use(function),
  app.use(morgan("combined", { stream: accessLogStream }));
  // Routing and Handling:
  // READ   Get a list of all models
  app.get("/models", (req, res) => {
    res.status(200).json(topModels);
  });
  // READ   Get data about a single model by title
  // (description, category, property, model URL, tags)
  app.get("/models/:title", (req, res) => {
    const { title } = req.params; //object restructuring syntax
    const model = topModels.find((m) => m.Title === title); //get from array
    if (model) res.status(200).json(model);
    else res.status(400).send("No model with this name found.");
  });
  // READ   Get data about a category by name (description)
  app.get("/models/category/:catName", (req, res) => {
    const { catName } = req.params;
    const model = topModels.find((m) => m.Category.Name === catName);
    if (model) res.status(200).json(model);
    else res.status(400).send("No model with this category name found");
  });
  // READ   Get data about a property by name (vertex count, materials, size)
  app.get("/models/properties/:material", (req, res) => {
    const { material } = req.params;
    const model = topModels.find((m) =>
      m.Properties.Materials.some((mat) =>
        mat.toLowerCase().includes(material.toLowerCase())
      )
    );
    if (model) res.status(200).json(model);
    else res.status(400).send(`No model with material ${material} found.`); //Corian
  });
  // CREATE Register a new user
  app.post("/users", (req, res) => {
    const user = req.body;
    if (!user.Name) res.status(404).send("A new user must at least have a name.");
    else if (users.find((u) => u.name === user.Name))
      res.status(402).send(`A user with the name ${user.Name} already exists.`);
    else{
      user.Id = uuid.v4();
      users.push(user);
      //res.send(`User created with id: ${user.Id}`);
      res.status(201).json(user);
    }
  });
  // UPDATE Update user info (username)
  app.put("/users/:id", (req,res)=>{
    const name = req.body.Name;
    if(!name) return res.status(400).send("Please provide a username in the request body.");
    const {id} = req.params;
    const user = users.find(u=>u.Id == id); //comp. num to string
    if (user) {
      user.Name = name;
      res.status(206).send(`User: "${id}" successfully renamed to: "${name}".`);
    } else res.status(404).send("No user under this id found to modify.");
  });
  // CREATE Add model to favorites (showing only a text that a model has been added)
  app.post("/users/:userId", (req,res)=>{
    const { userId } = req.params;
    const user = users.find(U=>U.Id == userId);
    if (!user) return res.status(404).send(`User with ID: ${userId} not found.`);    
    const model = req.body;
    if (!model.Title) return res.status(400).send("Model Name required.");
    if (!model.ModelURL) return res.status(400).send("ModelURL required.");
    if (model) {
      model.Id = uuid.v4();
      user.FavModels.push(model);
      res.status(201).send(`Model: ${model.Title} with the ID: ${model.Id} was added successfully to ${user.Name}'s FavModels.`);
    }
  });
  // DELETE Remove model from favorites (showing only a text that a model has been removed)
  app.delete("/users/:userId/:modelId", (req, res)=>{
    const { userId } = req.params;
    const user = users.find(U=>U.Id == userId);
    if (!user) return res.status(404).send(`User with ID: ${userId} not found.`);
    const { modelId } = req.params;
    const model = user.FavModels.find(m=>m.Id == modelId);
    if (!model) return res.status(404).send(`User ${user.Name} has no model with Id: ${modelId} in FavModels.`);
    user.FavModels = user.FavModels.filter(m=>m.Id !== modelId);
    res.status(200).send(`Model: ${model.Title} successfully removed from ${user.Name}'s FavModels.`);
  });
  // DELETE Deregister User (showing only a text that a user email has been removed)
  app.delete("users/:id",(req,res)=>{
    const { id } = req.params;
    const user = users.find(U=>U.Id == id);
    if (!user) return res.status(404).send(`User with ID: ${id} not found.`);
    users = users.filter(u=>u.Id !== id);
    res.status("200").send(`User ${user.Name} removed successfully.`);
  });
  // Express HTTP implementation: app.METHOD(PATH, HANDLER(responseLogic))
  app.get("/", (req, res) => res.send("Welcome to Modelverse API :)")); //root request
  app.use(express.static("public")); // Automatically routes all requests for static files to their corresponding files
  app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send("Something broke server-side..");
  }); // Error-handling middleware as last app use
  app.listen(port, () =>
    console.log(`This app awaits requests from port ${port}`)
  );
})();
