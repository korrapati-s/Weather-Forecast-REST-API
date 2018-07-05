# Weather-REST-API

This application is about creating a REST API to GET, POST, DELETE the JSON object data rendered from a .csv file.

The routes to different functions of this application are:
1. /historical - To view the entire JSON data
2. /historical/date - To view the JSON data of a particular date
3. /historical/-date - To delete the JSON data of a particular date
4. /historical/{JSON data} - To add JSON data
5. /forecast/date - To view JSON data of 7 days starting from date

The application runs on Express framework set on top of NodeJS.
The modules installed for this application are: express path fs csvtojson.

The modules can be installed using Node Package Manager(npm) npm install

In order to set the application running, this command should be given to the terminal: node index.js


