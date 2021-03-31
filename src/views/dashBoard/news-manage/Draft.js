import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, Button, Modal,notification } from 'antd'
import { DeleteOutlined, EditOutlined, ToTopOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal
export default function Draft(props) {
    const [dataSource, setdataSource] = useState([])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '新闻标题',
            render: (item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author'
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
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => handleDeleteConfirm(item)} disabled={item.default} style={{ marginLeft: '10px' }}></Button>
                    <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => {
                        props.history.push(`/news-manage/update/${item.id}`)
                    }} disabled={item.default} style={{ marginLeft: '10px' }}></Button>
                    <Button type="primary" icon={<ToTopOutlined />} shape="circle" style={{ marginLeft: '10px' }} onClick={()=>{
                        axios.patch(`http://localhost:8000/news/${item.id}`, {
                            auditState: 1
                        }).then(res => {
                            props.history.push("/audit-manage/list")
                            notification.info({
                                message: `通知`,
                                description:
                                    '已添加至审核列表',
                                placement: "bottomRight",
                            });
                        })
                    }}></Button>

                </div>
            }
        },
    ]
    const handleDeleteConfirm = (item) => {
        confirm({
            title: '你确定要删除此项目?',
            icon: <ExclamationCircleOutlined />,
            content: '',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                handleDelete(item)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    //确认之后删除项目
    const handleDelete = (current) => {
        setdataSource(dataSource.filter(item => item.id !== current.id))
        axios.delete(`http://localhost:8000/news/${current.id}`)
    }
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("token"))
        axios.get(`http://localhost:8000/news?author=${user.username}&auditState=0&_expand=category`).then(res => {
            setdataSource(res.data)
        })
    }, [])
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} ></Table>
        </div>
    )
}
