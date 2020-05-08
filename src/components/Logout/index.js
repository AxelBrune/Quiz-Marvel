import React, {useState, useEffect, useContext} from 'react'
import {firebaseContext} from "../Firebase"
import ReactTooltip from "react-tooltip"
const Logout = () =>{

    const [checked, setChecked] = useState(false);
    const firebase = useContext(firebaseContext);

    useEffect(() => {
        if(checked){
            console.log("Déconnexion");
            firebase.signOutUser()
        }
    }, [checked, firebase])

    const handleSwitch = e => {
        setChecked(e.target.checked);
    }

    return (
        <div className="logoutContainer">
            <label className="switch">
                <input 
                    type="checkbox"
                    checked={checked}
                    onChange={handleSwitch}
                />
                <span className="slider round" data-tip="Cliquez pour vous déconnecter"></span>
                <ReactTooltip place="left" effect="solid"/>
            </label>
        </div>
    )
}

export default Logout;