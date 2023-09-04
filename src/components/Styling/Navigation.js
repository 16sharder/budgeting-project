// The Navigation Bar Component:
// Used in all pages without forms
// Displays the navigation bar with links to important pages

import React from "react";
import { useHistory } from "react-router-dom";

import { useDispatch } from 'react-redux'
import { login } from "../../redux/userSlice";
import { setAccounts } from "../../redux/accountsSlice";
import { setRecent } from "../../redux/historySlice";

function Navigation () {
    const history = useHistory()
    const dispatch = useDispatch()

    const logout = () => {
        dispatch(login(undefined))
        dispatch(setAccounts([]))
        dispatch(setRecent(""))
        history.push("/")
    }
    
    return (
        <>
            <table className="navigator">
                <thead>
                    <tr>
                        <td className="navigator" onClick={() => history.push({pathname:"/main"})}>Home</td>
                        <td className="navigator" onClick={() => history.push({pathname:"/accounts-view"})}>Accounts Overview</td>
                        <td className="navigator" onClick={() => history.push({pathname:"/choose-month"})}>Previous Spendings</td>
                        <td className="navigator" onClick={logout}>Log Out</td>
                    </tr>
                </thead>
            </table>
        </>
    )
}

export default Navigation