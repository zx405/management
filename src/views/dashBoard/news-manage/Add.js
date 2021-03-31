import React, { useRef, useState, useEffect } from 'react'
import { Steps, Button, Form, Input, Select, notification } from 'antd'
import NewsEditor from '../../../components/news-manage/NewsEditor'
import css from './Add.module.css'
import axios from 'axios'
const { Step } = Steps
const { Option } = Select
export default function Add(props) {
    const myForm = useRef(null)
    const [current, setCurrent] = useState(0)
    const [formInfo, setformInfo] = useState(null)
    const [categoriesList, setcategoriesList] = useState([])
    const [content, setContent] = useState('')
    const next = () => {
        if (current === 0) {
            myForm.current.validateFields().then(values => {
                setCurrent(current + 1)
                setformInfo(values)
            })
        }
        else {
            setCurrent(current + 1)
        }
    }
    const previous = () => {
        setCurrent(current - 1)
    }
    const submit = (type) => {
        var user = JSON.parse(localStorage.getItem('token'))
        axios.post('http://localhost:8000/news', {
            ...formInfo,
            "content": content,
            "region": user.region,
            "author": user.username,
            "roleId": user.roleId,
            "auditState": type,
            "publishState": 0,
            "createTime": Date.now(),
            "view": 0,
            "star": 0,
            "publishTime": 0
        }).then(res => {
            if (type === 0) {
                props.history.push('/news-manage/draft')
                notification.info({
                    message: '通知',
                    description:
                        '已添加至草稿箱',
                    placement: 'bottomRight',
                    duration: 2
                })
            }
            else {
                props.history.push('/audit-manage/list')
                notification.info({
                    message: '通知',
                    description:
                        '已添加至审核列表',
                    placement: 'bottomRight',
                    duration: 2
                })
            }
        })
    }
    useEffect(() => {
        axios.get('http://localhost:8000/categories').then(res => {
            setcategoriesList(res.data)
        })
    }, [])
    return (
        <div style={{ overflow: 'hidden' }}>
            <h1 style={{ fontWeight: 'bold' }}>撰写新闻</h1>
            <div style={{ marginTop: '40px' }}>
                <Steps current={current}>
                    <Step title="基本信息" description="essential information" />
                    <Step title="新闻内容" description="news content" />
                    <Step title="新闻提交" description="submit news" />
                </Steps>
            </div>
            <div>
                <div className={current === 0 ? '' : css.hidden} style={{ marginTop: '55px' }}>
                    <Form
                        name="basic"
                        ref={myForm}
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Select>
                                {categoriesList.map(item =>
                                    <Option key={item.id} value={item.id}>{item.title}</Option>
                                )}
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                <div className={current === 1 ? '' : css.hidden}>
                    <NewsEditor getContent={(content) => {
                        setContent(content)
                    }}></NewsEditor>
                </div>
                <div className={current === 2 ? '' : css.hidden}></div>
            </div>
            <div style={{ marginTop: '200px' }}>
                {current > 0 && current < 2 && <Button type="primary" onClick={previous}>上一步</Button>}
                {current < 2 && <Button type="primary" onClick={next}>下一步</Button>}
                {current === 2 && <span><Button type="primary" onClick={previous}>上一步</Button><Button type="primary" onClick={() => submit(0)}>保存草稿</Button><Button type="danger" onClick={() => submit(1)}>提交新闻</Button></span>}
            </div>
        </div>
    )
}
