const ListReducer=(prevState={
    list:[]
},action)=>{
    var newState = {...prevState}
    let {type,payload} = action
    switch(type){
        case "change_list":
            newState.list = payload
            return newState
        default :
            return prevState
    }
}
export default ListReducer