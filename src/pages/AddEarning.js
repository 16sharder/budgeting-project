import React from 'react';
import {useState} from "react"
import {useHistory, useLocation} from "react-router-dom"

import { convertTodayToDate } from '../helperfuncs/DateCalculators';
import BorderDecorations, {BorderDecorationsBottom} from '../components/BorderDecoration';
import { updateAccount, updateMonths } from '../helperfuncs/UpdateFunctions';

function AddEarning() {
    const history = useHistory()
    const location = useLocation()
    const curUser = location.state.user
    const curRency = location.state.currency
    const accounts = location.state.accounts

    const today = convertTodayToDate()

    const [account, setAccount] = useState(`${accounts[0].account}`)
    const category = "Earnings"
    const [currency, setCurrency] = useState("€")
    const [amount, setAmount] = useState(0)
    const [date, setDate] = useState(today)
    const [description, setDescription] = useState("")

    const addEntry = async (amount) => {
        // adds the entry to mongoDB
        const month = date.slice(5, 7)
        amount *= -1
        const newEntry = {account, category, currency, amount, date, month, description}
        const response = await fetch("/entries", {
            method: "POST", 
            body: JSON.stringify(newEntry),
            headers: {"Content-type": "application/json"}
        })
        if (response.status !== 201){
            alert(`Add earnings failed. Status code = ${response.status}`)
        }

        // adds the entry to the month's records
        updateMonths(date, account, amount, category)
        // updates the account that gained earnings
        updateAccount(account, amount)


        // returns the user to the main page
        history.push({pathname:"/main", state: {user: curUser, currency: curRency}})

    }


    return (
        <>
            <BorderDecorations />
        <div>

            <h3>Add earnings</h3>
            <div></div>

            <table><tbody>
                <tr>
                    <td className='button color1'>Bank Account:</td>
                    <td className='button'></td>
                    <td className='button'><select
                        value={account}
                        onChange={newN => setAccount(newN.target.value)} >
                            {accounts.map((account, index) => <option value={account.account} key={index}>{account.account}</option>)}
                    </select></td>
                </tr>
                <tr>
                    <td className='button color1'>Amount:</td>
                    <td className='right button'><select
                        className='currency'
                        value={currency}
                        onChange={newN => setCurrency(newN.target.value)} >
                            <option value="€">€</option>
                            <option value="$">$</option>
                        </select></td>
                    <td className='button'>
                        <input 
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={newN => setAmount(newN.target.value)} />
                    </td>
                </tr>
                <tr>
                    <td className='button color1'>Date:</td>
                    <td className='button'></td>
                    <td className='button'>
                        <input 
                            type="date"
                            placeholder="mm/dd"
                            value={date}
                            onChange={newN => setDate(newN.target.value)} />
                    </td>
                </tr>
                <tr>
                    <td className='button color1'> Descripton:</td>
                    <td className='button'></td>
                    <td className='button'>
                        <input 
                            className='invisible'
                            type="text" />
                        <input 
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={newN => setDescription(newN.target.value)} />
                        <input 
                            className='invisible'
                            type="text" />
                    </td>
                </tr>
            </tbody></table>



            <table><tbody><tr>
                <td className="button"><button onClick={() => history.push({pathname:"/main", state: {user: curUser, currency: curRency}})} className="currency">Back</button></td>
                <td className="button"><button onClick={() => addEntry(amount)} className="button">Add</button></td>
            </tr></tbody></table>
        </div>
        <BorderDecorationsBottom />
        </>
    )
}

export default AddEarning