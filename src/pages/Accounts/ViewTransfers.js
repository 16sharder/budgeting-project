import React from 'react';
import {useState, useEffect} from "react"
import {useHistory, useLocation} from "react-router-dom"

import { useSelector } from 'react-redux/es/hooks/useSelector';

import { retrieveUserAccountNames} from "../../helperfuncs/FetchFunctions"

import Navigation from '../../components/Styling/Navigation';
import BasicBorders, {NoBorderFlourish} from '../../components/Styling/BorderDecoration';

import { monthName } from '../../helperfuncs/DateCalculators';
import TransferItem from '../../components/TransferItem';

function ViewTransfers () {
    const history = useHistory()
    const location = useLocation()

    const user = useSelector(state => state.user.value)

    const {currency, month, year, accountName, accounts} = location.state


    // loads all of the transfers from the current and previous months
    const [transfersOut, setOut] = useState([])
    const [transfersIn, setIn] = useState([])


    const [totalOut, setTotOut] = useState(0)
    const [totalIn, setTotIn] = useState(0)

    const loadTransfers = async () => {
        const fetchTransfers = async (month) => {
            const response = await fetch(`/transfers/${month}`)
            const data = await response.json()
            return data
        }
    
        const allTransfers = await fetchTransfers(month)
    
        let accountNames;
        if (accountName == "All Accounts") accountNames = await retrieveUserAccountNames(user)
        else accountNames = [accountName]

        const tOut = []
        const tIn = []

        for (const transfer of allTransfers) {
            if (Number(transfer.date.slice(0,4)) == year) {
                if (accountNames.includes(transfer.account)) {
                    tOut.push(transfer)
                }
                if (accountNames.includes(transfer.account2)) {
                    tIn.push(transfer)
                }}
        }
    
        setOut(tOut)
        setIn(tIn)
    }

    useEffect(() => {
        loadTransfers()
    }, [])

    useEffect(() => {
        let tOut = 0
        let tIn = 0

        for (const transfer of transfersOut){
            tOut += transfer.amount + transfer.fee
        }
        for (const transfer of transfersIn){
            tIn += transfer.amount + transfer.fee
        }

        setTotOut(tOut)
        setTotIn(tIn)
    }, transfersIn)


    const editTransfer = (transfer) => {
        let bool = 0;
        for (const acct of accounts){
            if (transfer.account == acct.account) bool += 1
            if (transfer.account2 == acct.account) bool += 1
        }
        if (bool == 2) history.push({pathname:"/edit-transfer", state: {entry: transfer, currency, accounts, month}})
        else alert("You do not have permission to edit this transfer because you are not a user on one of the accounts involved")
    }

    return (
        <><div className='box'>
            <BasicBorders/>
            <NoBorderFlourish/>
            <Navigation currency={currency} />
            <p></p>

            <h2>Transfers in {monthName(Number(month) -1)} - {accountName}</h2>
            <div>Net Transfered: {(totalIn-totalOut).toLocaleString('en', {style: "currency", currency: currency})}</div>

            <table className='viewTransfers'>
                <thead><tr>
                    <th className='borderless'><h2 className='noTop'>Transfered Out: {totalOut.toLocaleString('en', {style: "currency", currency: currency})}</h2></th>
                    <th className='borderless'><h2 className='noTop'>Transfered In: {totalIn.toLocaleString('en', {style: "currency", currency: currency})}</h2></th>
                </tr></thead>

                <tbody><tr>
                    <td className='transfers'>
                        {transfersOut.map((transfer, index) => 
                        <TransferItem data={[index, transfer, editTransfer]} key={index}/>
                        )}
                    </td>
                    <td className='transfers'>
                        {transfersIn.map((transfer, index) => 
                        <TransferItem data={[index, transfer, editTransfer]} key={index}/>
                        )}
                    </td>
                </tr></tbody>
            </table>

            <br/>      
            <button onClick={() => history.push({pathname:"/previous-month", state: {currency, month: month - 1}})}>
                Return to {monthName(Number(month) -1)} Finances</button>

            
            <p></p>
        </div></>
    )
}

export default ViewTransfers
