const CollapsedReducer=(prevState={
    collapsed:false
},action)=>{
    var newState = {...prevState}
    let{type}=action
    switch(type){
        case 'change_collapsed':
            newState.collapsed=!newState.collapsed
            return newState
        default:
            return prevState
    }
    
}

export default CollapsedReducer