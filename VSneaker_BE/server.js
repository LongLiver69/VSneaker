const express = require("express");
require("dotenv").config();
const cors = require("cors");
const route = require("./routes");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
}); 