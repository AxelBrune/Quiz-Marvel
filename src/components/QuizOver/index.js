import React,{Fragment, useEffect, useState} from 'react'
import {BsTrophy} from 'react-icons/bs'
import {RiRestartLine} from 'react-icons/ri'
import Loader from '../Loader'
import Modal from "../Modal"
import axios from 'axios'
const QuizOver = React.forwardRef((props, ref) => {

    const [asked, setAsked] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [characterInfo, setCharacterInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const {levelNames,score,maxQuestions,quizLevel,percent,loadLevelQuestions} = props;

    const API_PUBLIC_KEY = process.env.REACT_APP_MARVEL_API_KEY;
    const hash = '9cfe9b037eccab6694635eb8bfca0050';


    useEffect(() => {
        setAsked(ref.current)

        if(localStorage.getItem('marvelStorageDate')){
            const date = localStorage.getItem('marvelStorageDate');
            checkDataAge(date);
        }
    },[ref])

    const checkDataAge = date => {
        const today=Date.now();
        const duration = today-date;
        const  daysDifference = duration / (1000 * 3600 * 24);

        if (daysDifference >= 7){
            localStorage.clear();
            localStorage.setItem('marvelStorageDate', Date.now());
        }
    }

    const showModal = id => {
        setOpenModal(true);

        if (localStorage.getItem(id)){
            setCharacterInfo(JSON.parse(localStorage.getItem(id)));
            setLoading(false);
        }else{
            axios
            .get(`https://gateway.marvel.com/v1/public/characters/${id}?ts=1&apikey=${API_PUBLIC_KEY}&hash=${hash}`)
            .then(response => {
                setCharacterInfo(response.data);
                setLoading(false);
                localStorage.setItem(id,JSON.stringify(response.data));
                if(!localStorage.getItem('marvelStorageDate')){
                    localStorage.setItem('marvelStorageDate', Date.now());
                }
            })
            .catch(error =>{console.log(error);})
        }
     }

    const hideModal = () => {
        setOpenModal(false);
        setLoading(true);
    }

    const capitalizeFirstLetter = string => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const average = maxQuestions/2;

    if (score < average){
        //setTimeout(() => loadLevelQuestions(0),3000) si on veut tout recommencer à chque fois
        setTimeout(() => loadLevelQuestions(quizLevel),3000)
    }

    const decision = score >= average ? (
        <Fragment>
            <div className="stepsBtnContainer">
            {
                quizLevel < levelNames.length ?
                (
                    <Fragment>
                    <p className="successMsg">Bravo, vous avez réussi, passez à la suite ! </p>
                    <button
                     className="btnResult success"
                     onClick={() => loadLevelQuestions(quizLevel)}
                     >Niveau suivant</button>
                    </Fragment>
                )
                :
                (   
                    <Fragment>
                    <p className="successMsg"> <BsTrophy size='50'/> Bravo, vous avez réussi le quiz! </p>
                    <button 
                    className="btnResult gameOver"
                    onClick={() => loadLevelQuestions(0)}> <RiRestartLine size="30" /> Recommencer</button>
                    </Fragment>
                )
            }
            </div>
            <div className="percentage">
                <div className="progressPercent">Réussite : {percent}%</div>
                <div className="progressPercent">Note : {score}/{maxQuestions}</div>
            </div>
        </Fragment>
    ) 
    :
    (
        <Fragment>
            <div className="stepsBtnContainer">
                <p className="failureMsg">Vous avez échoué</p>
            </div>
            <div className="percentage">
            <div className="progressPercent">Réussite : {percent}%</div>
                <div className="progressPercent">Note : {score}/{maxQuestions}</div>
            </div>
        </Fragment>
    )


    const questionAnswer = score >= average ? (
        asked.map(question => {
            return(
                <tr key={question.id}>
                    <td>{question.question}</td>
                    <td>{question.answer}</td>
                    <td>
                        <button className="btnInfo"
                        onClick={()=>showModal(question.heroId)}
                        >Infos</button>
                    </td>
                </tr>
            )
        })
    )
    :
    (
        <tr>
            <td colSpan="3">
                <Loader 
                message={"Pas de réponses d'affichées car vous avez échoué"}
                styling={{textAlign: "center", color: 'red'}}
                />
            </td>
        </tr>
    )
    
        const resultInModal = !loading ? (
            <Fragment>
                <div className="modalHeader">
                    <h2>{characterInfo.data.results[0].name}</h2>
                </div>
                <div className="modalBody">
                        <div className="comicImage">
                            <img  
                            src={characterInfo.data.results[0].thumbnail.path+'.'+characterInfo.data.results[0].thumbnail.extension} 
                            alt={characterInfo.data.results[0].name}
                            />
                            <p>{characterInfo.attributionText}</p>
                        </div> 
                        <div className="comicDetails">
                            <h3>Description</h3>
                            {
                                characterInfo.data.results[0].description ?
                                <p>{characterInfo.data.results[0].description}</p>
                                : <p>Description non renseignée par l'API Marvel</p>
                            }
                            <h3>Plus d'infos</h3>
                            {
                                characterInfo.data.results[0].urls &&
                                characterInfo.data.results[0].urls.map((url,index) => {
                                    return <a 
                                        key={index}
                                        href={url.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        >
                                            {capitalizeFirstLetter(url.type)}
                                        </a>
                                })
                            }
                        </div>
                </div>
                <div className="modalFooter">
                    <button className="modalBtn" onClick={hideModal}>Fermer</button>
                </div>
            </Fragment>
        )
        :
        (
            <Fragment>
                <div className="modalHeader">
                    <h2>Réponse de Marvel en attente</h2>
                </div>
                <div className="modalBody">
                    <Loader />
                </div>
            </Fragment>
        )

    return (
        <Fragment>
        {decision}

        <hr />
        <p>Les réponses aux questions posées : </p>

        <div className="answerContainer">
            <table className="answers">
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>Réponse</th>
                        <th>Infos</th>
                    </tr>
                </thead>
                <tbody>
                    {questionAnswer}
                </tbody>
            </table>
        </div>

        <Modal showModal={openModal} hideModal={hideModal}>
            {resultInModal}
        </Modal>

        </Fragment>
    )
})

export default React.memo(QuizOver)