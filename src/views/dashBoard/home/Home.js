import React, { Component } from 'react'
import { Button, Drawer } from 'antd'
import * as echarts from 'echarts'
import axios from 'axios'
import _ from 'lodash'
import mstore from '../../../mobx/mobx'
import {autorun} from 'mobx'
export default class Home extends Component {
    state = {
        visible: false
    }
    eachartsBar = {}
    myChart = null
    componentDidMount() {
        let { username } = JSON.parse(localStorage.getItem('token'))
        axios.get(`http://localhost:8000/news?author=${username}&_expand=category&publishState=2`).then(res => {
            this.eachartsBar = _.groupBy(res.data, (item) => item.category.title)
            console.log(this.eachartsBar)
        })
        var Chart = echarts.init(document.getElementById('box'));
        var option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data: ['销量']
            },
            xAxis: {
                data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        }
        Chart.setOption(option);
        window.onresize = ()=>{
            Chart.resize()
        }
        this.cancel = autorun(()=>{
            console.log(mstore.get('isFullScreen'))
            setTimeout(()=>{
                Chart.resize()
            },0)
        })
    }
    componentWillUnmount(){
        window.onresize = null
        this.cancel()
    }
    render() {
        return (
            <div>
                <div>
                    <Button type="primary" onClick={() => {
                        this.escharts()
                    }}>1111</Button>
                    <Button type="primary" onClick={() => {
                        this.eschartspie()
                    }}>1111</Button>
                </div>
                <div>
                    <Drawer
                        title="新闻发布"
                        placement="right"
                        closable={true}
                        onClose={() => {
                            this.setState({
                                visible: false
                            })
                        }}
                        visible={this.state.visible}
                        width='500'
                    >
                        <div id="main" style={{ width: "100%", height: "400px" }}></div>
                    </Drawer>

                </div>
                <div id="box" style={{ width: "100%", height: "400px" }}></div>

            </div>
        )
    }
    escharts = () => {
        setTimeout(() => {
            this.setState({
                visible: true
            })
            this.myChart = this.myChart ? this.myChart : echarts.init(document.getElementById('main'))
            this.myChart.clear()
            var option;

            option = {
                xAxis: {
                    type: 'category',
                    data: Object.keys(this.eachartsBar),
                    axisLabel: {
                        interval: 0
                    }
                },
                yAxis: {
                    type: 'value',
                    minInterval: 1
                },
                series: [{
                    data: Object.values(this.eachartsBar).map(item => item.length),
                    type: 'bar'
                }]
            };

            option && this.myChart.setOption(option);
        }, 0)
    }
    eschartspie = () => {
        setTimeout(() => {
            this.setState({
                visible: true
            })
            this.myChart = this.myChart ? this.myChart : echarts.init(document.getElementById('box'))
            this.myChart.clear()
            var option;
            var arr = []
            for (let i in this.eachartsBar) {
                arr.push({
                    name: i,
                    value: this.eachartsBar[i].length
                })
            }
            console.log(arr);
            option = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '40',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: arr
                    }
                ]
            };

            option && this.myChart.setOption(option);
        }, 0)


    }
}
