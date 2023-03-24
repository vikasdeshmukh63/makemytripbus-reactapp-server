const express = require("express");
const app = express();
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
port = process.env.PORT || 5000;
app.use(express.json());

const usersRoute = require("./routes/usersRoute");
const busesRoute = require("./routes/busesRoute");
const bookingsRoute = require("./routes/bookingsRoute");

app.use("/api/users", usersRoute);
app.use("/api/buses",busesRoute);
app.use("/api/bookings",bookingsRoute);

app.listen(port, () => {
    console.log(`server is started on port ${port}`);
});


