import {useState,useEffect} from 'react'
import axios from 'axios'
function usePublish(type){
    const [dataSource, setdataSource] = useState([])
    useEffect(() => {
        const user=JSON.parse(localStorage.getItem('token'))
        axios.get(`http://localhost:8000/news?publishState=${type}&author=${user.username}&_expand=category`).then(res=>{
            setdataSource(res.data)
        })
    }, [type])
    const updatePublish=(item,type)=>{
        axios.patch(`http://localhost:8000/news/${item.id}`,{
            publishState:type
        })
        setdataSource(dataSource.filter(data=>data.id!==item.id))
    }
    const deletePublish=(item)=>{
        axios.delete(`http://localhost:8000/news/${item.id}`)
        setdataSource(dataSource.filter(data=>data.id!==item.id))
    }
    return {
        dataSource,
        updatePublish,
        deletePublish
    }
}
export default usePublish