// The Choose Month Page:
// Shown when the user clicks Previous Spendings in the navigation bar
// Asks the user for a month and bank account to be displayed
// Sends the user to the PreviousSpendings Page

import React from 'react';
import {useState} from "react"
import {useHistory, useLocation} from "react-router-dom"

import BorderDecorations, {BorderDecorationsBottom} from '../../components/Styling/BorderDecoration';
import { monthName } from '../../helperfuncs/DateCalculators';

function ChooseMonth () {
    const location = useLocation()
    const user = location.state.user
    let lastUsed = location.state.lastUsed
    let currency = location.state.currency

    const today = new Date

    const [month, setMonth] = useState(today.getMonth())

    const history = useHistory()

    // event listener for when user presses Enter
    const input = document.getElementById("input")
    if (input != undefined) {
        input.addEventListener("keypress", ({key}) => {
            if (key == "Enter") {
                send(input.children[2].children[0].value)}
        })
    }

    const send = (monthVal) => {
        history.push({pathname:"/previous-month", state: {user: user, currency: currency, month: monthVal, lastUsed: lastUsed}})
    }


    // sets the months to be displayed in the selection
    let base = today.getMonth()

    const months = [base]
    for (let idx=0; idx < 11; idx += 1){
        let mo = base - 1
        if (base == 0) {mo = 11}

        base = mo
        months.push(mo)
    }



    return (
        <>
            <BorderDecorations />
            <h3>Please choose a month to view</h3>


            <table className='invisBackground'><tbody><tr id='input'>
            <td><select
                value={month}
                onChange={newN => {setMonth(newN.target.value)}}>
                    {months.map((month) => <option value={month}>{monthName(month)}</option>)}
            </select></td>
            </tr></tbody></table>

            <p></p>
            <button className="rightButton" onClick={() => send(month)}>Continue</button>
            <BorderDecorationsBottom />
        </>
    )
}

export default ChooseMonth