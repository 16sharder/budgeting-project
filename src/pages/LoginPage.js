// The Login Page:
// Shown when the user firsts arrives at the website
// Asks a user for their name so as to connect to any of their existing data
// Sends the user to the MainPage

import React from 'react';
import {useState} from "react"
import {useHistory} from "react-router-dom"

import { useDispatch } from 'react-redux'
import { login } from '../redux/userSlice';
import { setAccounts } from '../redux/accountsSlice';
import { resetLink, setRecent } from '../redux/historySlice';

import BasicBorders, {BorderFlourish} from '../components/Styling/BorderDecoration';

function LoginPage () {
    const [name, setName] = useState("")
    const dispatch = useDispatch()

    const history = useHistory()

    // event listener for when user presses Enter
    const input = document.getElementById("input")
    if (input != undefined) {
        input.addEventListener("keypress", ({key}) => {
            if (key == "Enter") {
                send(input.value)}
        })
    }

    const send = async (nameVal) => {
        dispatch(login(nameVal))

        const response = await fetch(`/accounts/${nameVal}`)
        const accounts = await response.json()
        dispatch(setAccounts(accounts))

        dispatch(setRecent(accounts[0].account))
        dispatch(resetLink())
        
        history.push({pathname:"/main"})
    }

    return (
        <>
            <BasicBorders/>
            <BorderFlourish/>
            <h2>Welcome to your budgeting tool!</h2>

            <p className='color5'>This tool is designed to help users get a better understanding of their monthly expenses.
                We give you one place where you can see all of your expenses across multiple bank accounts.  
                Our ultimate goal is to help you save money by being aware of what you're spending.
            </p>

            <div></div>

            <h4>Please enter your name to continue:</h4>
            <input id="input"
                type="text"
                placeholder="Name"
                value={name}
                onChange={newN => {setName(newN.target.value)}} />
            <p></p>
            <button className="rightButton" onClick={() => send(name)}>Continue</button>
            
        </>
    )
}

export default LoginPage
