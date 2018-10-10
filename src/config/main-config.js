require("dotenv").config();
const path = require("path");
const logger = require("morgan");

module.exports = {
    init(app, express) {
        app.use(express.static(path.join(__dirname, "..", "assets")));
        app.use(logger('dev'));
    }
};