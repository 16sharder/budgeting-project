import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import * as entries from './budget_model.mjs';

const app = express()

const PORT = process.env.PORT;

app.use(express.json());




function isMonthValid(date) {
    // checks that the month does not make the date an impossible date

    // month can't be greater than 12, so first digit can't be greater than 1
    if (parseInt(date[0]) > 1) return false

    // if first digit is 1, second digit can't be higher than 2
    if (parseInt(date[0]) == 1){
        if (parseInt(date[1]) > 2) return false
    }

    // if first digit is not 1, it must be 0, and the second digit can't also be 0
    else if (parseInt(date[1]) == 0) return false

    // otherwise return True
    return true
}

function isDayValid(date) {
    // checks that the month does not make the date an impossible date

    // day can't be greater than 31, so first digit can't be greater than 3
    if (parseInt(date[3]) > 3) return false

    // if the month is february, the date can't be higher than 29
    if (parseInt(date[0] == 0) && parseInt(date[1] == 2)){
        if (parseInt(date[3] > 2)) return false
    }

    // if first digit is 3, second digit can't be higher than 1 or 0, depending on month
    if (parseInt(date[3]) == 3){

        if (parseInt(date[4]) > 1) return false

        if (parseInt(date[0] == 1) && parseInt(date[1] == 1)){
            if (parseInt(date[4]) > 0) return false 
        }

        if (parseInt(date[1]) == 4 || parseInt(date[1]) == 6 || parseInt(date[1]) == 9){
            if (parseInt(date[4]) > 0) return false
        }
    }

    // if first digit is 0, second digit can't also be 0
    if (parseInt(date[3]) == 0){
        if (parseInt(date[4]) == 0) return false
    }

    // otherwise return True
    return true
}

function checkValidity(account, category, currency, amount, date, description) {
    // checks the validity of a body object

    if (! isMonthValid(date)) return false
    if (! isDayValid(date)) return false
    else return true
}


app.post("/entries", asyncHandler(async(req, res, next) => {
    // uses createEntry function from model to make a new entry with given criteria
    // returns the entry object


    // if body is valid, creates a new entry
    {
        const entry = await entries.createEntry(req.body.account, req.body.category, req.body.currency, req.body.amount, req.body.date, req.body.month, req.body.description)
        res.type("application/json").status(201).send(entry)
}}))



app.get("/entries", asyncHandler(async(req, res, next) => {
    // uses getAllEntries function from model to return all entries in the database
    const entryes = await entries.getAllEntries()
    res.type("application/json").status(200).send(entryes)
}))

app.get("/entries/:date", asyncHandler(async(req, res, next) => {
    // uses findEntries function from model to return all entries of the given date
    const request = req.params.date
    const entryes = await entries.findEntries({$or: [{date: request},{month: request}]}, (error, data)=> {return {amount: 0, date: null}})
    res.type("application/json").status(200).send(entryes)
}))


app.put("/entries/:id", asyncHandler(async(req, res, next) => {
    // uses updateEntry function from model to update an entry given its id and the values to update
    // returns a count of modified entries
    const request = {_id: req.params.id}

    if (checkValidity(req.body.account, req.body.category, req.body.currency, req.body.amount, req.body.date, req.body.description) === false){
        res.type("application/json").status(400).send({Error: "Invalid date"})
    }
    else {
        const entry = await entries.updateEntry(request, req.body)
        if (entry === null) {
            res.type("application/json").status(404).send({Error: "Not found"})
        }
        else res.type("application/json").status(200).send(entry)
}}))

app.delete("/entries/:id", asyncHandler(async(req, res, next) => {
    // uses deleteEntry function from model to delete the entry of the given id
    // returns a count of deleted entries
    const request = {_id: req.params.id}
    const count = await entries.deleteEntry(request)
    if (count === 0){
        res.type("application/json").status(404).send({Error: "Not found"})
    }
    else res.status(204).send()
}))








app.post("/accounts", asyncHandler(async(req, res, next) => {
    // uses createAccount function from model to make a new account with given criteria
    // returns the account object
    
    // if body is not valid, sends an error (substitute)
    // if (checkValidity(req.body.account, req.body.user, req.body.currency, req.body.amount, req.body.user2) === false){
        // res.type("application/json").status(400).send({Error: "Invalid request"})
    // }

    // if body is valid, creates a new account, testing if there is a secondary user or not
    if (req.body.user2 == "None" || req.body.user2 == "none" || req.body.user2 === "") {
        const account = await entries.createAccount(req.body.account, req.body.user, req.body.currency, req.body.amount)
        res.type("application/json").status(201).send(account)}

    else {
        const account = await entries.createAccount(req.body.account, req.body.user, req.body.currency, req.body.amount, req.body.user2)
        res.type("application/json").status(201).send(account)
}}))



