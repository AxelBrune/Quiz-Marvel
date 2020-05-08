import React,{useState, useContext } from 'react'
import {firebaseContext} from "../Firebase"
import { Link } from 'react-router-dom';

const Signup = (props) => {

   const firebase = useContext(firebaseContext);

    const data = {
        pseudo: '',
        email: '',
        password: '',
        confirmPassword: ''
    }


    const [loginData, setLoginData] = useState(data);

    const [error, setError] = useState('');

    const handleChange = e => {
        setLoginData({...loginData, [e.target.id]: e.target.value})
    } 

    const handleSubmit = e => {
        e.preventDefault();
        const {email, password, pseudo} = loginData;
        firebase.signUpUser(email,password)
        .then(authUser =>{
            return firebase.user(authUser.user.uid).set({
                pseudo,
                email
            })
        })
        .then(() => {
            setLoginData({...data});
            props.history.push('/welcome');
        })
        .catch(error => {
            setError(error);
            setLoginData({...data});
        })
    }
    
    const {pseudo, email, password, confirmPassword} = loginData;

    const btn = pseudo === '' || email === '' || password === '' || password !== confirmPassword 
    ? <button disabled>Inscription</button> : <button>Inscription</button>


    const errorMsg = error !== '' && <span>{error.message}</span>

    return (
        <div className="signUpLoginBox">
            <div className="slContainer">
                <div className="formBoxLeftSignup">

                </div>
                <div className="formBoxRight">
                    <div className="formContent">
                    <h2>INSCRIPTION</h2>
                        {errorMsg}
                        <form onSubmit={handleSubmit}>
                            <div className="inputBox">
                                <input type="text" id="pseudo" autoComplete="off" required onChange={handleChange} value={pseudo}/>
                                <label htmlFor="pseudo">Pseudo</label>
                            </div>
                            <div className="inputBox">
                                <input type="email" id="email" autoComplete="off" required onChange={handleChange} value={email}/>
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="inputBox">
                                <input type="password" id="password" autoComplete="off" required onChange={handleChange} value={password}/>
                                <label htmlFor="password">Mot de Passe</label>
                            </div>
                            <div className="inputBox">
                                <input type="password" id="confirmPassword" autoComplete="off" required onChange={handleChange} value={confirmPassword}/>
                                <label htmlFor="confirmPassword">Confirmer votre mot de passe</label>
                            </div>

                            {btn}
                        </form>
                        <div className="linkContainer">
                            <Link className="simpleLink" to="/login">Déjà inscrit ? Connectez-vous</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Signup