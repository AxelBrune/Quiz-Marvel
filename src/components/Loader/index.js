import React,{Fragment} from 'react'

const Loader = ({message,styling}) =>{
    return (
        <Fragment>
            <div className="loader"></div>
            <p style={styling}>{message}</p>
        </Fragment>
    )
}

export default Loader;