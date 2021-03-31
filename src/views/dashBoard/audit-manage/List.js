import axios from 'axios'
import React,{useEffect, useState} from 'react'
import {Button,Table,Tag,notification} from 'antd'
export default function List(props) {
    const [dataSource, setdataSource] = useState([])
    const columns = [
        {
            title: '新闻标题',
            render: (item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: (category) => {
                return <span>{category.title}</span>
            }
        },
        {
            title:'审核状态',
            dataIndex:'auditState',
            render:(auditState)=>{
                const color = ["", "warning", "green", "red"]
                const auditObj = ["草稿", "审核中", "已通过", "被驳回"]
                return <div><Tag color={color[auditState]}>{auditObj[auditState]}</Tag></div>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    {
                        item.auditState===1 && <Button type='primary' onClick={()=>{handleRepeal(item)}}>撤销</Button>
                    }
                    {
                        item.auditState===2 && <Button type='primary' onClick={()=>{handlePublish(item)}}>发布</Button>
                    }
                    {
                        item.auditState===3 && <Button type='primary' onClick={()=>{handleUpdate(item)}}>更新</Button>
                    }
                </div>
            }
        },
    ]
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("token"))
        axios.get(`http://localhost:8000/news?author=${user.username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res=>{
            setdataSource(res.data)
        })
    },[])
    const handleRepeal=(item)=>{
        axios.patch(`http://localhost:8000/news/${item.id}`,{
            auditState:0
        }).then(res=>{
            setdataSource(dataSource.filter(data=>data.id!==item.id))
            notification.info({
                message: `通知`,
                description:
                    '已退回至草稿箱',
                placement: "bottomRight",
            });
        })
    }
    const handleUpdate=(item)=>{
        props.history.push(`/news-manage/update/${item.id}`)
    }
    const handlePublish=(item)=>{
        axios.patch(`http://localhost:8000/news/${item.id}`,{
            publishState:1
        }).then(res=>{
            setdataSource(dataSource.filter(data=>data.id!==item.id))
        })
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} ></Table>
        </div>
    )
}
