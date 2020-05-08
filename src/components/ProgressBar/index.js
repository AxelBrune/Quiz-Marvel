import React, {Fragment} from 'react'

const ProgressBar = ({idQuestion,maxQuestions}) => {


    const getPercentage = (totalQuestions, questionId) => {
        return (100/totalQuestions)*questionId;
    } 

    const actualQuestion=idQuestion +1;
    const percentage = getPercentage(maxQuestions, actualQuestion);

    return (
        <Fragment>
        <div className="percentage"> 
        <div className="progressPercent">{`Question ${actualQuestion}/${maxQuestions}`}</div>
    <div className="progressPercent">{`Progression : ${percentage}%`}</div>
        </div>
        <div className="progressBar">
                <div className="progressBarChange" style={{width: `${percentage}%`}}></div>
        </div>
        </Fragment>
    )
}

export default React.memo(ProgressBar)