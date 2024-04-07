(() => {
  port = 8080;
  // Import modules
  const express = require("express"),
    morgan = require("morgan"),
    fs = require("fs"),
    path = require("path"),
    bodyParser = require("body-parser");
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
      id: 1,
      name: "Kim",
      favMovies: [],
    },
    {
      id: 2,
      name: "Joe",
      favMovies: ["Apocalypse Now"],
    },
  ];
  let topModels = [
    {
      Title: "Ring",
      Description: "Jewelry",
      Category: {
        Name: "Product",
        Description: "Wearable Art"
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
        Description: "Performative Design"
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
        Description: "Grasshopper Plugin"
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
    const model = topModels.find(m=>m.Title === title); //get from array
    if (model) res.status(200).json(model);
    else res.status(400).send("No model with this name found.");
  });
  // READ   Get data about a category by name (description)
  app.get("/models/category/:catName", (req, res)=>{
    const {catName} = req.params;
    const model = topModels.find(m=>m.Category.Name === catName);
    if (model) res.status(200).json(model);
    else res.status(400).send("No model with this category name found");
  });
  // TODO: READ   Get data about a director by property (vertex count, materials, size)
  // TODO: CREATE Register a new user
  // TODO: UPDATE Update user info (username)
  // TODO: CREATE Add model to favorites (showing only a text that a model has been added)
  // TODO: DELETE Remove model from favorites (showing only a text that a model has been removed)
  // TODO: DELETE Deregister User (showing only a text that a user email has been removed)
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
