const app = require('./app');

/**
 * This file starts the server for the back end. 
 * If needed, you can change the port in the config file
 * 
 */

const { PORT } = require('./config');

app.listen(PORT, function() {
    console.log(`Starting server on port ${PORT}`);
});