app.get("/accounts/:user", asyncHandler(async(req, res, next) => {
    // uses getAllAccounts function from model to return all accounts for specified user
    const user = req.params.user
    const accounts = await entries.getAllAccounts(user)
    res.type("application/json").status(200).send(accounts)
}))




app.put("/accounts/:account", asyncHandler(async(req, res, next) => {
    // uses updateAccount function from model to update an account given their id and the values to update
    // returns a count of modified accounts
    const request = {account: req.params.account}

    // if (checkValidity(req.body.account, req.body.user, req.body.currency, req.body.amount, req.body.user2) === false){
        // res.type("application/json").status(400).send({Error: "Invalid request"})
    // }
    const account = await entries.updateAccount(request, req.body)
    if (account === null) {
        res.type("application/json").status(404).send({Error: "Not found"})
    }
    else res.type("application/json").status(200).send(account)
}))

app.delete("/accounts/:id", asyncHandler(async(req, res, next) => {
    // uses deleteAccount function from model to delete the account of the given id
    // returns a count of deleted accounts
    const request = {_id: req.params.id}
    const count = await entries.deleteAccount(request)
    if (count === 0){
        res.type("application/json").status(404).send({Error: "Not found"})
    }
    else res.status(204).send()
}))








app.post("/transfers", asyncHandler(async(req, res, next) => {
    // uses createTransfer function from model to make a new transfer with given criteria
    // returns the transfer object
    const transfer = await entries.createTransfer(req.body.account, req.body.account2, req.body.currency, req.body.currency2, req.body.amount, req.body.fee, req.body.exchangeRate, req.body.date, req.body.month, req.body.description)
    res.type("application/json").status(201).send(transfer)
}))



app.get("/transfers/:month", asyncHandler(async(req, res, next) => {
    // uses getAllTransfers function from model to return all transfers for specified account for that month
    const month = req.params.month
    const transfers = await entries.getAllTransfers(month)
    res.type("application/json").status(200).send(transfers)
}))


// didn't really implement these next 2

app.put("/transfers/:account", asyncHandler(async(req, res, next) => {
    // uses updateTransfer function from model to update a transfer given their id and the values to update
    // returns a count of modified transfers
    const request = {account: req.params.account}
    const account = await entries.updateAccount(request, req.body)
    if (account === null) {
        res.type("application/json").status(404).send({Error: "Not found"})
    }
    else res.type("application/json").status(200).send(account)
}))

app.delete("/transfers/:id", asyncHandler(async(req, res, next) => {
    // uses deleteTransfer function from model to delete the transfer of the given id
    // returns a count of deleted transfers
    const request = {_id: req.params.id}
    const count = await entries.deleteTransfer(request)
    if (count === 0){
        res.type("application/json").status(404).send({Error: "Not found"})
    }
    else res.status(204).send()
}))





app.post("/months", asyncHandler(async(req, res, next) => {
    const month = await entries.createMonth(req.body.account, req.body.month, req.body.year, req.body.monthName, req.body.categoryTotals, req.body.monthlyTotal)
    res.type("application/json").status(201).send(month)
}))



app.get("/months/:filter", asyncHandler(async(req, res, next) => {
    // uses getAllMonths function from model to return all months for specified month and year
    const filter = req.params.filter
    const months = await entries.findMonth({$or: [{month: filter}, {id: filter}]})
    res.type("application/json").status(200).send(months)
}))



app.put("/months/:filter", asyncHandler(async(req, res, next) => {
    // uses updateMonth function from model to update a month given their account, month, year and the values to update
    // returns a count of modified months
    const request = req.params.filter

    const month = await entries.updateMonth({request}, req.body)
    res.type("application/json").status(200).send(month)
}))

app.delete("/months/:id", asyncHandler(async(req, res, next) => {
    // uses deleteAccount function from model to delete the account of the given id
    // returns a count of deleted accounts
    const request = {_id: req.params.id}
    const count = await entries.deleteMonth(request)
    if (count === 0){
        res.type("application/json").status(404).send({Error: "Not found"})
    }
    else res.status(204).send()
}))





app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
