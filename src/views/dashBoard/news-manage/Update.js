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
            myForm.current.validateFields().then(res => {
                setCurrent(current + 1)
                setformInfo(res)
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
        axios.patch(`http://localhost:8000/news/${props.match.params.id}`, {
            ...formInfo,
            "content": content,
            "auditState": type,
        }).then(res => {
            if (type === 0) {
                props.history.push('/news-manage/draft')
                notification.info({
                    message: '通知',
                    description:
                        '已更新至草稿箱',
                    placement: 'bottomRight',
                    duration: 2
                })
            }
            else {
                props.history.push('/audit-manage/list')
            }
        })
    }
    useEffect(() => {
        axios.get('http://localhost:8000/categories').then(res => {
            setcategoriesList(res.data)
        })
    }, [])
    useEffect(()=>{
        axios.get(`http://localhost:8000/news/${props.match.params.id}`).then(res=>{
            setContent(res.data.content)
            myForm.current.setFieldsValue(res.data)
        })
        
    },[props.match.params.id])
    return (
        <div style={{ overflow: 'hidden' }}>
            <h1 style={{ fontWeight: 'bold' }}>更新新闻</h1>
            <div style={{ marginTop: '40px' }}>
                <Steps current={current}>
                    <Step title="更新基本信息" description="updated essential information" />
                    <Step title="更新新闻内容" description="updated news content" />
                    <Step title="更新新闻提交" description="updated submit news" />
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
                                    <Option key={item.id}>{item.title}</Option>
                                )}
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                <div className={current === 1 ? '' : css.hidden}>
                    <NewsEditor getContent={(content) => {
                        setContent(content)
                    }} content={content}></NewsEditor>
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

