import React from 'react';
import {useState} from "react"
import {useHistory} from "react-router-dom"

import BorderDecorations, {BorderDecorationsBottom} from '../components/BorderDecoration';

function LoginPage () {
    const [name, setName] = useState("")

    const history = useHistory()

    const send = () => {
        history.push({pathname:"/main", state: {user: name, currency: "€"}})
    }

    return (
        <>
            <BorderDecorations />
            <h2>Welcome to your budgeting tool!</h2>

            <p className='color5'>This tool is designed to help users get a better understanding of their monthly expenses.
                We give you one place where you can see all of your expenses across multiple bank accounts.  
                Our ultimate goal is to help you save money by being aware of what you're spending.
            </p>

            <div></div>

            <h4>Please enter your name to continue:</h4>
            <input className=""
                type="text"
                placeholder="Name"
                value={name}
                onChange={newN => {setName(newN.target.value)}} />
            <p></p>
            <button className="button" onClick={send}>Continue</button>
            <BorderDecorationsBottom />
        </>
    )
}

export default LoginPage