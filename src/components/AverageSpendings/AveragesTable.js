// The Averages Table Component:
// Used on the MainPage
// Displays the table with the user's monthly spending data for the past 6 months
        // uses the MonthlyRow Component to display its rows
        // includes each category in the header

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { retrieveMonth, retrieveMultipleMonths } from '../../helperfuncs/FetchFunctions';
import Month from './MonthlyRow';

function AveragesTable({user, currency}) {
    const history = useHistory()
    const today = new Date()
    let month = (today.getMonth())

    // retrieves each individual month's spendings
    const [results, setResults] = useState([])

    const loadMonths = async () => {
        let res = []
        let y = 1
        let nums = [month]
        let next = month
        while (y != 6) {
            if (next == 1) {
                next = 12
            } else next = next - 1
            nums.push(next)
            y += 1
        }
        for (let month of nums) {
            let mo = await retrieveMonth(month, user)
            if (mo[11] != 0) res.push(mo)
            if (month == 0) {
                month = 12
            } else {month -= 1}
        }
        setResults(res.reverse())
        return res
    }



    // retrieves the persons average spendings for the past 6 months
    const [aveGroc, setGroc] = useState(0)
    const [aveEat, setEat] = useState(0)
    const [aveClo, setClo] = useState(0)
    const [aveHous, setHous] = useState(0)
    const [aveWork, setWork] = useState(0)
    const [aveTrav, setTrav] = useState(0)
    const [aveBil, setBil] = useState(0)
    const [aveCash, setCash] = useState(0)
    const [aveEmr, setEmr] = useState(0)
    const [aveOth, setOth] = useState(0)
    const [aveTot, setTot] = useState(0)

    const loadAve = async () => {
        const months = await loadMonths()
        const res = await retrieveMultipleMonths(months, user)
        if (res[11] == 0) res[11] = 1
        console.log(res)

        setGroc(res[0] / res[11])
        setEat(res[1] / res[11])
        setClo(res[2] / res[11])
        setHous(res[3] / res[11])
        setWork(res[4] / res[11])
        setTrav(res[5] / res[11])
        setBil(res[6] / res[11])
        setCash(res[7] / res[11])
        setEmr(res[8] / res[11])
        setOth(res[9] / res[11])
        setTot(res[10] / res[11])
    }

    useEffect(() => {
        loadMonths()
        loadAve()
    }, [])

    // sends the user to a page displaying the desired week's information
    const viewMonth = async month => {
        history.push({pathname:"/previous-spendings", state: {user: user, currency: currency, month: month, accountName: "All Accounts"}})
    }

    return(
        <table>
            <thead>
                <tr className='bold horizontalB color2'>
                    <th className='corner verticalB'>Month</th>
                    <th>Groceries</th>
                    <th>Eating Out</th>
                    <th>Clothing</th>
                    <th>House Supplies</th>
                    <th>Work Supplies</th>
                    <th>Travel</th>
                    <th>Bills</th>
                    <th>Cash</th>
                    <th>Emergency</th>
                    <th>Other</th>
                    <th className="bold verticalB">Total</th>
                </tr></thead>
            <tbody>
            {results.map((month, index) => <Month month={month} viewMonth={viewMonth} currency={currency} key={index}/>)}
                <tr className='horizontalB'>
                    <th className='corner verticalB'>Average</th>
                    <th>{currency}{aveGroc.toFixed(2)}</th>
                    <th>{currency}{aveEat.toFixed(2)}</th>
                    <th>{currency}{aveClo.toFixed(2)}</th>
                    <th>{currency}{aveHous.toFixed(2)}</th>
                    <th>{currency}{aveWork.toFixed(2)}</th>
                    <th>{currency}{aveTrav.toFixed(2)}</th>
                    <th>{currency}{aveBil.toFixed(2)}</th>
                    <th>{currency}{aveCash.toFixed(2)}</th>
                    <th>{currency}{aveEmr.toFixed(2)}</th>
                    <th>{currency}{aveOth.toFixed(2)}</th>
                    <th className='verticalB'>{currency}{aveTot.toFixed(2)}</th>
                </tr>
            </tbody>
        </table>
    )
}

export default AveragesTable