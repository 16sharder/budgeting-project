import React, { useEffect, useState } from 'react';
import {useLocation} from "react-router-dom"

import NetTable from '../../components/MainPage/NetTable';
import { BorderDecorationsH } from '../../components/Styling/BorderDecoration';
import Navigation from '../../components/Styling/Navigation';
import { monthName } from '../../helperfuncs/DateCalculators';

function PreviousMonth () {

    const location = useLocation()

    const {user, month, lastUsed} = location.state
    let {currency} = location.state

    let monthNumStr = String(Number(month) + 1)
    if (monthNumStr.length == 1) monthNumStr = `0${monthNumStr}`

    // retrieves the appropriate year
    const today = new Date
    let year = today.getFullYear()
    if (month > today.getMonth()) {year = year - 1}


    const [accounts, setAccounts] = useState([])

    const loadAccounts = async (user) => {
        const response = await fetch(`/accounts/${user}`)
        const data = await response.json()
        setAccounts(data)
    }

    // loads everything
    useEffect(() => {
        loadAccounts(user)
    }, [])

    return (
        <>
            <BorderDecorationsH />
            <Navigation user={user} currency={currency} lastUsed={lastUsed}/>
            <p></p>

            <h2>Financials in {monthName(month)}</h2>
            <div>Click on a section to view more details</div>
            <NetTable data={[user, "All Accounts", accounts, currency, monthNumStr, month, year, lastUsed]}/>
            {accounts.map((account, index) => 
            <NetTable data={[user, account.account, accounts, currency, monthNumStr, month, year, lastUsed]} key={index}/>)}

            <p></p>
            <div className='container bottomSep'></div>
        </>
    )
}

export default PreviousMonth