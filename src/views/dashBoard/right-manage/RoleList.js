import React, { Component } from 'react'
import { Button, Table, Modal, Tree } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal;
export default class RoleList extends Component {
    state = {
        dataSource: [],
        isModalVisible: false,
        rightsList: [],
        colom: [],
        currentId: 1
    }
    columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName'
        },
        {
            title: '操作',
            render: (item) => {
                return (
                    <div>
                        <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => { this.handleConfirm(item) }} />
                        <Button style={{ marginLeft: '10px' }} type="primary" shape="circle" icon={<EditOutlined />} onClick={() => this.handleEdit(item)} />
                    </div>
                )
            }
        }
    ]
    componentDidMount() {
        axios.get("http://localhost:8000/roles").then(res => {
            this.setState({
                dataSource: res.data
            })
        })
        axios.get("http://localhost:8000/rights?_embed=children").then(res => {
            this.setState({
                rightsList: res.data
            })
        })

    }
    handleConfirm = (item) => {
        confirm({
            title: 'Are you sure delete this item?',
            icon: <ExclamationCircleOutlined />,
            content: '',
            onOk: () => {
                this.handleDelete(item)
            },
            onCancel() {
                console.log('Cancel');
            },
        })
    }
    handleDelete = (current) => {
        var newlist = []
        newlist = this.state.dataSource.filter(item => item.id !== current.id)
        this.setState({
            dataSource: newlist
        })
        // axios.delete(`http://localhost:8000/roles/${current.id}`)
    }
    handleEdit = (item) => {
        this.setState({
            isModalVisible: true,
            colom: item.rights,
            currentId: item.id
        })
    }
    handleOkConfirm = () => {
        this.setState({
            isModalVisible: false,
            dataSource: this.state.dataSource.map(item => {
                if (item.id === this.state.currentId) {
                    return {
                        ...item,
                        rights: this.state.colom
                    }
                }
                return item
            })
        })
        axios.patch(`http://localhost:8000/roles/${this.state.currentId}`, {
            rights: this.state.colom
        })
    }
    render() {
        return (
            <div>
                <Table
                    columns={this.columns}
                    dataSource={this.state.dataSource}
                    rowKey={(item) => item.id}
                />
                <Modal title="项目管理" visible={this.state.isModalVisible} onOk={() => {
                    this.handleOkConfirm()
                }} onCancel={() => {
                    this.setState({
                        isModalVisible: false
                    })
                }}>
                    <Tree
                        checkable
                        checkedKeys={this.state.colom}
                        treeData={this.state.rightsList}
                        checkStrictly
                        onCheck={(value) => {
                            this.setState({
                                colom: value.checked
                            })
                        }}
                    />
                </Modal>

            </div>

        )
    }
}
