import { updateAccount, updateMonths } from "./UpdateFunctions"

async function addEntry (entry) {
    const response = await fetch("/entries", {
        method: "POST", 
        body: JSON.stringify(entry),
        headers: {"Content-type": "application/json"}
    })
    if (response.status !== 201){
        alert(`Create entry failed. Status code = ${response.status}`)
        return false
    } 
    else {
        // adds the entry to the month's records
        await updateMonths(entry.date, entry.account, entry.amount, entry.category)
        // updates the account that was spent from
        await updateAccount(entry.account, entry.amount)
        return true
    }
}


async function updateEntry (id, newEntry, oldEntry) {
    // edits the entry in mongoDB
    const response = await fetch(`/entries/${id}`, {
        method: "PUT", 
        body: JSON.stringify(newEntry),
        headers: {"Content-type": "application/json"}
    })
    if (response.status !== 200){
        alert(`Edit entry failed. Status code = ${response.status}`)
        return false
    } 
    else {
        // subtracts the old entry data from the month's records
        await updateMonths(oldEntry.date, oldEntry.account, -oldEntry.amount, oldEntry.category)
        // adds the new entry data to the month's records
        await updateMonths(newEntry.date, newEntry.account, newEntry.amount, newEntry.category)

        // updates the original account that was spent from
        await updateAccount(oldEntry.account, -oldEntry.amount)
        // updates the actual account that was spent from
        await updateAccount(newEntry.account, newEntry.amount)
        return true
    }
}


async function deleteEntry (entry) {
    // deletes the entry from mongoDB
    const response = await fetch(`/entries/${entry._id}`, {method: "DELETE"})
    if (response.status !== 204){
        alert(`Delete entry failed. Status code = ${response.status}`)
        return false
    } 
    else {
        // subtracts the old entry data from the month's records
        await updateMonths(entry.date, entry.account, -entry.amount, entry.category)
        // updates the original account that was spent from
        await updateAccount(entry.account, -entry.amount)
        return true
    }
}

export {addEntry, updateEntry, deleteEntry}