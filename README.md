# Getting Started with this Budgeting Tool

Project Author: Sara Harder

## Project Description

This project was created to help people keep track of all of their expenses in one place. 

The monthly table gives a clear view of what the user has spent on different categories of expenses during the current month. This allows the user to observe if they are spending too much money on any particular category. By being actively aware of what they are spending, the user is less likely to spend excessively, and more likely to budget appropriately.

This tool does not give any advice on how to budget; it does not provide recommendations for how much the user should spend in each category. Instead, it just shows the user the numbers as they stand, so that the user themselves can decide how much they should spend, and so that they are conscious of their current expenses.

There is some dedication required on the part of the user in order to use this tool properly. Each expense must be manually entered, and the website does not have any access to the user's actual bank account. Manual entry of each expense also helps to reinforce the expense in the user's mind, so that they are even more aware of what they have spent.

The user is now also able to view their previous monthly spendings. See how much your budgeting has improved by comparing your spendings from two months ago to your spendings this month, for example. You can see your weekly spendings and specific entries from your previous months as well, just like you can with the current month.

Currently the budgeting tool allows you to use euros and dollars, and also allows for several bank accounts. Users who have bank accounts with different companies will find this useful, since they can keep track of all of their expenses, without having to switch between apps to look at different accounts. It also allows you to indicate transfers between your own bank accounts, with a specified exchange rate when transfering between currencies.

The tool also allows for up to two users to be added to one bank account, so that spouses can both keep track of their joint bank accounts. Since they are two separate users, a user can't see their spouse's personal accounts; they can only see the accounts that they share.

## Coming Soon

Other features that will be added in the near future include:\
    --Allow for editing and deleting entries\
    --View your average monthly spendings, based on the last year or the last 6 months\
    --Automatically keep track of bills that stay the same each month (think rent, cell phone plan)
    
Please comment any other suggestions you have in the enhancement issue section!

## Instructions for Installation

This project was designed with Visual Studio Code. It is recommended that you run this project there. 

This project also uses node JS version 16. \
Please download it at https://nodejs.org/en/download if you do not already have it installed. 

Remember to restart your computer after installation.

**

Once all software has been downloaded, open both the `master` and `rest` branches as two separate folders in your chosen IDE. 

In the `.env` file of the `rest` branch, exchange `<user>` and `<password>` with your own credentials in the MongoDB connect string. 

In the `src` folder of the `master` branch, open the `FetchFunctions.js` file in the `helperfuncs` folder. \
In lines 55 and 62, replace `xxxxxxxxxxxxxxxxxxxxxxxx` with your own api key from https://www.exchangerate-api.com.

Make sure that both files have been saved to reflect these changes.

**
  
Open a new terminal and run `npm install` and `npm start` in both folders. \
This will open up a window with the website.
