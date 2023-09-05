// The Edit Existing Earning Page:
// Shown when the user has selected the Edit button on a specific earning from the ViewDetails page
// Displays a form for the user to update the data for their earning entry, with default vals as previous vals
        // also includes a delete button
// Sends the user back to the MainPage

import React, { useEffect } from 'react';
import {useState} from "react"
import {useHistory, useLocation} from "react-router-dom"

import { useRAccountsDispatch, reloadAccounts } from '../../helperfuncs/UpdateFunctions';

import { findCurrency } from '../../helperfuncs/OtherCalcs';
import { deleteEntry, updateEntry } from '../../helperfuncs/EntryFunctions';

import BasicBorders, {BorderFlourish} from '../../components/Styling/BorderDecoration';
import { AccountSelector, AmountEntry, DateEntry, DescriptionEntry } from '../../components/Forms/Inputs';

function EditEarning() {
    const history = useHistory()
    const location = useLocation()

    const [user, accounts, dispatch] = useRAccountsDispatch()

    const {entry} = location.state

    const [account, setAccount] = useState(entry.account)
    const [currency, setCurrency] = useState(entry.currency)
    const [currencySymbol, setSymbol] = useState(accounts[0].currency)
    const [amount, setAmount] = useState(-entry.amount)
    const [date, setDate] = useState(entry.date)
    const [description, setDescription] = useState(entry.description)


    const updateEarning = async () => {
        // edits the entry in mongoDB
        const editedEntry = {account, category: "Earnings", currency, amount: amount * -1, date, description}
        const res = await updateEntry(entry._id, editedEntry, entry)

        await reloadAccounts(user, dispatch)

        // returns the user to the view details page
        if (res) history.push({pathname:"/main", state: {}})
    }

    const deleteEarning = async () => {
        const res = await deleteEntry(entry)

        await reloadAccounts(user, dispatch)

        // returns the user to the view details page
        if (res) history.push({pathname:"/main", state: {}})
    }

    useEffect(() => {
        const curr = findCurrency(account, accounts)
        setCurrency(curr[0])
        setSymbol(curr[1])
    }, [account])


    return (
        <>
            <BasicBorders/>
            <BorderFlourish/>
        <div className='holder'>

            <h3>Edit entry</h3>
            <div></div>

            <table className='form'><tbody>
                <AccountSelector data={[account, setAccount, "Bank Account:"]}/>
                <AmountEntry data={[currencySymbol, amount, setAmount, "Amount:"]}/>
                <DateEntry data={[date, setDate]}/>
                <DescriptionEntry data={[description, setDescription]}/>
            </tbody></table>



            <table className="twoButtons"><tbody><tr>
                <td><button onClick={() => history.push({pathname:"/main", state: {}})}>Back</button></td>
                <td><button onClick={updateEarning}>Confirm</button></td>
            </tr></tbody></table>
    
            <br></br>

            <button onClick={deleteEarning} className="delete">Delete</button>
            </div>
        </>
    )
}

export default EditEarning
