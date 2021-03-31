import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
const { Option } = Select
const roleType = {
    '1': '超级管理员',
    '2': '区域管理员',
    '3': '区域编辑'
}
export default class UseForm extends Component {
    myForm = React.createRef()
    getForm = () => {
        return this.myForm.current
    }
    state = {
        isDisabled: false
    }
    render() {
        return (

            <Form
                ref={this.myForm}
                layout="vertical"
                name="form_in_modal"
            >
                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[{ required: true, message: '请输入用户名!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="密码"
                    rules={[{ required: true, message: '请输入密码!' }]}
                >
                    <Input type="password" />
                </Form.Item>
                <Form.Item
                    name="region"
                    label="区域"
                    rules={[{ required: true, message: '请输入区域!' }]}
                >
                    <Select disabled={this.state.isDisabled}>
                        {this.props.regionList.map(item =>
                            <Option key={item.value}>{item.title}</Option>
                        )}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="roleId"
                    label="角色"
                    rules={[{ required: true, message: '请输入角色!' }]}
                >
                    <Select onChange={(value) => {
                        if (roleType[value] === '超级管理员') {
                            this.setState({
                                isDisabled: true
                            })
                            this.myForm.current.setFieldsValue({
                                region: '全球'
                            })
                        }
                        else {
                            this.setState({
                                isDisabled: false
                            })
                            this.myForm.current.setFieldsValue({
                                region: ''
                            })
                        }
                    }}>
                        {this.props.roleList.map(item =>
                            <Option key={item.id}>{item.roleName}</Option>
                        )}
                    </Select>
                </Form.Item>
            </Form>
        )
    }
}
