import React, { useEffect, useState } from 'react';
import {Button, Empty, Table} from 'antd';
import { Card ,Typography} from 'antd';
import axios from 'axios';
import jsPDF from 'jspdf';
import ReactDOMServer from "react-dom/server";
import { Line,Pie,Column } from '@ant-design/charts';
import { Collapse } from 'antd';

const { Panel } = Collapse;

const _ = require('lodash');



const { Title, Paragraph, Text, Link } = Typography;
const ProjectDetailPage = () => {

  const [projectData, setProjectData] = useState();
  const [budgetChartData, setBudgetChartData] = useState([]);
  const [kpiChartData, setKpiChartData] = useState([]);
  const [implementationChartData, setImplementationChartData] = useState([]);

  const openInNewTab = (url:string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }


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
  


  const kpiConfig = {
    data:kpiChartData,
    height: 400,
    xField: 'name',
    yField: 'targetValue',
    point: {
      size: 5,
      shape: 'diamond',
    },
  };


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



  

   useEffect(() => {
        async function fetchData() {
          const urlSearchParams = new URLSearchParams(window.location.search);
          const params = Object.fromEntries(urlSearchParams.entries());
          let {data} = await axios.post(`http://ec2-18-224-65-21.us-east-2.compute.amazonaws.com:8080/project/getProjectDetails`, {projectId: params.id})
        
          setProjectData(data);
          setBudgetChartData(_.get(data,'budget',[]).map((budget:any)=>{
             return {type: budget.costHead, value: budget.units * budget.unitAmount*budget.expenseFrequency}
          }));

          setKpiChartData(_.get(data,'kpi',[]));
          setImplementationChartData(_.get(data,'implementation',[]).map((implementation:any)=>{
            implementation.series = `Duration of phase in ${implementation.durationUnit}s`
            return implementation;
          }))
        }    
        fetchData()
      }, [])
      
  return (
    <div>
      <Card id ="divToPrint" title="Project Details">
        <Collapse>
        <Panel header="Basic project details" key="1">
          <Card
          style={{ marginTop: 16 }}
          type="inner"
        >
       
       <Paragraph style = {{margin:"8px"}}>
          <Text strong underline> 
            {`Project name:`}
          </Text>
          {` ${_.get(projectData,'name')}`}
        </Paragraph>

       <Paragraph style = {{margin:"8px"}}>
          <Text strong underline> 
            {`Project Description:`}
          </Text>
          {` ${_.get(projectData,'description')}`}
        </Paragraph>

        <Paragraph style = {{margin:"8px"}}>
          <Text strong underline> 
            {`Project Location:`}
          </Text>
          {` ${_.get(projectData,'location')}`}
        </Paragraph>

        <Paragraph style = {{margin:"8px"}}>
          <Text strong underline> 
            {`Project Beneficiaries:`}
          </Text>
          {` ${_.get(projectData,'targetBeneficiary')}`}
        </Paragraph>

        <Paragraph style = {{margin:"8px"}}>
          <Text strong underline> 
            {`Projecy objectives:`}
          </Text>
          {` ${_.get(projectData,'objectives')}`}
        </Paragraph>


        <Paragraph style = {{margin:"8px"}}>
          <Text strong underline> 
            {`Project activities:`}
          </Text>
          {` ${_.get(projectData,'activities')}`}
        </Paragraph>

        <Paragraph style = {{margin:"8px"}}>
          <Text strong underline> 
            {`Project duration:`}
          </Text>
          {` ${_.get(projectData,'duration')} ${_.get(projectData,'durationUnit')}`}
        </Paragraph>

        <Paragraph style = {{margin:"8px"}}>
          <Text strong underline> 
            {`Project rationale:`}
          </Text>
          {` ${_.get(projectData,'totalBudget')} INR`}
        </Paragraph>
        </Card>
          </Panel>
          <Panel header="Project rationale" key="2">
      <Card type="inner">
        <Paragraph style = {{margin:"8px"}}>
          <Text strong underline> 
            {`Problem description:`}
          </Text>
          {` ${_.get(projectData,'problem.description')}`}
        </Paragraph>
        {_.get(projectData,'problem.baselineStudyFile') && <Button type="dashed" onClick={()=>openInNewTab(_.get(projectData,'problem.baselineStudyFile'))}>View base line study</Button>}
        </Card>
      </Panel>

      <Panel header="Project intervention" key='3'>
      <Card type="inner" >
        <Paragraph style = {{margin:"8px"}}>
          <Text strong underline> 
            {`Solution Description:`}
          </Text>
          {` ${_.get(projectData,'solution.description')}`}
        </Paragraph>
        {_.get(projectData,'solution.tocFile') && <Button type="dashed" onClick={()=>openInNewTab(_.get(projectData,'solution.tocFile'))}>View Theory Of Change</Button>}
        </Card>
      </Panel>

      <Panel key="6" header="Project implementation plan">

{!_.isEmpty(_.get(projectData,'implementation')) && <Card type="inner" title="Project implementation Overview" >
  { !_.isEmpty(_.get(projectData,'implementation')) && <Column  {...implementationConfig}/>}
</Card>}
<Card type="inner" title="Project implementation Details" >
   <Table scroll={{x:1500}}
       pagination={{ pageSize: 5}}
      dataSource={_.get(projectData,'implementation',[])}
      columns = {[
        {
        title:"Phase",
        key: "phase",
        dataIndex: "phase"
        },
        {
         title:"Activity",
         key: "activity",
         dataIndex: "activity"
         },
         {
           title:"Estimated Start Time",
           key: "estimatedStartTime",
           dataIndex: "estimatedStartTime"
         },
         {
           title:"Estimated End Time",
           key: "estimatedEndTime",
           dataIndex: "estimatedEndTime"
         },
         {
             title:"Duration",
             key: "duration",
             dataIndex: "duration"
         },
         {
           title:"Duration Unit",
           key: "durationUnit",
           dataIndex: "durationUnit"
         },    
   
         {
           title:"Status",
           key: "status",
           dataIndex: "status"
         },
         {
           title:"Actual Start Time",
           key: "actualStartTime",
           dataIndex: "actualStartTime"
         },
         {
           title:"Actual End Time",
           key: "actualEndTime",
           dataIndex: "actualEndTime"
         }
 
     ]}
   >
     </Table>
  </Card>
  </Panel>

  <Panel key="7" header="Project budget and financial information">
       { !_.isEmpty(_.get(projectData,'budget')) && _.get(projectData,'budget').length > 0 && <Card type="inner" title="Project budget overview" >
         <Pie  {...budgetChartConfig}/>
        </Card>}

        <Card type="inner" title="Project budget Details">
          <Table scroll={{x:1500}}
              pagination={{ pageSize: 5}}
             dataSource={_.get(projectData,'budget',[])}
             columns = {[
               {
               title:"costHead",
               key: "costHead",
               dataIndex: "costHead"
               },
               {
                title:"costType",
                key: "costType",
                dataIndex: "costType"
                },
                {
                  title:"expenseFrequency",
                  key: "expenseFrequency",
                  dataIndex: "expenseFrequency"
                },
                {
                  title:"unitAmount",
                  key: "unitAmount",
                  dataIndex: "unitAmount"
                },
                {
                    title:"units",
                    key: "units",
                    dataIndex: "units"
                },
                {
                  title:"status",
                  key: "status",
                  dataIndex: "status"
                },    
          
                {
                  title:"actualStartTime",
                  key: "actualStartTime",
                  dataIndex: "actualStartTime"
                },
                {
                  title:"actualEndTime",
                  key: "actualEndTime",
                  dataIndex: "actualEndTime"
                },
                {
                  title:"totalAmount",
                  key: "totalAmount",
                  dataIndex: "totalAmount"
                }
        
            ]}
          >
                    </Table>
        </Card>
       </Panel>

       <Panel key='8' header='Project KPI'>
         {!_.isEmpty(_.get(projectData,'kpi'))&& <Card type="inner" title="Project KPI Overview" >
        { !_.isEmpty(_.get(projectData,'kpi')) && <Line  {...kpiConfig}/>}
        </Card>}
      
        <Card type="inner" title="Project KPI Details">
          <Table scroll={{x:1000}}
            pagination={{ pageSize: 5}}
             dataSource={_.get(projectData,'kpi',[])}
             columns = {[
               {
               title:"name",
               key: "name",
               dataIndex: "name"
               },
               {
                title:"type",
                key: "type",
                dataIndex: "type"
                },
                {
                  title:"targetValue",
                  key: "targetValue",
                  dataIndex: "targetValue"
                },
                {
                  title:"unit",
                  key: "unit",
                  dataIndex: "unit"
                },
                {
                    title:"frequencyOfMeasurement",
                    key: "frequencyOfMeasurement",
                    dataIndex: "frequencyOfMeasurement"
                }
            ]}
          >
          </Table>
        </Card>
            </Panel>  




      <Panel key="4" header="Project sustainability strategy">
      <Card type="inner">
        <Paragraph style = {{margin:"8px"}}>
          <Text strong underline> 
            {`Impact measurement and monitoring strategy:`}
          </Text>
          {` ${_.get(projectData,'strategy.impactMonitoring')}`}
        </Paragraph>
        <Paragraph style = {{margin:"8px"}}>
          <Text strong underline> 
            {`Project sustainability strategy:`}
          </Text>
          {` ${_.get(projectData,'strategy.sustainability')}`}
        </Paragraph>
        <Paragraph style = {{margin:"8px"}}>
          <Text strong underline> 
            {`Project stakeholders:`}
          </Text>
          {` ${_.get(projectData,'strategy.stakeHolder')}`}
        </Paragraph>
        <Paragraph style = {{margin:"8px"}}>
          <Text strong underline> 
            {`Project risks and mitigation strategy:`}
          </Text>
          {` ${_.get(projectData,'strategy.risks')}`}
        </Paragraph>
        </Card>
      </Panel>

       <Panel key='5' header= "Benefits">
       <Card type="inner">
        <Paragraph style = {{margin:"8px"}}>
          <Text strong underline> 
            {`Strategic benefits to funders:`}
          </Text>
          {` ${_.get(projectData,'benefits.offerDescription')}`}
        </Paragraph>
        </Card>
       </Panel>
      </Collapse>

      
      </Card>
    </div>
  );
}

export default ProjectDetailPage;
