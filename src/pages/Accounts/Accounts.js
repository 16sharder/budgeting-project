// The Accounts Overview Page:
// Shown when the user selects Accounts Overview in the navigation bar
// Shows the user the amount in each of their bank accounts at the beginning of the month and at that moment
// Includes a display of the user's total net worth at that moment
// Also shows a table of the user's transfers between their own accounts for the past 2 months
// Includes buttons to create a new transfer and add a new account

import React from 'react';
import {useState, useEffect} from "react"
import {useHistory} from "react-router-dom"

import { useSelector } from 'react-redux/es/hooks/useSelector';

import { retrieveNetSpendings, retrieveUserAccountNames } from '../../helperfuncs/FetchFunctions';
import {monthName, stringifyDate} from "../../helperfuncs/DateCalculators"
import {calculateNetWorth} from "../../helperfuncs/OtherCalcs"

import Navigation from '../../components/Styling/Navigation';
import BasicBorders, { NoBorderFlourish } from '../../components/Styling/BorderDecoration';
import { FiEdit } from 'react-icons/fi';

function Accounts() {
    const history = useHistory()

    const user = useSelector(state => state.user.value)
    const currency = useSelector(state => state.currency.value)
    const accounts = useSelector(state => state.accounts.value)

    const today = new Date()
    const month = today.getMonth()
    const year = today.getFullYear()
    
    // gets all of the user's account information
    const [beginnings, setBeginnings] = useState([])

    const loadAccounts = async () => {
        // also loads account info for the beginning of the month
        const names = accounts.map((acct) => acct.account)
        const spent = await retrieveNetSpendings(month, year, names)

        const result = []
        for (const idx in accounts){
            result.push(accounts[idx].amount - spent[idx])
        }
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





    useEffect(() => {
        loadNetWorth()
        loadAccounts()
        loadTransfers()
    }, [])




    const sendTransfer = () => {
        if (accounts.length < 2) alert ("You must have at least two bank accounts before you can perform a transfer")
        else history.push({pathname:"/transfer"})
    }

    const editTransfer = (transfer) => {
        let bool = 0;
        for (const acct of accounts){
            if (transfer.account == acct.account) bool += 1
            if (transfer.account2 == acct.account) bool += 1
        }
        if (bool == 2) history.push({pathname:"/edit-transfer", state: {entry: transfer, month}})
        else alert("You do not have permission to edit this transfer because you are not a user on one of the accounts involved")
    }

    return (
        <><div className='box'>
            <BasicBorders/>
            <NoBorderFlourish/>
            <Navigation/>
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
                {accounts.map((account, index) => <tr key={index} className='color5' onClick={() => history.push({pathname:"/previous-spendings", state: {month, accountName: account.account}})}>
                    <td className="color1">{Number(beginnings[index]).toLocaleString('en', {style: "currency", currency: account.currency})}</td>
                    <td className="bold verticalB">{account.account}</td>
                    <td className='color1'>{account.amount.toLocaleString('en', {style: "currency", currency: account.currency})}</td></tr>)}
                </tbody>
            </table>

            
            <table className='twoButtons'><tbody><tr>
                <td><button onClick={sendTransfer}>Bank Transfer</button></td>
                <td></td>
                <td><button onClick={() => history.push({pathname:"/add-account"})}>Add New Account</button></td>
            </tr></tbody></table>
            
            <h3>Total Net Worth</h3>
            <div className='color5'>{Number(netWorth).toLocaleString('en', {style: "currency", currency})}</div>



            <p></p>
            <h3>Recent Transfers</h3>

            <table>
                <thead>
                    <tr className='toprow horizontalB'>
                        {["From", "To", "Amount Given", "Amount Received", "Date", "Description"].map((label, index) => <th key={index}>{label}</th>)}
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {transfers.map((transfer, index) => <tr key={index}>
                        <td className="bold color5">{transfer.account}</td>
                        <td className='bold color5'>{transfer.account2}</td>
                        <td className="color1">{transfer.amount.toLocaleString('en', {style: "currency", currency: transfer.currency})}</td>
                        <td className='color1'>{(transfer.amount * transfer.exchangeRate).toLocaleString('en', {style: "currency", currency: transfer.currency2})}</td>
                        <td>{stringifyDate(transfer.date)}</td>
                        <td>{transfer.description}</td>
                        <td className='color1'><FiEdit onClick={() => editTransfer(transfer)}/></td>
                    </tr>)}
                </tbody>
            </table>


            <p></p>
            <br/>
        </div></>
    )
}

export default Accounts