import React from 'react'
import {Table,Button} from 'antd'
export default function NewsPublish(props) {
    
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
            render:(item)=>{
                return <div>
                    {props.state===1 && <Button type="primary" onClick={()=>{props.handleClick(item)}}>发布</Button>}
                    {props.state===2 && <Button type="primary" onClick={()=>{props.handleClick(item)}}>下线</Button>}
                    {props.state===3 && <Button type="primary" onClick={()=>{props.handleClick(item)}}>删除</Button>}
                    </div>
            }
        },
    ]
    return (
        <div>
            <Table dataSource={props.dataSource} columns={columns} rowKey={(item) => item.id} ></Table>
        </div>
    )
}
