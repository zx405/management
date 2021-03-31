import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions } from 'antd'
import moment from 'moment'
export default function Preview(props) {
    const [info, setInfo] = useState(null)
    useEffect(() => {
        axios.get(`http://localhost:8000/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            setInfo(res.data)
        })
    }, [props.match.params.id])
    return (
        <div>

            {info &&
                <div>
                    <div className="site-page-header-ghost-wrapper">
                        <PageHeader
                            ghost={false}
                            onBack={() => props.history.goBack()}
                            title={info.title}
                            subTitle={info.category.title}
                        >
                            <Descriptions size="middle" column={3}>
                                <Descriptions.Item label='创建者'>{info.author}</Descriptions.Item>
                                <Descriptions.Item label='创建时间'>{moment(parseInt(info.createTime)).format("YYYY-MM-DD HH:mm:ss")}</Descriptions.Item>
                                <Descriptions.Item label='发布时间'>{info.publishTime === 0 ? '-' : info.publishTime}</Descriptions.Item>
                                <Descriptions.Item label='区域'>{info.region}</Descriptions.Item>
                                <Descriptions.Item label='审核状态'>{info.auditState === 0 && <span style={{ color: 'red' }}>未审核</span>}{info.auditState === 1 && <span style={{ color: 'red' }}>审核中</span>}{info.auditState === 2 && <span style={{ color: 'red' }}>已审核</span>}</Descriptions.Item>
                                <Descriptions.Item label='发布状态'>{info.publishState === 0 && <span style={{ color: 'red' }}>未发布</span>} {info.publishState === 1 && <span style={{ color: 'red' }}>待发布</span>}</Descriptions.Item>
                                <Descriptions.Item label='访问量'>{<span style={{ color: 'blue' }}>{info.view}</span>}</Descriptions.Item>
                                <Descriptions.Item label='点赞量'>{<span style={{ color: 'blue' }}>{info.star}</span>}</Descriptions.Item>
                                <Descriptions.Item label='评论量'>{<span style={{ color: 'blue' }}>{info.view}</span>}</Descriptions.Item>
                            </Descriptions>
                        </PageHeader>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: info.content }} style={{ padding: "16px 24px", border: "1px solid rgb(235, 237, 240)" }}></div>
                </div>}
        </div>
    )
}
