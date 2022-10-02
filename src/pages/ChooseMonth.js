import React from 'react';
import {useState} from "react"
import {useHistory, useLocation} from "react-router-dom"

import BorderDecorations, {BorderDecorationsBottom} from '../components/BorderDecoration';

function ChooseMonth () {
    const location = useLocation()
    const user = location.state.user
    let currency = location.state.currency

    const today = new Date

    const [month, setMonth] = useState(today.getMonth())

    const history = useHistory()

    const send = () => {
        history.push({pathname:"/previous-spendings", state: {user: user, currency: currency, month: month}})
    }

    return (
        <>
            <BorderDecorations />
            <h3>Please choose a month to view</h3>

            <select
                value={month}
                onChange={newN => {setMonth(newN.target.value)}}>
                    <option value={0}>January</option>
                    <option value={1}>February</option>
                    <option value={2}>March</option>
                    <option value={3}>April</option>
                    <option value={4}>May</option>
                    <option value={5}>June</option>
                    <option value={6}>July</option>
                    <option value={7}>August</option>
                    <option value={8}>September</option>
                    <option value={9}>October</option>
                    <option value={10}>November</option>
                    <option value={11}>December</option>
            </select>

            <p></p>
            <button className="button" onClick={send}>Continue</button>
            <BorderDecorationsBottom />
        </>
    )
}

export default ChooseMonth