import React, { useCallback } from 'react';
import { useState } from "react"
import "../styles/Login.css"
import Notification from "../components/Notification"
import {ThreeDots } from 'react-loader-spinner';
import { useGlobalState } from 'state-pool';

function Login(props){
    const [apiLink,] = useGlobalState('apiLink')
    const [email,setEmail] = useState(null)
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
    const [mdp, setMdp] = useState(null)
    const [loginError, setLoginError] = useState(null) 
    const [loading , setLoading] = useState(false)

    const [user,setUser, updateUser]= useGlobalState("user")
    let saveUser= (newUser) =>{
        updateUser(function(user){
            console.log(newUser)
            var nom = Object.keys(newUser)
            nom.forEach(element => {
                user[element] = newUser[element]
            });
        })
        console.log(user)
    }
    const doLogin = () => {
        setLoading(true)
        console.log(JSON.stringify({ username: email, password: mdp}));
        fetch(apiLink +'/api/v1/loginWeb', {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'mode':'no-cors'
            },
            body:JSON.stringify({ 
                username: email,
                password: mdp 
            })
        }).then( response => response.json())
        .then((jsonData) =>
        {
            setLoading(false)
            console.log("waiting for response")
            const tokenData = jsonData.token;
            console.log(jsonData)
            if(tokenData != null && tokenData !=""){
                localStorage.setItem("token", tokenData);
                localStorage.setItem("user",JSON.stringify(jsonData.user))
                const user = jsonData.user
                if(user.role.id === 1)
                {
                    console.log('redirection to backOffice')
                    window.location.replace("/accueil");
                }
                else if (user.role.id === 2)
                {console.log('redirection to frontOffice')
                    window.location.replace("/frontOffice");
                }
            }else{
                setLoginError("Login ou mots de passe incorrect.")
                  setNotify({
                    isOpen: true,
                    message: 'Login ou mot de passe incorrect',
                    type: 'error'
            })
            }
        });
    }

    return (
        <div className="container">
            <div className='Login'>
                <div className="conteneur-logo">
                    <div className="logo">
                        <img src="./img/big-loud-speaker.png" alt="logo" />
                    </div>
                </div>
                <div className="formulaire">
                    <form>
                        <h1>Connexion</h1>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <label className='formLabel' htmlFor='email'>email:</label>
                                    </td>
                                    <td>
                                        <input
                                            id="email"
                                            type="text"
                                            placeholder="email"
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label className='formLabel' htmlFor='password'>mot de passe:</label>
                                    </td>
                                    <td>
                                        <input
                                            id="password"
                                            type="password"
                                            placeholder="mot de passe"
                                            onChange={(e) => setMdp(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        {/* <input
                                            type="submit"
                                            value="se connecter"
                                            className='btn connexion'
                                        /> */}
                                        <div className="btn connexion" onClick={()=>{
                                            doLogin();
                                        }} onKeyDown={keyBoardEvent}>se connecter</div>
                                    </td>
                                </tr>    
                            </tbody>   
                        </table>
                    </form>
                    <div className="warning">
                        {
                            loading ? (
                                <ThreeDots type="ThreeDots" color="#188CDBFF" height={75} width={75} />
                            ) : (
                                  <></>
                            )
                        }
                    </div>
                </div>
            </div>
            <Notification
                notify={notify}
                setNotify={setNotify}
            />
        </div>
    );
}

export default Login;