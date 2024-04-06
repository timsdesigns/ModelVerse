(() => {
  port = 8080;
  // Import modules
  const express = require("express"),
    morgan = require("morgan"),
    fs = require("fs"),
    path = require("path");
  // Assign functions
  const app = express(),
  accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"),{
    flags: "a",
  });
  // TODO: Swagger Setup

  // API Documentation page route
  app.get('/documentation', (req, res) => {
    fs.readFile(path.join(__dirname, 'public', 'documentation.html'), 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading the documentation.html file:', err);
        return res.status(500).send('An error occurred');
      }
      const swaggerHtml = '<!-- Your Swagger UI HTML here -->';
      const finalHtml = data.replace('<!-- Swagger UI Placeholder -->', swaggerHtml);
      res.send(finalHtml);
    });
  });
  // TODO: Placeholders for DTO as JSON strings
  // TODO: Middleware-Chain: log, auth user, parse json, serve static, route app, handle err, listen req
  app.use(morgan("combined", { stream: accessLogStream }));
  // TODO: Declaration: function(req, res, next) // Call/Invocation: app.use(function),
  // TODO: Routing and Handling:
  // TODO: READ   Get a list of all models
  // TODO: READ   Get data about a single model by title
  // TODO:  (description, category, property, model URL, whether it’s featured or not)
  // TODO: READ   Get data about a category by name (description)
  // TODO: READ   Get data about a director by property (vertex count, materials, size)
  // TODO: CREATE Register a new user
  // TODO: UPDATE Update user info (username)
  // TODO: CREATE Add model to favorites (showing only a text that a model has been added)
  // TODO: DELETE Remove model from favorites (showing only a text that a model has been removed)
  // TODO: DELETE Deregister User (showing only a text that a user email has been removed)
  // Express HTTP implementation: app.METHOD(PATH, HANDLER(responseLogic))
  app.get("/", (req, res)=> res.send("Welcome to Modelverse API :)") ); //root request
  app.use(express.static("public")); // Automatically routes all requests for static files to their corresponding files
  app.use((err, req, res, next)=>{
    console.log(err.stack);
    res.status(500).send("Something broke server-side..");
  }); // Error-handling middleware as last app use 
  app.listen(port, ()=> console.log(`This app awaits requests from port ${port}`));
})();
