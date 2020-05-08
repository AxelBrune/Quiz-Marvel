import React, {useState, Fragment, useContext, useEffect} from 'react'
import Logout from "../Logout"
import Quiz from "../Quiz"
import {firebaseContext} from "../Firebase"
import Loader from "../Loader"
const Welcome = (props) => {

    const [user, setUser] = useState(null);
    const firebase = useContext(firebaseContext);
    const [userData, setUserData] = useState({});

    useEffect(()=>{
        let listener = firebase.auth.onAuthStateChanged(user => {
            user ? setUser(user) : props.history.push('/');
        })

        if (user !== null){
            firebase.user(user.uid)
            .get()
            .then(doc => {
                if (doc && doc.exists){
                    const myData = doc.data();
                    setUserData(myData);
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
        return () => {
            listener();
        }

    },[user])

    return user === null ? (
        <Fragment>
            <Loader 
                message={"Chargement..."}
                styling={{textAlign: 'center', color: '#FFFFFF'}}
            />
        </Fragment>
    ) : (
        <div className="quiz-bg">
            <div className="container">
                <Logout />
                <Quiz userData={userData}/>
            </div>
        </div>
    )
}
export default Welcome