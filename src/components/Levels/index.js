import React,{useEffect,useState} from 'react'
import Stepper from 'react-stepper-horizontal'
const Levels = ({nomNiveaux,quizLevel}) => {

    const [levels,setLevels] = useState([])

    useEffect(() => {
        const quizSteps = nomNiveaux.map(level => ({title: level.toUpperCase()}))
        setLevels(quizSteps)
    },[nomNiveaux])

    return (
        <div className="levelsContainer" style={{background: 'transparent'}}>
                <Stepper 
                    steps={levels} 
                    activeStep={quizLevel} 
                    circleTop={0}
                    activeTitleColor={'#d31017'}
                    activeColor={'#d31017'}
                    completeTitleColor={'#2ecc71'}
                    completeColor={'#2ecc71'}
                    completeBarColor={'#2ecc71'}
                    barStyle={'dashed'}
                    size={45}
                    circleFontSize={20}
                />
        </div>
    )
}

export default React.memo(Levels)