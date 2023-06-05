// The Accounts Overview Page:
// Shown when the user selects Accounts Overview in the navigation bar
// Shows the user the amount in each of their bank accounts at the beginning of the month and at that moment
// Includes a display of the user's total net worth at that moment
// Also shows a table of the user's transfers between their own accounts for the past 2 months
// Includes buttons to create a new transfer and add a new account

import React from 'react';
import {useState, useEffect} from "react"
import {useHistory, useLocation} from "react-router-dom"

import { retrieveNetSpendings, retrieveUserAccountNames } from '../../helperfuncs/FetchFunctions';
import {monthName} from "../../helperfuncs/DateCalculators"
import {calculateNetWorth} from "../../helperfuncs/OtherCalcs"

import Navigation from '../../components/Styling/Navigation';
import { BorderDecorationsH } from '../../components/Styling/BorderDecoration';
import { FiEdit } from 'react-icons/fi';

function Accounts() {
    const location = useLocation()
    const user = location.state.user
    let currency = location.state.currency

    const history = useHistory()

    const today = new Date()
    const month = today.getMonth()
    const year = today.getFullYear()
    
    // gets all of the user's account information
    const [accounts, setAccounts] = useState([])
    const [beginnings, setBeginnings] = useState([])

    const loadAccounts = async (user) => {
        // retrieves a list of the user's accounts
        const response = await fetch(`/accounts/${user}`)
        const data = await response.json()
        setAccounts(data)

        // also loads account info for the beginning of the month
        const result = await retrieveNetSpendings(month, year, data)
        setBeginnings(result)
    }


    // retrieves user's net worth 
    const [netWorth, setNetWorth] = useState(0)

    const loadNetWorth = async () => {
        const result = await calculateNetWorth(user, currency)
        setNetWorth(result)
    }




    // loads all of the transfers from the current and previous months
    const [transfers, setTransfers] = useState([])

    const loadTransfers = async () => {
        const fetchTransfers = async (month) => {
            const response = await fetch(`/transfers/${month}`)
            const data = await response.json()
            return data
        }
    
        const curMonth = await fetchTransfers(today.getMonth()+1)
        let preMonth = await fetchTransfers(today.getMonth())
        if (today.getMonth() == 0) {preMonth = await fetchTransfers(12)}
    
        const accountNames = await retrieveUserAccountNames(user)
    
        const transferList = []
        for (const transfer of preMonth) {
            if (Number(transfer.date.slice(0,4)) == year){
                if (accountNames.includes(transfer.account)) {
                transferList.push(transfer)
                }
                else if (accountNames.includes(transfer.account2)) {
                    transferList.push(transfer)
                }}
            if (today.getMonth() == 0) {if (Number(transfer.date.slice(0,4)) == year-1){
                if (accountNames.includes(transfer.account)) {
                transferList.push(transfer)
                }
                else if (accountNames.includes(transfer.account2)) {
                    transferList.push(transfer)
                }}}
        }

        for (const transfer of curMonth) {
            if (Number(transfer.date.slice(0,4)) == year) {
                if (accountNames.includes(transfer.account)) {
                    transferList.push(transfer)
                }
                else if (accountNames.includes(transfer.account2)) {
                    transferList.push(transfer)
                }}
        }
    
        setTransfers(transferList)
    }
    
    
    const changeDate = (date) => {
        let dateCopy = date.slice(5, date.length)
        const dashIndex = dateCopy.indexOf("-")
        dateCopy = `${dateCopy.slice(0, dashIndex)}/${dateCopy.slice(dashIndex+1, dateCopy.length)}`

        if (dateCopy[dashIndex+1] == 0) dateCopy = `${dateCopy.slice(0, dashIndex+1)}${dateCopy.slice(dashIndex+2, dateCopy.length)}`
        if (dateCopy[0] == 0) dateCopy = dateCopy.slice(1, dateCopy.length)

        return dateCopy
    }








    useEffect(() => {
        loadNetWorth()
        loadAccounts(user)
        loadTransfers()
    }, [])




    const sendTransfer = () => {
        if (accounts.length < 2) alert ("You must have at least two bank accounts before you can perform a transfer")
        else history.push({pathname:"/transfer", state: {curUser: user, currency: currency, accounts: accounts}})
    }

    return (
        <>
            <BorderDecorationsH />
            <Navigation user={user} currency={currency} />
            <p></p>
            <h2>Accounts Overview</h2>

            <table>
                <thead>
                    <tr className='toprow acct horizontalB'>
                        <th><div>Accounts on</div> {monthName(today.getMonth())} First</th>
                        <th className='verticalB'></th>
                        <th>Accounts Now</th>
                    </tr>
                </thead>
                <tbody>
                {accounts.map((account, index) => <tr key={index} className='color5' onClick={() => history.push({pathname:"/previous-spendings", state: {user: user, currency: currency, month: month, accountName: account.account}})}>
                    <td className="color1">{Number(beginnings[index]).toLocaleString('en', {style: "currency", currency: account.currency})}</td>
                    <td className="bold verticalB">{account.account}</td>
                    <td className='color1'>{account.amount.toLocaleString('en', {style: "currency", currency: account.currency})}</td></tr>)}
                </tbody>
            </table>

            
            <table className='twoButtons'><tbody><tr>
                <td><button onClick={sendTransfer}>Bank Transfer</button></td>
                <td></td>
                <td><button onClick={() => history.push({pathname:"/add-account", state: {curUser: user, currency: currency}})}>Add New Account</button></td>
            </tr></tbody></table>
            
            <h3>Total Net Worth</h3>
            <div className='color5'>{Number(netWorth).toLocaleString('en', {style: "currency", currency: currency})}</div>



            <p></p>
            <h3>Recent Transfers</h3>

            <table>
                <thead>
                    <tr className='toprow horizontalB'>
                        <th>From</th>
                        <th>To</th>
                        <th>Amount Given</th>
                        <th>Amount Received</th>
                        <th>Date</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {transfers.map((transfer, index) => <tr key={index}>
                        <td className="bold color5">{transfer.account}</td>
                        <td className='bold color5'>{transfer.account2}</td>
                        <td className="color1">{transfer.amount.toLocaleString('en', {style: "currency", currency: transfer.currency})}</td>
                        <td className='color1'>{(transfer.amount * transfer.exchangeRate).toLocaleString('en', {style: "currency", currency: transfer.currency2})}</td>
                        <td>{changeDate(transfer.date)}</td>
                        <td>{transfer.description}</td>
                        <td className='color1'><FiEdit onClick={() => {history.push({pathname:"/edit-transfer", state: {entry: transfer, curUser: user, currency: currency, accounts: accounts, month: month}})}}/></td>
                    </tr>)}
                </tbody>
            </table>


            <p></p>
            <div className='container bottomSep'></div>
        </>
    )
}

export default Accounts