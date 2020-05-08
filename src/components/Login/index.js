import React, {useState, useEffect, useContext} from 'react'
import {Link} from "react-router-dom"
import {firebaseContext} from "../Firebase"

const Login = (props) => {

    const firebase = useContext(firebaseContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [btn, setBtn] = useState(false);
    useEffect(() => {
        if(password.length > 5 && email !== ''){
            setBtn(true);
        }
        else if (btn){
            setBtn(false);
        }
    },[password,email,btn])

    const handleSubmit = e => {
        e.preventDefault();
        firebase.loginUser(email, password)
        .then( user => {
            setEmail("");
            setPassword("");
            props.history.push('/welcome');
        })
        .catch(error =>{
            setError(error);
            setEmail("");
            setPassword("");
        })
    }

    return (
        <div className="signUpLoginBox">
            <div className="slContainer">
                <div className="formBoxLeftLogin">

                </div>
                <div className="formBoxRight">
                    <div className="formContent">
                    <h2>CONNEXION</h2>

                        {error !== '' && <span>{error.message}</span>}

                        <form onSubmit={handleSubmit}>
                            <div className="inputBox">
                                <input type="email" toComplete="off" required onChange={e=> setEmail(e.target.value)} value={email}/>
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="inputBox">
                                <input type="password" autoComplete="off" required onChange={e => setPassword(e.target.value)} value={password}/>
                                <label htmlFor="password">Mot de Passe</label>
                            </div>

                            {btn ? <button>Connexion</button> : <button disabled>Connexion</button>}
                        </form>
                        <div className="linkContainer">
                            <Link className="simpleLink" to="/signup">Pas inscrit ? Inscrivez-vous</Link>
                            <br />
                            <Link className="simpleLink" to="/forgetpassword">Vous avez oublié votre mot de passe ?</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login