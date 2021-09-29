import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';
import { Card, Avatar, Typography, Table } from 'antd';
import axios from 'axios';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Line, Pie, Column } from '@ant-design/charts';

const _ = require('lodash');
const { Meta } = Card;
const { Title, Paragraph, Text, Link } = Typography;

export default () => {
    const [projectData, setProjectData] = useState();
    const [budgetChartData, setBudgetChartData] = useState([]);
    const [implementationChartData, setImplementationChartData] = useState([]);

    const budgetChartConfig = {
        appendPadding: 10,
        data: budgetChartData,
        angleField: 'value',
        colorField: 'type',
        radius: 0.75,
        label: {
            type: 'spider',
            labelHeight: 28,
            content: '{name}\n{percentage}',
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    };

    const implementationConfig = {
        data: implementationChartData,
        xField: 'phase',
        yField: 'duration',
        seriesField: 'series',

        label: {
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        meta: {
            phase: { alias: 'phase' },
            duration: { alias: 'duration' },
        },
    };


    useEffect(() => {
        async function fetchData() {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const params = Object.fromEntries(urlSearchParams.entries());
            let { data } = await axios.post(`http://ec2-18-224-65-21.us-east-2.compute.amazonaws.com:8080/project/getProjectDetails`, { projectId: params.id })
            setProjectData(data);
            setBudgetChartData(_.get(data, 'budget', []).map((budget: any) => {
                return { type: budget.costHead, value: budget.units * budget.unitAmount * budget.expenseFrequency }
            }));
            setImplementationChartData(_.get(data, 'implementation', []).map((implementation: any) => {
                implementation.series = `Duration of phase in ${implementation.durationUnit}s`
                return implementation;
            }));
        }
        fetchData()
    }, [])

    return (
        <Card title={_.get(projectData, 'name')}>
            <Card type="inner" title ="Basic Project Details">
            <Card.Grid style={{ width: '25%', textAlign: 'center' }}>
                <Card type="inner"
                    style={{ width: 250 }}
                    cover={
                        <img
                            alt="example"
                            src={_.get(projectData, 'logo')}
                        />
                    }
                >
                    <Paragraph style={{ margin: "8px" }}>
                        <Text strong>
                            {`status:  `}
                        </Text>
                        {_.get(projectData, 'status')}
                    </Paragraph>


                    <Paragraph style={{ margin: "8px" }}
                    >
                        <Text strong>
                            {`budget:  `}
                        </Text>
                        {_.get(projectData, 'totalBudget')}
                    </Paragraph>
                </Card>
            </Card.Grid>

            <Card.Grid style={{ width: '75%', textAlign: 'center' }}>
            <Card type="inner">
                <Paragraph style={{ margin: "8px" }}>
                    <Text strong>
                        {`description:  `}
                    </Text>
                    {_.get(projectData, 'description')}
                </Paragraph>
                <Paragraph style={{ margin: "8px" }}
                >
                    <Text strong>
                        {`rationale:  `}
                    </Text>
                    {_.get(projectData, 'problem.description')}
                </Paragraph>
                <Paragraph style={{ margin: "8px" }}
                >
                    <Text strong>
                        {`intervenation:  `}
                    </Text>
                    {_.get(projectData, 'solution.description')}
                </Paragraph>
                </Card>
            </Card.Grid>
            </Card>
 
            <Card type="inner" title ="Project Budget Info">
            <Card.Grid style={{ width: '50%', textAlign: 'left' }}>
            <Card type="inner"  style={{padding:"10px"}}>
                <Table scroll={{ x: 500 }}
                    pagination={{ pageSize: 5 }}
                    dataSource={_.get(projectData, 'budget', [])}
                    columns={[
                        {
                            title: "costHead",
                            key: "costHead",
                            dataIndex: "costHead"
                        },
                        {
                            title: "costType",
                            key: "costType",
                            dataIndex: "costType"
                        },
                        {
                            title: "expenseFrequency",
                            key: "expenseFrequency",
                            dataIndex: "expenseFrequency"
                        },
                        {
                            title: "unitAmount",
                            key: "unitAmount",
                            dataIndex: "unitAmount"
                        },
                        {
                            title: "units",
                            key: "units",
                            dataIndex: "units"
                        }
                    ]}
                >
                </Table>
                </Card>
            </Card.Grid>
            <Card.Grid style={{ width: '50%', textAlign: 'left' }}>

            <Card type="inner"  style={{padding:"10px"}}>
                <Pie  {...budgetChartConfig} />
                </Card>
            </Card.Grid>
            </Card>

            <Card type="inner" title ="Project Implementation Info">
                
            <Card.Grid style={{ width: '50%', textAlign: 'left' }}>
            <Card type="inner"  style={{padding:"10px"}}>
                <Table scroll={{ x: 400 }}
                    pagination={{ pageSize: 5 }}
                    dataSource={_.get(projectData, 'implementation', [])}
                    columns={[
                        {
                            title: "Phase",
                            key: "phase",
                            dataIndex: "phase"
                        },
                        {
                            title: "Activity",
                            key: "activity",
                            dataIndex: "activity"
                        },
                        {
                            title: "Duration",
                            key: "duration",
                            dataIndex: "duration"
                        },
                        {
                            title: "Duration Unit",
                            key: "durationUnit",
                            dataIndex: "durationUnit"
                        }
                    ]}
                >
                </Table>
                </Card>
            </Card.Grid>
            <Card.Grid style={{ width: '50%', textAlign: 'left' }}>
            <Card type="inner" style={{padding:"10px"}}>
                <Column  {...implementationConfig} />
                </Card>
            </Card.Grid>
            </Card>
        </Card>
    );
};

