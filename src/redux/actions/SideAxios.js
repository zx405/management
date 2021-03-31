import axios from 'axios'
function SideAxios() {
    return axios.get('http://localhost:8000/rights?_embed=children').then(res => {
        return {
            type: "change_list",
            payload: res.data
        }
    })
}
export default SideAxios