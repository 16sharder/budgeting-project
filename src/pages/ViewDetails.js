import React from 'react';
import {useState, useEffect} from "react"
import {useHistory, useLocation} from "react-router-dom"

import {retrieveDayEntries} from "../helperfuncs/FetchFunctions"
import BorderDecorations, {BorderDecorationsBottom} from '../components/BorderDecoration';

function ViewDetails () {
    const location = useLocation()
    const user = location.state.user
    const date = location.state.date
    const weekDates = location.state.weekDates
    const category = location.state.category
    const currency = location.state.currency
    const history = useHistory()

    const [entries, setEntries] = useState([])


    const loadDay = async () => {
        const result = await retrieveDayEntries(date, user)
        let resultCopy = result.slice()
        for (let entry of result){
            if (entry.category != category) {
                resultCopy.splice(resultCopy.indexOf(entry), 1)
            }
        }
        setEntries(resultCopy)
    }

    useEffect(() => {
        loadDay()
    }, [])

    return (
        <>
            <BorderDecorations />
            <h2>{category} entries for {date}</h2>
            <div>
                {entries.map((entry, index) => 
                    <table key={index}>
                        <thead><tr><th className='single toprow color2'>Entry {index+1}</th></tr></thead>
                        <tbody><tr><td className='single color1'><div>Account: {entry.account}</div><div>Amount: {entry.currency}{entry.amount.toFixed(2)}</div><div>Description: {entry.description}</div><div></div></td></tr></tbody>
                    </table>
                )}
            </div>

            <table><tbody><tr>
                <td className='invisBackground'><button onClick={() => history.push({pathname:"/weekly-view", state: {user: user, dates: weekDates, currency: currency}})} className="currency">Return to weekly view</button></td>
                <td className='invisBackground'><button onClick={() => history.push({pathname:"/main", state: {user: user, currency: currency}})} className="button">Return to monthly view</button></td>
            </tr></tbody></table>
            <BorderDecorationsBottom />
        </>
    )
}

export default ViewDetails
