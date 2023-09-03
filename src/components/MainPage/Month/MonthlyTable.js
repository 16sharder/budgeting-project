// The Month Table Component:
// Used on the MainPage and the PreviousSpendings Page
// Displays the table with all of the given month's spending data
        // uses the WeeklyRow Component to display its rows
        // includes each category in the header

import React, { useEffect, useState } from 'react';
import Week from "./WeeklyRow"

import { useSelector } from 'react-redux/es/hooks/useSelector';

import { organizeDaysEntries, retrieveMonth, retrieveWeekEntries } from '../../../helperfuncs/FetchFunctions';
import { calculateWeekTotals } from '../../../helperfuncs/OtherCalcs';
import { createMonthDates } from '../../../helperfuncs/DateCalculators';

function MonthlyTable({data}) {
    const user = useSelector(state => state.user.value)
    const currency = useSelector(state => state.currency.value)

    const [date, accountName, message, setMessage, viewWeek] = data
    
    let n = 7
    let d = 0
    if (date.getMonth() == (new Date()).getMonth()) d = -1

    // retrieves the information for the month to be displayed
    const [monthArr, setMonth] = useState([])
    const monthDatesArray = createMonthDates(date)

    const loadMonth = async () => {
        let monthArray = []
        for (let week of monthDatesArray) {
            if (week == monthDatesArray[4] && d == -1) n = 0
            // gets an array (7) of days, each day containing each entry for that day
            const days = await retrieveWeekEntries(week, user, accountName, n)
            let organizedDays = []
            for (let day of days){
                // sums the entries for each category for the day, returning an array of category sums
                const organized = await organizeDaysEntries(day, currency)
                organizedDays.push(organized)
            }
            // sums the entries for the week for each category
            let organizedWeek = calculateWeekTotals(organizedDays)
            organizedWeek[0] = week
            // adds each week's array of sums to an array for the month
            monthArray.push(organizedWeek)
        }
        setMessage(message)
        setMonth(monthArray)
    }


    // sums the entries for the month for each category
    const [total, setTotals] = useState(new Array(13).fill(0))

    const loadTotals = async () => {
        let totals = await retrieveMonth(Number(date.getMonth())+1, Number(date.getFullYear()), user, accountName)
        if (totals != undefined) setTotals(totals)
    }


    useEffect(() => {
        loadMonth()
        loadTotals()
    }, [])


    return(
        <table id="monthly">
            <thead>
                <tr className='toprow horizontalB'>
                    <th className='bold verticalB'></th>
                    {["Groceries", "Eating Out", "Clothing", "House Supplies", "Work Supplies", "Travel", "Bills", "Cash", "Emergency", "Other", "Unusual Expenses"].map(
                        (label, index) => <th key={index}>{label}</th>)}
                    <th className="verticalB">Total</th>
                </tr>
            </thead>
            <tbody>
                {monthArr.map((week, index) => <Week week={week} viewWeek={viewWeek} currency={currency} key={index}/>)}
                <tr className='horizontalB'>
                    <td className='corner verticalB'>Total</td>
                    {total.slice(1, 12).map((cat, index) => <td key={index}>{cat.toLocaleString('en', {style: "currency", currency})}</td>)}
                    <td className='verticalB'>{total[12].toLocaleString('en', {style: "currency", currency})}</td>
                </tr>
            </tbody>
        </table>
    )
}

export default MonthlyTable