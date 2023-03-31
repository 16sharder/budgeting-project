// The Register New Transfer Page:
// Shown when the user has pressed the Bank Transfer button on the Accounts page
// Displays a form for the user to fill in all the data of their transfer
// Sends the user back to the Accounts Page

import React from 'react';
import {useState} from "react"
import {useHistory, useLocation} from "react-router-dom"

import { convertTodayToDate } from '../../helperfuncs/DateCalculators';
import BorderDecorations, {BorderDecorationsBottom} from '../../components/Styling/BorderDecoration';
import { updateAccount, updateMonths } from '../../helperfuncs/UpdateFunctions';

function Transfer() {
    const history = useHistory()
    const location = useLocation()
    const curUser = location.state.curUser
    const curRency = location.state.currency
    const accounts = location.state.accounts

    const today = convertTodayToDate()

    const [account, setAccount] = useState(`${accounts[0].account}`)
    const [account2, setAccount2] = useState(`${accounts[1].account}`)
    const [currency, setCurrency] = useState(`${accounts[0].currency}`)
    const [amount, setAmount] = useState(0)
    const [fee, setFee] = useState(0)
    const [exchangeRate, setExchangeRate] = useState(1)
    const [date, setDate] = useState(today)
    const [description, setDescription] = useState("")


    const performTransfer = async () => {
        // retrieves the second account to get the currency
        const account2Res = await fetch(`/accounts/${account2}`)
        const account2Data = await account2Res.json()

        const currency2 = account2Data[0].currency

        // adds the transfer to mongoDB
        const month = date.slice(5, 7)
        const newTransfer = {account, account2, currency, currency2, amount, fee, exchangeRate, date, month, description}
        const response = await fetch("/transfers", {
            method: "POST", 
            body: JSON.stringify(newTransfer),
            headers: {"Content-type": "application/json"}
        })
        if (response.status === 201){
            alert("Successfully performed transfer")
        
        // adds the transfer to the month's records for both accounts
        updateMonths(date, account, Number(amount) + Number(fee))
        updateMonths(date, account2, amount * exchangeRate * -1)
        // updates both accounts
        updateAccount(account, Number(amount) + Number(fee))
        updateAccount(account2, amount * exchangeRate * -1)



        history.push({pathname:"/accounts-view", state: {user: curUser, currency: curRency}})

        }else{
            alert(`Transfer failed. Status code = ${response.status}`)
        }
        
    }

    return (
        <div>
            <BorderDecorations />
            <h3>Bank Transfer</h3>
            <div></div>

            <table><tbody>
                <tr>
                    <td className='button color1'>Transfer From:</td>
                    <td className='button'></td>
                    <td className='button'><select
                        value={account}
                        onChange={newN => setAccount(newN.target.value)} >
                            {accounts.map((account, index) => <option value={account.account} key={index}>{account.account}</option>)}
                    </select></td>
                </tr>
                <tr>
                    <td className='button color1'>Transfer To:</td>
                    <td className='button'></td>
                    <td className='button'><select
                        value={account2}
                        onChange={newN => setAccount2(newN.target.value)} >
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
                    <td className='button color1'>Fee:</td>
                    <td className='right color1 button'>{currency}</td>
                    <td className='button'>
                        <input 
                            type="number"
                            placeholder="0.00"
                            value={fee}
                            onChange={newN => setFee(newN.target.value)} />
                    </td>
                </tr>
                <tr>
                    <td className='button color1'>Exchange Rate:</td>
                    <td className='button'></td>
                    <td className='button'>
                        <input 
                            type="number"
                            placeholder="1"
                            value={exchangeRate}
                            onChange={newN => setExchangeRate(newN.target.value)} />
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
                <td className="button"><button onClick={() => history.push({pathname:"/accounts-view", state: {user: curUser, currency: curRency}})} className="currency">Back</button></td>
                <td className="button"><button onClick={performTransfer} className="button">Transfer</button></td>
            </tr></tbody></table>
            <BorderDecorationsBottom />
        </div>
    )
}

export default Transfer
