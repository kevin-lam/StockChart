Stock Application
=================

### https://stock-chart-kevin-lam.herokuapp.com/


Files
-----

### Server-side

*server.js*: Main file which loads in required modules. Calls the routes(). Starts listening on specified port.

*routes.js*: Handles routing and end points. Directs GET, POST, DELETE to stockHandler.	

*stockHandler.server.js*: QUERY, POST, DELETE implementation.

*stockIDHandler.server.js*: GET implementation.

### Client-side

*cardController.client.js*: Handles any changes to stock card (eg. adding stock, removing stock, retrieving stock)

*chartController.client.js*: Handles any changes to the stock history chart. Also, defines chart options.

*socketService.client.js*: Wrapper for socket listener and emitter.

*stockService.client.js*: Intermediate service between cardController and chartController. Prepares data retrieved from database before sending it to chartController.


