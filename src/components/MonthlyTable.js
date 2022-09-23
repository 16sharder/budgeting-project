import React from 'react';
import Week from "./WeeklyRow"

function MonthlyTable({month, viewWeek, total, currency}) {
    return(
        <table id="monthly">
            <thead>
                <tr className='color2'>
                    <th className='bold toprow'></th>
                    <th className='toprow'>Groceries</th>
                    <th className='toprow'>Eating Out</th>
                    <th className='toprow'>Clothing</th>
                    <th className='toprow'>House Supplies</th>
                    <th className='toprow'>Work Supplies</th>
                    <th className='toprow'>Travel</th>
                    <th className='toprow'>Bills</th>
                    <th className='toprow'>Cash</th>
                    <th className='toprow'>Emergency</th>
                    <th className='toprow'>Other</th>
                    <th className="color2 toprow totalc">Total</th>
                    <th className='toprow bold'></th>
                </tr>
            </thead>
            <tbody>
                {month.map((week, index) => <Week week={week} viewWeek={viewWeek} currency={currency} key={index}/>)}
                <tr>
                    <td className='corner bold totalr color2'>Total</td>
                    <td className='totalr'>{currency}{total[1].toFixed(2)}</td>
                    <td className='totalr'>{currency}{total[2].toFixed(2)}</td>
                    <td className='totalr'>{currency}{total[3].toFixed(2)}</td>
                    <td className='totalr'>{currency}{total[4].toFixed(2)}</td>
                    <td className='totalr'>{currency}{total[5].toFixed(2)}</td>
                    <td className='totalr'>{currency}{total[6].toFixed(2)}</td>
                    <td className='totalr'>{currency}{total[7].toFixed(2)}</td>
                    <td className='totalr'>{currency}{total[8].toFixed(2)}</td>
                    <td className='totalr'>{currency}{total[9].toFixed(2)}</td>
                    <td className='totalr'>{currency}{total[10].toFixed(2)}</td>
                    <td className='totalc totalr'>{currency}{total.slice(1).reduce((a, b) => a + b, 0).toFixed(2)}</td>
                    <td className='corner totalc totalr bold'></td>
                </tr>
            </tbody>
        </table>
    )
}

export default MonthlyTable