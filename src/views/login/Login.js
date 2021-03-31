import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Particles from 'react-particles-js'
import './Login.css'
import axios from 'axios'
export default class Login extends Component {

    render() {
        const onFinish = (values) => {
            axios.get(`http://localhost:8000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
                if (res.data.length === 0) {
                    message.error('用户名或密码错误')
                }
                else {
                    localStorage.setItem('token', JSON.stringify(res.data[0]))
                    this.props.history.push('/home')
                }
            })
        }
        return (
            <div style={{ background: 'blue', height: '100%', overflow: 'hidden' }}>
                <div >
                    <Particles params={
                        {
                            "background": {
                                "color": {
                                    "value": "#0d47a1"
                                },
                                "position": "50% 50%",
                                "repeat": "no-repeat",
                                "size": "cover"
                            },
                            "fullScreen": {
                                "enable": true,
                                "zIndex": 1
                            },
                            "interactivity": {
                                "events": {
                                    "onClick": {
                                        "enable": true,
                                        "mode": "push"
                                    },
                                    "onHover": {
                                        "mode": "repulse",
                                        "parallax": {
                                            "force": 60
                                        }
                                    }
                                },
                                "modes": {
                                    "bubble": {
                                        "distance": 400,
                                        "duration": 2,
                                        "opacity": 0.8,
                                        "size": 40
                                    },
                                    "grab": {
                                        "distance": 400
                                    }
                                }
                            },
                            "particles": {
                                "collisions": {
                                    "enable": true
                                },
                                "color": {
                                    "value": "#ffffff"
                                },
                                "links": {
                                    "color": {
                                        "value": "#ffffff"
                                    },
                                    "distance": 150,
                                    "opacity": 0.4
                                },
                                "move": {
                                    "attract": {
                                        "rotate": {
                                            "x": 600,
                                            "y": 1200
                                        }
                                    },
                                    "enable": true,
                                    "outModes": {
                                        "default": "bounce",
                                        "bottom": "bounce",
                                        "left": "bounce",
                                        "right": "bounce",
                                        "top": "bounce"
                                    },
                                    "speed": 5
                                },
                                "number": {
                                    "density": {
                                        "enable": true
                                    },
                                    "value": 80
                                },
                                "opacity": {
                                    "value": 0.5,
                                    "animation": {
                                        "minimumValue": 0.1,
                                        "speed": 1
                                    }
                                },
                                "size": {
                                    "random": {
                                        "enable": true,
                                        "minimumValue": 10
                                    },
                                    "value": 15,
                                    "animation": {
                                        "minimumValue": 0.1,
                                        "speed": 40
                                    }
                                }
                            }
                        }
                    } />
                </div>
                <div className="formAll">
                    <Form
                        name="normal_login"
                        className="login-form"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: '请输入用户名！' }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '请输入密码！' }]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button" block>
                                登录
                </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>


        )
    }
}

