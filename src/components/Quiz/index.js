import React, {Component, Fragment} from 'react'
import Levels from "../Levels/"
import ProgressBar from "../ProgressBar/"
import {QuizMarvel} from "../quizMarvel/"
import {toast} from 'react-toastify'
import QuizOver from "../QuizOver"
import 'react-toastify/dist/ReactToastify.min.css'
import {TiChevronRightOutline} from 'react-icons/ti'

toast.configure();
const initialState = {
    quizLevel: 0,
    maxQuestions: 10,
    storedQuestions: [],
    question: null,
    options: [],
    idQuestion: 0,
    btnDisabled: true,
    userAnswer: null,
    score: 0,
    showWelcome: false,
    quizEnd: false,
    percent: null
}

const nomNiveaux =  ["debutant", "confirme", "expert"]
class Quiz extends Component{

    constructor(props){
        super(props)
        this.state = initialState;
        this.storedDataRef = React.createRef();
    }        

    loadQuestions = niveau => {
        const fetchedArrayQuiz = QuizMarvel[0].quizz[niveau];
        if(fetchedArrayQuiz.length >= this.state.maxQuestions){

            this.storedDataRef.current = fetchedArrayQuiz;

            const newArray = fetchedArrayQuiz.map( ({answer, ...keepRest}) => keepRest);
            this.setState({ storedQuestions: newArray})
        }
    }

    showToastMsg = pseudo => {
        if (!this.state.showWelcome){

            this.setState({showWelcome:true})

            toast.warn( `Bienvenue ${pseudo}`, {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            }
            )
        }        
    }

    componentDidMount(){this.loadQuestions(nomNiveaux[this.state.quizLevel]);}

    componentDidUpdate(prevProps, prevState){
        const {
            maxQuestions,
            storedQuestions,
            idQuestion,
            score,
            quizEnd
            } = this.state;

        if ((storedQuestions !== prevState.storedQuestions) && storedQuestions.length){
            this.setState({
                question: storedQuestions[idQuestion].question,
                options: storedQuestions[idQuestion].options
            })
        }
        if ((idQuestion !== prevState.idQuestion) && storedQuestions.length){
            this.setState({
                question: storedQuestions[idQuestion].question,
                options: storedQuestions[idQuestion].options,
                userAnswer: null,
                btnDisabled: true
            })
        }

        if(quizEnd !== prevState.quizEnd){
            const grade = this.getPercent(maxQuestions, score);
            this.gameOver(grade);
        }

        if (this.props.userData.pseudo !== prevProps.userData.pseudo){
            this.showToastMsg(this.props.userData.pseudo);
        }
    }

    handleAnswerClicked = selectedAnswer => {
        this.setState({
            userAnswer: selectedAnswer,
            btnDisabled: false
        })
    }

    gameOver = percent =>{

       if(percent >= 50){
            this.setState({
                quizLevel: this.state.quizLevel + 1,
                percent
            })
       }
       else{
        this.setState({
            percent          
        })
       }
    }

    loadLevelQuestions = param => {
        this.setState({...initialState, quizLevel: param})
        this.loadQuestions(nomNiveaux[param]);
    }

    getPercent = (max, score) => (score/max) *100; 

    nextQuestion = () => {
        if(this.state.idQuestion === this.state.maxQuestions -1){
            this.setState({quizEnd: true})
        }
        else{
            this.setState(prevState => ({idQuestion: prevState.idQuestion +1}))
        }

        const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer;
        if (this.state.userAnswer === goodAnswer){
            this.setState(prevState => ({score: prevState.score +1}))
            toast.success('Bonne réponse', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true, 
                pauseOnHover: true,
                draggable: true
            });
        }
        else{
            toast.error('Mauvaise réponse', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true, 
                pauseOnHover: true,
                draggable: true
            });
        }
    }

    render(){

        const {
        quizLevel,
        maxQuestions,
        question,
        options,
        idQuestion,
        btnDisabled,
        userAnswer,
        score,
        quizEnd,
        percent
        } = this.state;

       const displayOptions = options.map((option, index) => {
            return (
                <p  key={index}
                className={`answerOptions ${userAnswer === option ? "selected" : null}`} 
                onClick={() => this.handleAnswerClicked(option)}><TiChevronRightOutline /> {option}</p>
            )
        })

        const {pseudo} = this.props.userData;

       return  quizEnd ? (
            <QuizOver 
                ref={this.storedDataRef}
                levelNames={nomNiveaux}
                score={score}
                maxQuestions={maxQuestions}
                quizLevel={quizLevel}
                percent={percent}
                loadLevelQuestions={this.loadLevelQuestions}
            />
        )
        :
        (
            <Fragment>
                <Levels 
                    nomNiveaux={nomNiveaux}
                    quizLevel={quizLevel}
                />
                <ProgressBar idQuestion={idQuestion} maxQuestions={maxQuestions}/>
                <h2>{question}</h2>
                {displayOptions}

                <button 
                    className="btnSubmit" 
                    disabled={btnDisabled}
                    onClick={this.nextQuestion}
                    >
                    {idQuestion < maxQuestions -1 ? "Suivant" : "Terminer"}
                </button>
            </Fragment>
        )
        
    }
}

export default Quiz;