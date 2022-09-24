import React from 'react';
import {useState} from "react"
import {useHistory, useLocation} from "react-router-dom"

import BorderDecorations, {BorderDecorationsBottom} from '../components/BorderDecoration';

function AddEntry() {
    const history = useHistory()
    const location = useLocation()
    const curUser = location.state.curUser
    const curRency = location.state.currency
    const accounts = location.state.accounts

    const [account, setAccount] = useState(`${accounts[0].account}`)
    const [category, setCategory] = useState("Groceries")
    const [currency, setCurrency] = useState("€")
    const [amount, setAmount] = useState(0)
    const [date, setDate] = useState("")
    const [description, setDescription] = useState("")

    const addEntry = async () => {
        // adds the entry to mongoDB
        const newEntry = {account, category, currency, amount, date, description}
        const response = await fetch("/entries", {
            method: "POST", 
            body: JSON.stringify(newEntry),
            headers: {"Content-type": "application/json"}
        })
        if (response.status === 201){
            alert("Successfully created a new entry")
        } else{
            alert(`Create entry failed. Status code = ${response.status}`)
        }


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
            alert("Successfully added entry to account")
        } else{
            alert(`Entry addition failed. Status code = ${res.status}`)
        }


        // returns the user to the main page
        history.push({pathname:"/main", state: {user: curUser, currency: curRency}})

    }


    return (
        <div>
            <BorderDecorations />
            <h3>Create a new entry</h3>
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
                    <td className='button color1'>Category:</td>
                    <td className='button'></td>
                    <td className='button'><select
                        value={category}
                        onChange={newN => setCategory(newN.target.value)} >
                            <option value="Groceries">Groceries</option>
                            <option value="Eating Out">Eating Out</option>
                            <option value="Clothing">Clothing</option>
                            <option value="House Supplies">House Supplies</option>
                            <option value="Work Supplies">Work Supplies</option>
                            <option value="Travel">Travel</option>
                            <option value="Bills">Bills</option>
                            <option value="Cash">Cash</option>
                            <option value="Emergencies">Emergencies</option>
                            <option value="Other">Other</option>
                    </select></td>
                </tr>
                <tr>
                    <td className='button color1'>Amount:</td>
                    <td className='button'><select
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
                <td className="button"><button onClick={addEntry} className="button">Add</button></td>
            </tr></tbody></table>
            <BorderDecorationsBottom />
        </div>
    )
}

export default AddEntry
