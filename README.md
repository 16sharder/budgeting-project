# Getting Started with this Budgeting Tool

This project was coded entirely by Sara Harder.

## Instructions for use

This project was designed with Visual Studio Code. It is recommended that you run this project there. 

This project also uses node JS version 16. \
Please download it at https://nodejs.org/en/download if you do not already have it installed. 

Remember to restart your computer after installation.

**

Once all software has been downloaded, open both the `master` and `rest` branches as two separate folders in your chosen IDE. 

In the `.env` file of the `rest` branch, exchange `<user>` and `<password>` with your own credentials in the MongoDB connect string. 

In the `src` folder of the `master` branch, open the `FetchFunctions.js` file in the `helperfuncs` folder. \
In lines 55 and 62, replace `xxxxxxxxxxxxxxxxxxxxxxxx` with your own api key from https://www.exchangerate-api.com. 

**
  
Open a new terminal and run `npm install` and `npm start` in both folders. \
This will open up a window with the website.
