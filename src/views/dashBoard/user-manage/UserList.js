import React, { Component } from 'react'
import axios from 'axios'
import { Switch, Button, Table, Modal } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import UseForm from './UseForm'
const { confirm } = Modal
export default class UserList extends Component {
    addForm = React.createRef()
    updateForm = React.createRef()
    state = {
        dataSource: [],
        visible: false,
        regionList: [],
        roleList: [],
        updatevisible: false,
        current: {}
    }
    columns = [
        {
            title: '区域',
            dataIndex: 'region',
            render: (region) => {
                return <b>{region}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => {
                return <span>{role?.roleName}</span>
            }
        },
        {
            title: '用户名',
            dataIndex: 'username'
        },
        {
            title: '用户状态',
            render: (item) => {
                return <Switch checked={item.roleState} disabled={item.default} onChange={() => this.handleChange(item)}></Switch>
            }
        },

        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => this.handleDeleteConfirm(item)} disabled={item.default}></Button>
                    <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => {
                        this.setState({
                            updatevisible: true,
                            current: item
                        }, () => {
                            this.updateForm.current.getForm().setFieldsValue(this.state.current)
                        })
                    }} disabled={item.default}></Button>

                </div>
            }
        },
    ]

    //数据请求
    componentDidMount() {
        //表链接数据
        axios.get('http://localhost:8000/users?_expand=role').then(res => {
            this.setState({
                dataSource: res.data
            })
        })
        //区域数据
        axios.get("http://localhost:8000/regions").then(res => {
            this.setState({
                regionList: res.data
            })
        })
        //角色数据
        axios.get("http://localhost:8000/roles").then(res => {
            this.setState({
                roleList: res.data
            })
        })
    }
    //转换开关状态
    handleChange = (item) => {
        item.roleState = !item.roleState
        this.forceUpdate()

        axios.patch(`http://localhost:8000/users/${item.id}`, {
            roleState: item.roleState
        })
    }
    //删除项目确认
    handleDeleteConfirm = (item) => {
        confirm({
            title: '你确定要删除此项目?',
            icon: <ExclamationCircleOutlined />,
            content: '',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                this.handleDelete(item)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    //确认之后删除项目
    handleDelete = (current) => {
        this.setState({
            dataSource: this.state.dataSource.filter(item => item.id !== current.id)
        })
        axios.delete(`http://localhost:8000/users/${current.id}`)
    }
    //添加用户
    handleAddForm = () => {
        this.addForm.current.getForm().validateFields().then((value) => {
            axios.post('http://localhost:8000/users', {  //添加必要字段
                ...value,
                "roleState": true,
                "default": false
            }).then(res => {   //后台数据更新
                var newlist = res.data
                newlist.role = this.state.roleList.filter(item => item.id === res.data.roleId)[0]
                this.setState({
                    dataSource: [
                        ...this.state.dataSource,
                        newlist
                    ],
                    visible: false
                })
                console.log(this.state.dataSource);
                this.addForm.current.resetFields()
            })
            window.location.reload()
        })
    }
    //更新用户
    handleUpdateForm = () => {
        this.updateForm.current.getForm().validateFields().then((value) => {
            axios.patch(`http://localhost:8000/users/${this.state.current.id}`, value).then(res => {   //后台数据更新
                this.setState({
                    dataSource: this.state.dataSource.map(item => {
                        if (item.id === this.state.current.id) {
                            return {
                                ...this.state.current,   //当前点击的item
                                ...value,                //更新之后的每一项
                                role: this.state.roleList.filter(data => data.id === value.roleId)[0]
                            }
                        }
                        return item
                    }),
                    updatevisible: false
                })
                this.updateForm.current.getForm().resetFields()
            })
            window.location.reload()
        })
    }
    render() {
        return (
            <div>
                <Button type="primary" onClick={() => {
                    this.setState({
                        visible: true
                    })
                }
                }>添加用户</Button>
                <Table dataSource={this.state.dataSource} columns={this.columns} rowKey={(item) => item.id} ></Table>
                <Modal
                    visible={this.state.visible}
                    title="添加用户"
                    okText="确认"
                    cancelText="返回"
                    onCancel={() => {
                        this.setState({
                            visible: false
                        })
                    }}
                    onOk={() => {
                        this.handleAddForm()
                    }}
                >
                    <UseForm regionList={this.state.regionList} roleList={this.state.roleList} ref={this.addForm}></UseForm>
                </Modal>
                {/* 更新模态框 */}
                <Modal
                    visible={this.state.updatevisible}
                    title="更新用户"
                    okText="更新"
                    cancelText="返回"
                    onCancel={() => {
                        this.setState({
                            updatevisible: false
                        })
                    }}
                    onOk={() => {
                        this.handleUpdateForm()
                    }}
                >
                    <UseForm regionList={this.state.regionList} roleList={this.state.roleList} ref={this.updateForm}></UseForm>
                </Modal>
            </div>
        )
    }
}