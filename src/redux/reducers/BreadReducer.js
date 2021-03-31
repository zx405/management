const BreadReducer=(prevState={
    title:['首页']
},action)=>{
    var newState = {...prevState}
    let{type,payload}=action
    switch(type){
        case 'change_title':
            newState.title=payload
            return newState
        default:
            return prevState
    }
    
}

export default BreadReducer