import {calcWeekDates, convertDate} from "../helperfuncs/DateCalculators"

async function retrieveUserAccountNames (user) {
    // returns an array of all the names of the accounts of a specified user
    const loadAccounts = async (user) => {
        const response = await fetch(`/accounts/${user}`)
        const data = await response.json()
        return (data)
    }

    const accounts = await loadAccounts (user)
    const accountNames = accounts.map((account) => {return account.account})

    return accountNames
}


async function retrieveDayEntries (day, user, accountName="all") {
    // retrieves all the entries for a specific day as an array
    const fetchEntries = async (day) => {
        const response = await fetch(`/entries/${day}`)
        const data = await response.json()
        return data
    }

    const newDay = convertDate(day)
    const result = await fetchEntries(newDay)

    // if it is only requesting a specific account, only retrieves that account's entries
    if (accountName != "all") {
        const resultCopy = result.slice()
        for (let entry of result){
            if (accountName != entry.account) resultCopy.splice(resultCopy.indexOf(entry), 1)
        }
    
        return resultCopy
    }

    // verifies that only entires for the user's accounts are returned
    const userAccounts = await retrieveUserAccountNames(user)
    const resultCopy = result.slice()
    for (let entry of result){
        if (! userAccounts.includes(entry.account)) resultCopy.splice(resultCopy.indexOf(entry), 1)
    }

    return resultCopy
}


async function retrieveWeekEntries (week, user, days=7, accountName="all") {
    // returns an array of all the entries for each day of that week
    const weekDates = calcWeekDates(week, days)

    let returnArray = []
    for (let day of weekDates){
        const result = await retrieveDayEntries(day, user, accountName)

        returnArray.push(result)
    }

    return returnArray
}

async function retrieveEarnings (month, user, accountName="all") {
    const fetchEarnings = async () => {
        const response = await fetch(`/entries/${month}`)
        const data = await response.json()
        return data
    }

    const result = await fetchEarnings()

    // if it is only requesting a specific account, only retrieves that account's earnings
    if (accountName != "all") {
        const resultCopy = result.slice()
        for (let entry of result){
            if (accountName != entry.account) resultCopy.splice(resultCopy.indexOf(entry), 1)
            else if (entry.category != "Earnings") resultCopy.splice(resultCopy.indexOf(entry), 1)
        }
    
        return resultCopy
    }

    // verifies that only earnings for the user's accounts are returned
    const userAccounts = await retrieveUserAccountNames(user)
    const resultCopy = result.slice()
    for (let entry of result){
        if (! userAccounts.includes(entry.account)) resultCopy.splice(resultCopy.indexOf(entry), 1)
        else if (entry.category != "Earnings") resultCopy.splice(resultCopy.indexOf(entry), 1)
    }

    return resultCopy
}

async function convertToEuros (amount) {
    // xxxxxxxxxxxxxxxxxxxxxxxx
    // const response = await fetch("https://v6.exchangerate-api.com/v6/xxxxxxxxxxxxxxxxxxxxxxxx/latest/EUR")
    // const data = await response.json()
    // const calculated = amount * data.conversion_rates["USD"]
    const calculated = amount
    return calculated
}

async function convertToDollars (amount) {
    // const response = await fetch("https://v6.exchangerate-api.com/v6/xxxxxxxxxxxxxxxxxxxxxxxx/latest/USD")
    // const data = await response.json()
    // const calculated = amount * data.conversion_rates["EUR"]
    const calculated = amount
    return calculated
}


async function organizeDaysEntries (dayEntries, currency) {
    // takes an array consisting of all the entries for that day
    // returns an array of the current sums of the different expense categories for that day
    let categoryResults = ["", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    if (dayEntries.length === 0) {return categoryResults}

    for (let entry of dayEntries){
        let value = entry.amount

        // determines if the entry needs to be converted to a different currency for display
        if (currency === "€") {
            if (entry.currency != currency) value = await convertToEuros(entry.amount)
        } 
        else if (currency === "$") {
            if (entry.currency != currency) value = await convertToDollars(entry.amount)
        } 

        categoryResults[0] = entry.date
        if (entry.category == "Groceries") categoryResults[1] += value
        else if (entry.category == "Eating Out") categoryResults[2] += value
        else if (entry.category == "Clothing") categoryResults[3] += value
        else if (entry.category == "House Supplies") categoryResults[4] += value
        else if (entry.category == "Work Supplies") categoryResults[5] += value
        else if (entry.category == "Travel") categoryResults[6] += value
        else if (entry.category == "Bills") categoryResults[7] += value
        else if (entry.category == "Cash") categoryResults[8] += value
        else if (entry.category == "Emergencies") categoryResults[9] += value
        else if (entry.category == "Other") categoryResults[10] += value
    }

    return categoryResults
}



export {retrieveUserAccountNames, retrieveDayEntries, retrieveWeekEntries, retrieveEarnings, organizeDaysEntries, convertToEuros, convertToDollars}