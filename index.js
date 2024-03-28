// const express = require('express');
// const app = express();


// app.use("/api", require('./Route'))


// app.listen(3050, () => {
//     console.log("Server Started")
// })

const express = require('express');
const app = express();
// const bodyParser = require('body-parser'); // Import body-parser middleware

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Routes setup
app.use("/api", require('./routes'));

app.listen(3050, () => {
    console.log("Server Started")
});
