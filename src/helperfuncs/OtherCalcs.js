import { convertToEuros, convertToDollars } from "./FetchFunctions"

function calculateWeekTotals (weekEntries){
    // takes an array of category results for each day, thus the array consists of 7 arrays of amounts
    let categoryResults = ["", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (let dayArray of weekEntries) {
        categoryResults[1] += dayArray[1]
        categoryResults[2] += dayArray[2]
        categoryResults[3] += dayArray[3]
        categoryResults[4] += dayArray[4]
        categoryResults[5] += dayArray[5]
        categoryResults[6] += dayArray[6]
        categoryResults[7] += dayArray[7]
        categoryResults[8] += dayArray[8]
        categoryResults[9] += dayArray[9]
        categoryResults[10] += dayArray[10]
    }

    return categoryResults
}

async function calculateNetWorth (user, currency){
    const loadAccounts = async (user) => {
        const response = await fetch(`/accounts/${user}`)
        const data = await response.json()
        return data
    }

    const accounts = await loadAccounts(user)

    let sum = 0
    for (let account of accounts){
        let value = account.amount
        if (currency === "EUR") {
            if (account.currency != currency) value = await convertToEuros(account.amount)
        } 
        else if (currency === "USD") {
            if (account.currency != currency) value = await convertToDollars(account.amount)
        }
        sum += value
    }
    return sum.toFixed(2)
}

export {calculateWeekTotals, calculateNetWorth}