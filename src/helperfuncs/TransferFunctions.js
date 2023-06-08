import { updateAccount, updateMonths } from "./UpdateFunctions"

async function addTransfer (entry) {
    const response = await fetch("/transfers", {
        method: "POST", 
        body: JSON.stringify(entry),
        headers: {"Content-type": "application/json"}
    })
    if (response.status !== 201){
        alert(`Transfer failed. Status code = ${response.status}`)
        return false
    }
    else {
        alert("Successfully performed transfer")

        // adds the transfer to the month's records for both accounts
        await updateMonths(entry.date, entry.account, Number(entry.amount) + Number(entry.fee))
        await updateMonths(entry.date, entry.account2, entry.amount * entry.exchangeRate * -1)
        // updates both accounts
        await updateAccount(entry.account, Number(entry.amount) + Number(entry.fee))
        await updateAccount(entry.account2, entry.amount * entry.exchangeRate * -1)

        return true
    }
}


async function updateTransfer (id, newEntry, oldEntry) {
    // edits the entry in mongoDB
    const response = await fetch(`/transfers/${id}`, {
        method: "PUT", 
        body: JSON.stringify(newEntry),
        headers: {"Content-type": "application/json"}
    })
    if (response.status !== 200){
        alert(`Edit entry failed. Status code = ${response.status}`)
        return false
    } else {
        // removes the transfer from the month's records for both old accounts
        await updateMonths(oldEntry.date, oldEntry.account, (oldEntry.amount + oldEntry.fee) * -1)
        await updateMonths(oldEntry.date, oldEntry.account2, oldEntry.amount * oldEntry.rate)

        // adds the transfer to the month's records for both new accounts
        await updateMonths(newEntry.date, newEntry.account, Number(newEntry.amount) + Number(newEntry.fee))
        await updateMonths(newEntry.date, newEntry.account2, newEntry.amount * newEntry.exchangeRate * -1)

        // updates both old accounts
        await updateAccount(oldEntry.account, (oldEntry.amount + oldEntry.fee) * -1)
        await updateAccount(oldEntry.account2, oldEntry.amount * oldEntry.exchangeRate)

        // updates both new accounts
        await updateAccount(newEntry.account, Number(newEntry.amount) + Number(newEntry.fee))
        await updateAccount(newEntry.account2, newEntry.amount * newEntry.exchangeRate * -1)

        return true
    }
}


async function deleteTransfer (entry) {
    // deletes the entry from mongoDB
    const response = await fetch(`/transfers/${entry._id}`, {method: "DELETE"})
    if (response.status !== 204){
        alert(`Delete entry failed. Status code = ${response.status}`)
        return false
    } else {
        // removes the transfer from the month's records for both old accounts
        await updateMonths(entry.date, entry.account, (entry.amount + entry.fee) * -1)
        await updateMonths(entry.date, entry.account2, entry.amount * entry.exchangeRate)

        // updates both old accounts
        await updateAccount(entry.account, (entry.amount + entry.fee) * -1)
        await updateAccount(entry.account2, entry.amount * entry.exchangeRate)

        return true
    }
}

export {addTransfer, updateTransfer, deleteTransfer}