import { monthName } from "./DateCalculators"

async function updateAccount (account, amount) {
    // updates the account that was spent from
    // retrieves the account to see how much was previously in it
    const accountRes = await fetch(`/accounts/${account}`)
    const accountData = await accountRes.json()

    // updates the amount in the account based on the amount input
    const update = {amount: accountData[0].amount - amount}

    const res = await fetch(`/accounts/${account}`, {
        method: "PUT", 
        body: JSON.stringify(update),
        headers: {"Content-type": "application/json"}
    })
    if (res.status === 200){
        alert("Successfully updated accounts")
    } else{
        alert(`Update failed. Status code = ${res.status}`)
    }
}

async function updateMonths  (date, account, amount, category) {
    // adds the entry to the month's records
    const year = Number(date.slice(0, 4))
    const month = Number(date.slice(5, 7))

    // determines if there is a month record that should be added to
    const data = await fetch(`/months/${month}`)
    let oldMonth = await data.json()

    let thisMonth = undefined
    for (const mo of oldMonth){
        if (mo.year == year) {
            if (mo.account == account){
                thisMonth = mo
            }
        }
    }

    // if there is no previously created month, creates a new one
    if (thisMonth == undefined) {
        const monthNam = monthName(month - 1)
        const categoryTotals = {"Groceries": 0, "Eating Out": 0, "Clothing": 0, "House Supplies": 0, "Work Supplies": 0, "Travel": 0, "Bills": 0, "Cash": 0, "Emergencies": 0, "Other": 0, "Earnings": 0}
        const monthlyTotal = 0

        const newMonth = {account, month, year, monthName: monthNam, categoryTotals, monthlyTotal}
        const response = await fetch("/months", {
            method: "POST", 
            body: JSON.stringify(newMonth),
            headers: {"Content-type": "application/json"}
        })
        if (response.status !== 201){
            alert(`Create entry failed. Status code = ${response.status}`)
        }
        thisMonth = newMonth
    }
    
    // updates the categoryTotals using the new amount 
    const catTotals = thisMonth.categoryTotals
    if (category != undefined) {
        const oldCats = catTotals[category]
        const newCats = oldCats + Number(amount)
        catTotals[category] = newCats
    }

    // establishes the updates to the categoryTotals and monthlyTotal
    const monthUpdate = {categoryTotals: catTotals, monthlyTotal: Number(amount) + thisMonth.monthlyTotal}
    const updateMonth = await fetch(`/months/${thisMonth._id}`, {
        method: "PUT", 
        body: JSON.stringify(monthUpdate),
        headers: {"Content-type": "application/json"}
    })
    if (updateMonth.status !== 200){
        alert(`Create entry failed. Status code = ${updateMonth.status}`)
    }
}

export {updateMonths, updateAccount}