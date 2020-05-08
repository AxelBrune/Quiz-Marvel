import React from 'react'
import errorImg from "../../images/Avengers.png"

const centerH2 = {
    textAlign: 'center',
    marginTop: '50px'
}

const centerImg = {
    display: 'block',
    margin: "40px auto"
}

const ErrorPage = () => {
    return (
        <div className="quiz-bg">
            <div className="container">
                <h2 style={centerH2}>Cette page n'existe pas</h2>
                <img src={errorImg} alt="erreur" style={centerImg} />
            </div>
        </div>
    )
}

export default ErrorPage