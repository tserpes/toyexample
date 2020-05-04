# toyexample
An MVC-inspired multiplayer "game" for educational purposes. Part of the Web Development course at Harokopio University in Athens (http://www.dit.hua.gr)

Essentially it is only an attempt to have a server managing client connections and user actions by calculating the state of the model, i.e. one square for each user moving around. The client is receiving the model (array of objects) every 40 ms and draws them in a canvas.

"Installation"
Clone or download project and run 
npm install
so as to install the needed npm modules

"Execution"
npm start 
OR
nodejs server.js
run the client at http://localhost:3000/client.html 

The server is listening on port 3000 and the domain is hardcoded in the client's request for a websocket connection to "localhost". Make sure to adapt accordingly.