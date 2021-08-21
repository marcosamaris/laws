
const initialState = {
    json: ""
}

const stateReducer = (state = initialState, action) => {
    switch(action.type){
        case "actions/set":{
            return action
        }
        default:
            return state
    }
}

export default stateReducer