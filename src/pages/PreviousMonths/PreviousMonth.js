import React, { useEffect, useState } from 'react';
import {useLocation} from "react-router-dom"

import { useSelector } from 'react-redux/es/hooks/useSelector';

import { monthName, monthNumString } from '../../helperfuncs/DateCalculators';

import NetTable from '../../components/MainPage/NetTable';
import BasicBorders, {NoBorderFlourish} from '../../components/Styling/BorderDecoration';
import Navigation from '../../components/Styling/Navigation';

function PreviousMonth () {

    const location = useLocation()

    const user = useSelector(state => state.user.value)

    const {month, lastUsed} = location.state
    let {currency} = location.state

    const monthNumStr = monthNumString(month)

    // retrieves the appropriate year
    const today = new Date()
    let year = today.getFullYear()
    if (month > today.getMonth()) {year = year - 1}


    const [accounts, setAccounts] = useState([])

    const loadAccounts = async () => {
        const response = await fetch(`/accounts/${user}`)
        const data = await response.json()
        setAccounts(data)
    }

    // loads everything
    useEffect(() => {
        loadAccounts()
    }, [])

    return (
        <><div className='box'>
            <BasicBorders/>
            <NoBorderFlourish/>
            <Navigation currency={currency} lastUsed={lastUsed}/>
            <p></p>

            <h2>Financials in {monthName(month)}</h2>
            <div>Click on a section to view more details</div>
            <br></br>
            <NetTable data={["All Accounts", "All Accounts", accounts, currency, monthNumStr, month, year, lastUsed]}/>
            {accounts.map((account, index) => 
            <NetTable data={[account.account, account.account, accounts, currency, monthNumStr, month, year, lastUsed]} key={index}/>)}

            <p></p>
        </div></>
    )
}

export default PreviousMonth