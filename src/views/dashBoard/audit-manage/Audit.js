import axios from 'axios'
import React,{useEffect, useState} from 'react'
import {Table,Button} from 'antd'
import { CheckOutlined,CloseOutlined} from '@ant-design/icons'
export default function List() {
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
            title: '操作',
            render: (item) => {
                return <div>
                    <Button shape="circle" type="primary" icon={<CheckOutlined />} onClick={()=>{handlePassOrReject(item,2,1)}}></Button>
                    <Button shape="circle" type="danger" icon={<CloseOutlined /> } style={{marginLeft:'10px'}} onClick={()=>{
                        handlePassOrReject(item,3,0)
                    }}></Button>
                </div>
            }
        },
    ]
    useEffect(()=>{
        var list = []
        const { roleId, username, region } = JSON.parse(localStorage.getItem("token"))
        axios.get(`http://localhost:8000/news?auditState=1&_expand=category`).then(res => {
            if (roleId === 1) {
                //超级管理员
                list = res.data
            } else {
                //区域管理员
                list = [...res.data.filter(item => item.author === username), ...res.data.filter(item => item.region === region && item.roleId === 3)]
            }
            setdataSource(list)
        })
    },[])
    const handlePassOrReject=(item,auditState,publishState)=>{
        axios.patch(`http://localhost:8000/news/${item.id}`,{
            auditState,
            publishState
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

