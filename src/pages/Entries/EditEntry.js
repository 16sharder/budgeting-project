// The Edit Existing Entry Page:
// Shown when the user has selected the Edit button on a specific entry from the ViewDetails page
// Displays a form for the user to update the data for their entry, with default vals as previous vals
        // also includes a delete button
// Sends the user back to the MainPage

import React, { useEffect } from 'react';
import {useState} from "react"
import {useHistory, useLocation} from "react-router-dom"

import { findCurrency } from '../../helperfuncs/OtherCalcs';
import { deleteEntry, updateEntry } from '../../helperfuncs/EntryFunctions';

import BorderDecorations, {BorderDecorationsBottom} from '../../components/Styling/BorderDecoration';
import { AccountSelector, AmountEntry, CategorySelector, DateEntry, DescriptionEntry } from '../../components/Forms/Inputs';

function EditEntry() {
    const history = useHistory()
    const location = useLocation()

    const {entry, curUser, currency: curRency, accounts} = location.state

    const [account, setAccount] = useState(entry.account)
    const [category, setCategory] = useState(entry.category)
    const [currency, setCurrency] = useState(entry.currency)
    const [currencySymbol, setSymbol] = useState(accounts[0].currency)
    const [amount, setAmount] = useState(entry.amount)
    const [date, setDate] = useState(entry.date)
    const [description, setDescription] = useState(entry.description)


    const entryUpdate = async () => {
        // edits the entry in mongoDB
        const editedEntry = {account, category, currency, amount, date, description}
        await updateEntry(entry._id, editedEntry, entry, "entries")

        // returns the user to the view details page
        history.push({pathname:"/main", state: {user: curUser, currency: curRency}})
    }

    const delEntry = async () => {
        await deleteEntry(entry)

        // returns the user to the view details page
        history.push({pathname:"/main", state: {user: curUser, currency: curRency}})
    }


    useEffect(() => {
        const curr = findCurrency(account, accounts)
        setCurrency(curr[0])
        setSymbol(curr[1])
    }, [account])

    
    return (
        <>
            <BorderDecorations />
        <div className='holder'>

            <h3>Edit entry</h3>
            <div></div>

            <table className='form'><tbody>
                <AccountSelector data={[account, setAccount, accounts, "Bank Account:"]}/>
                <CategorySelector data={[category, setCategory]}/>
                <AmountEntry data={[currencySymbol, amount, setAmount, "Amount:"]}/>
                <DateEntry data={[date, setDate]}/>
                <DescriptionEntry data={[description, setDescription]}/>
            </tbody></table>



            <table className="twoButtons"><tbody><tr>
                <td><button onClick={() => history.push({pathname:"/main", state: {user: curUser, currency: curRency}})}>Back</button></td>
                <td><button onClick={entryUpdate}>Confirm</button></td>
            </tr></tbody></table>
    
            <br></br>

            <button onClick={delEntry} className="delete">Delete</button>
            </div>
        <BorderDecorationsBottom />
        </>
    )
}

export default EditEntry
