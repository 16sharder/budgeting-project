import {calcWeekDates, convertDate, monthName} from "../helperfuncs/DateCalculators"

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


async function retrieveDayEntries (day, user, accountName="All Accounts") {
    // retrieves all the entries for a specific day as an array
    const fetchEntries = async (day) => {
        const response = await fetch(`/entries/${day}`)
        const data = await response.json()
        return data
    }

    const newDay = convertDate(day)
    const result = await fetchEntries(newDay)

    // if it is only requesting a specific account, only retrieves that account's entries
    if (accountName != "All Accounts") {
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


async function retrieveWeekEntries (week, user, days=7, accountName="All Accounts") {
    // returns an array of all the entries for each day of that week
    const weekDates = calcWeekDates(week, days)

    let returnArray = []
    for (let day of weekDates){
        const result = await retrieveDayEntries(day, user, accountName)

        returnArray.push(result)
    }

    return returnArray
}

async function retrieveEarnings (month, user, accountName="All Accounts") {
    const fetchEarnings = async () => {
        const response = await fetch(`/entries/${month}`)
        const data = await response.json()
        return data
    }

    const result = await fetchEarnings()

    // if it is only requesting a specific account, only retrieves that account's earnings
    if (accountName != "All Accounts") {
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

async function retrieveMonth (month, user, account="All Accounts") {
    const fetchMonth = async () => {
        const response = await fetch(`/months/${month}`)
        const data = await response.json()
        return data
    }
    let monGroc = 0
    let monEat = 0
    let monClo = 0
    let monHous = 0
    let monWork = 0
    let monTrav = 0
    let monBil = 0
    let monCash = 0
    let monEmr = 0
    let monOth = 0

    let allAccts = await fetchMonth()
    let accountNames = [account]
    if (account == "All Accounts") {accountNames = await retrieveUserAccountNames(user)}

    if (allAccts.length != 0) {
        for (let acct of allAccts) {
            if (accountNames.includes(acct.account)) {
                monGroc += acct.categoryTotals["Groceries"]
                monEat += acct.categoryTotals["Eating Out"]
                monClo += acct.categoryTotals["Clothing"]
                monHous += acct.categoryTotals["House Supplies"]
                monWork += acct.categoryTotals["Work Supplies"]
                monTrav += acct.categoryTotals["Travel"]
                monBil += acct.categoryTotals["Bills"]
                monCash += acct.categoryTotals["Cash"]
                monEmr += acct.categoryTotals["Emergencies"]
                monOth += acct.categoryTotals["Other"]
            }}
        const monTot = monGroc+monEat+monClo+monHous+monWork+monTrav+monBil+monCash+monEmr+monOth
        const monStats = [allAccts[0].monthName, monGroc, monEat, monClo, monHous, monWork, monTrav, monBil, monCash, monEmr, monOth, monTot, month-1]
        return monStats
    } else return undefined
}

async function retrieveMultipleMonths(latestMo, user, num) {
    let groc = 0
    let eat = 0
    let clo = 0
    let house = 0
    let work = 0
    let trav = 0
    let bills = 0
    let cash = 0
    let emr = 0
    let other = 0
    let total = 0

    let month = latestMo
    let x = 0
    let y = 1
    while (y !== num) {
        let results = await retrieveMonth(month, user)
        if (results != undefined) {
            x += 1
            groc += results[1]
            eat += results[2]
            clo += results[3]
            house += results[4]
            work += results[5]
            trav += results[6]
            bills += results[7]
            cash += results[8]
            emr += results[9]
            other += results[10]
            total += results[11]
        }

        if (month == 0) {
            month = 12
        } else {month -= 1}
        y += 1
    }
    return [groc, eat, clo, house, work, trav, bills, cash, emr, other, total, x]
}

async function convertToEuros (amount) {
    const response = await fetch("https://v6.exchangerate-api.com/v6/xxxxxxxxxxxxxxxxxxxxxxxx/latest/EUR")
    const data = await response.json()
    const calculated = amount * data.conversion_rates["USD"]
    return calculated
}

async function convertToDollars (amount) {
    const response = await fetch("https://v6.exchangerate-api.com/v6/xxxxxxxxxxxxxxxxxxxxxxxx/latest/USD")
    const data = await response.json()
    const calculated = amount * data.conversion_rates["EUR"]
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



export {retrieveUserAccountNames, retrieveDayEntries, retrieveWeekEntries, retrieveEarnings, retrieveMonth, retrieveMultipleMonths, organizeDaysEntries, convertToEuros, convertToDollars}