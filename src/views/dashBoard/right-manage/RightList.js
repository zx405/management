import React, { Component } from 'react'
import { Button, Table, Tag, Modal, Popover, Switch } from 'antd';
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal;
export default class RightList extends Component {
  state = {
    dataSource: []
  }
  componentDidMount() {
    axios.get('http://localhost:8000/rights?_embed=children').then(res => {
      var list = res.data.map(item => {
        if (item.children.length === 0) {
          return {
            ...item,
            children: ''
          }
        }
        return item
      })
      this.setState({
        dataSource: list
      })

    })
  }
  columns = [
    {
      title: 'id',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title'
    },
    {
      title: '权限路径',
      render: (item) => {
        return <Tag color={item.grade === 1 ? "red" : "geekblue"}>{item.key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => { this.hanleConfirm(item) }} />
            <Popover
              content={<div style={{ textAlign: 'center' }}>
                <Switch checked={item.pagepermisson} onChange={() => this.handleChange(item)}></Switch>
              </div>}
              title="配置是否可用"
              trigger={item.pagepermisson === undefined ? 'null' : 'click'}
            >
              <Button style={{ marginLeft: '10px' }} type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
            </Popover>
          </div>
        )
      }
    }
  ]
  handleChange = (current) => {
    current.pagepermisson = !current.pagepermisson
    this.forceUpdate()
    if (current.grade === 1) {
      axios.patch(`http://localhost:8000/rights/${current.id}`, {
        pagepermisson: current.pagepermisson
      })
    }
    else {
      axios.patch(`http://localhost:8000/children/${current.id}`, {
        pagepermisson: current.pagepermisson
      })
    }
  }
  hanleConfirm = (item) => {
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
    console.log(current);
    var newlist = []
    if (current.grade === 2) {
      newlist = this.state.dataSource.map(item => {
        if (item.id === current.rightId) {
          item.children = item.children.filter(data => data.id !== current.id)
          return item
        }
        return item
      })
      // axios.delete(`http://localhost:8000/children/${current.id}`)
    }
    else {
      newlist = this.state.dataSource.filter(item => item.id !== current.id)
      // axios.delete(`http://localhost:8000/rights/${current.id}`)
    }
    this.setState({
      dataSource: newlist
    })
  }
  render() {
    return (
      <Table
        columns={this.columns}
        dataSource={this.state.dataSource}
        rowKey={(item) => item.id}
      />
    )
  }
}
