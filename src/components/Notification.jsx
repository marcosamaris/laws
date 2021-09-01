import React from 'react'
import './OpenProject.css'

export const showErrMsg = (msg) => {
    return <div className="errMsg">{msg}</div>
}

export const showSucessMsg = (msg) => {
    return <div className="successMsg">{msg}</div>
}