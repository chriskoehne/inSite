import React, {useState} from 'react';
import {Link, Redirect, useHistory} from "react-router-dom";

export default function Login() {

    const [username, setUser] = useState('');
    const [password, setPass] = useState('');

    return (
        <div className="container">
            <div className="login">
                <h2>Login</h2>
                <form>
                    <input type="text" id="username" onChange={e => setUser(e.target.value)} placeholder="Username"/> <br/>
                    <input type="password" id="password" onChange={e => setPass(e.target.value)} placeholder="Password"/>
                    <div className="buttonGroup">
                        <button type="submit" name="btn">Login
                        </button>
                    </div>
                </form>
            </div>

        </div>
    )
}