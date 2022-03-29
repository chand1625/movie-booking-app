const path = require("path");

const express = require("express");
const expressSession = require("express-session");

const createSessionConfig = require("./config/session");

const pageNotFoundMiddleware = require("./middlewares/pageNotFound.middleware");
const errorHandlerMiddleware = require("./middlewares/errorHandler.middleware");
const { checkAuthentication } = require("./middlewares/checkAuth.middleware");

const authRoutes = require("./routes/auth.routes");
const baseRoutes = require("./routes/base.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const { json } = require("express/lib/response");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.static("poster-images"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));

app.use(checkAuthentication);

app.use(baseRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(adminRoutes);

app.use(pageNotFoundMiddleware);

app.use(errorHandlerMiddleware);

app.listen(8080);
