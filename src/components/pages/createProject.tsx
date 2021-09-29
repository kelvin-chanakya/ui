import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  message,
  InputNumber,
  Collapse
} from 'antd';
import { Card } from 'antd';
import { Upload } from 'antd';
import Icon, { UploadOutlined } from '@ant-design/icons';
import Axios from 'axios';
import Cookies from 'universal-cookie';
import TextArea from 'antd/lib/input/TextArea';
import csv from 'csvtojson';
const { Panel } = Collapse;

const _ = require('lodash');
// const csv=require('csvtojson')

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 8
    }
  }
};

const ProjectForm = () => {
  const [form] = Form.useForm();
  const [compliancesForm] = Form.useForm();
  const [baselineStudyFile, setBaselineStudyFileChange] = useState('');
  const [tocFile, setTocFileChange] = useState('');
  const [projectLogo, setProjectLogo] = useState('');

  const [implementationUrl, setImplementationUrl] = useState('');
  const [kpiUrl, setKpiUrl] = useState('');
  const [budgetUrl, setBudgeturl] = useState('');

  const [implementation, setImplementation] = useState([]);
  const [budget, setBudget] = useState([]);
  const [kpi, setKpi] = useState([]);
  // const [itr, setItr] = useState('');
  // const [eigthyG, setEigthyG] = useState('');
  // const [certificate, setCertificate] = useState('');
  const cookies = new Cookies();
  const openInNewTab = (url:string) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  useEffect(() => {
    async function fetchData() {

    }

    fetchData();
  }, []);

  const onFinish = async (values: any) => {
    message.loading('Updating data');
    values = _.set(values,'solution.tocFile', tocFile);
    values = _.set(values,'problem.baselineStudyFile', baselineStudyFile);

    let { data } = await Axios.post(
      'http://ec2-18-224-65-21.us-east-2.compute.amazonaws.com:8080/project/createProject',
      {
        ngoId: cookies.get('ngoId'),
        ...values,
        status: 'Not started',
        implementation,
        budget,
        kpi,
        logo: projectLogo
      }
    );
    message.success('CREATED !!!');
  };


  const onKpiChange = (e: any) => {
    if (e.file.status === 'done') {
      setKpiUrl(e.file.response.Location);
    }
  };

  const onImplementationChange = (obj: any) => {
    if (obj.file.status === 'done') {
      setImplementationUrl(obj.file.response.Location);
    }
  };

  const onBudgetChange = (obj: any) => {
    if (obj.file.status === 'done') {
      setBudgeturl(obj.file.response.Location);
    }
  };

  const onBaselineStudyFileChange = (e: any) => {
    if (e.file.status === 'done') {
      console.log('onBaselineStudyFileChange');
      setBaselineStudyFileChange(e.file.response.Location);
    }
  };

  const onTocFileChange = (e: any) => {
    if (e.file.status === 'done') {
      setTocFileChange(e.file.response.Location);
    }
  };


  const onProjectLogoChange = (e: any) => {
    if (e.file.status === 'done') {
      setProjectLogo(e.file.response.Location);
    }
  };

  const prefixSelector = (
    <Form.Item name='prefix' noStyle>
      <Select style={{ width: 70 }}>
        <Option value='91'>+91</Option>
      </Select>
    </Form.Item>
  );

  return (
    <Card title='Create Project'>
      <Card type='inner'>

        <Form
          {...formItemLayout}
          form={form}
          name='register'
          onFinish={onFinish}
          initialValues={{
            prefix: '91'
          }}
          scrollToFirstError
        >
        <Collapse>
        <Panel header="Basic project details" key="1">
          <Form.Item
            name='name'
            label='Project name'
            rules={[
              {
                required: true,
                message: 'Please input project name!'
              }
            ]}
          >
            <Input />
          </Form.Item>
    
          <Form.Item
            name='description'
            label='Project description'
            rules={[
              {
                required: true,
                message: 'Please input your Project Description!'
              }
            ]}
          >
            <TextArea />
          </Form.Item>

          <Form.Item name='projectLogo' label='Upload project logo Or image'>
            <Upload
              onChange={onProjectLogoChange}
              accept='.png,.jpeg'
              data={{
                path: `${cookies.get(
                  'ngoId'
                )}/project/profile/${new Date().getTime()}`
              }}
              action={
                'http://ec2-18-224-65-21.us-east-2.compute.amazonaws.com:8080/file/upload'
              }
            >
          <Button icon={<UploadOutlined />}>
                 Upload Project Logo
              </Button>
            </Upload>
            {projectLogo && <Button type="dashed" onClick={()=>openInNewTab(projectLogo)}>View Project logo</Button>}
            </Form.Item>

          <Form.Item
            name='location'
            label='Project location'
          >
            <Input />
          </Form.Item>

          <Form.Item
            name='targetBeneficiary'
            label='Project beneficiaries '
          >
            <Input />
          </Form.Item>

          <Form.Item
            name='objectives'
            label='Project objectives'
    
          >
            <TextArea />
          </Form.Item>


          <Form.Item
            name='activities'
            label='Project activities'

          >
            <TextArea />
          </Form.Item>

          <Form.Item
            name='duration'
            label='Project duration'
  
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item
            name='durationUnit'
            label='Project duration unit'
          >
            <Select defaultValue='day'>
              <Option value='day'>Day</Option>
              <Option value='month'>Month</Option>
              <Option value='year'>Year</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name='totalBudget'
            label='Total project budget'
      
          >
            <InputNumber min={0} />
          </Form.Item>
          </Panel>

         <Panel key="2" header = 'Project rationale'>
          <Form.Item
            name={['problem', 'description']}
            label='Project rationale description'
  
          >
            <TextArea />
          </Form.Item>

          <Form.Item
            name={['problem', 'baselineStudyFile']}
            label='Upload base line study'
          >
            <Upload
              onChange={onBaselineStudyFileChange}
              data={{
                path: `${cookies.get(
                  'ngoId'
                )}/project/baseline/${new Date().getTime()}`
              }}
              action={
                'http://ec2-18-224-65-21.us-east-2.compute.amazonaws.com:8080/file/upload'
              }
            >
              <Button icon={<UploadOutlined />}>
                Upload base line study File
              </Button>
            </Upload>

            {baselineStudyFile && <Button type="dashed" onClick={()=>openInNewTab(baselineStudyFile)}>View Base line study file</Button>}
          </Form.Item>

          </Panel>
 
          <Panel key="3" header = 'Project intervention'>
          <Form.Item
            name={['solution', 'description']}
            label='Intervention description'
          >
            <TextArea />
          </Form.Item>

          <Form.Item name={['solution', 'tocFile']} label='Upload Theory of Change'>
            <Upload
              onChange={onTocFileChange}
              data={{
                path: `${cookies.get(
                  'ngoId'
                )}/project/toc/${new Date().getTime()}`
              }}
              action={
                'http://ec2-18-224-65-21.us-east-2.compute.amazonaws.com:8080/file/upload'
              }
            >
              <Button icon={<UploadOutlined />}>Upload Theory of Change File</Button>
            </Upload>
            {tocFile && <Button type="dashed" onClick={()=>openInNewTab(tocFile)}>View Theory of Change File</Button>}
          </Form.Item>

          </Panel>
   

          <Panel key ='4' header="Project implementation plan">
          <Form.Item
            name='implementationFile'
            label='Upload Project implementation'
          >
            <Upload
              accept='.csv'
              showUploadList={false}
              beforeUpload={(file) => {
                const reader = new FileReader();
                reader.onload = async (e: any) => {
                  let jsonArr = await csv().fromString(e.target.result);
                  let implementationArr = jsonArr.map((implementation) => {
                    implementation.estimatedStartTime = new Date(implementation.estimatedStartTime);
                    implementation.estimatedEndTime = new Date(implementation.estimatedEndTime);
                    implementation.duration = parseInt(implementation.duration);
                    return implementation;
                  });
                  setImplementation(_.cloneDeep(implementationArr));
                };
                reader.readAsText(file);
                return true;
              }}
              onChange={onImplementationChange} data= {{
                path: `${cookies.get(
                  'ngoId'
                )}/project/implementation/${new Date().getTime()}`}} 
               action={"http://ec2-18-224-65-21.us-east-2.compute.amazonaws.com:8080/file/upload"}
            >
              <Button icon={<UploadOutlined />}>Upload Project implementation File</Button>
            </Upload>
            <Button type="dashed" onClick={()=>openInNewTab('https://kelvin6912.s3.us-east-2.amazonaws.com/imple.csv')}>View Format</Button>
            {implementationUrl && <Button type="dashed" onClick={()=>openInNewTab(implementationUrl)}>View Uploaded file</Button>}
          </Form.Item>
          </Panel>
 
          <Panel key="5" header = 'Project budget and financial information'>
          <Form.Item
            name='budgetFile'
            label='Upload Project budget and financial information'
          >
            <Upload
              accept='.csv'
              showUploadList={false}
              beforeUpload={(file) => {
                const reader = new FileReader();

                reader.onload = async (e: any) => {
                  let jsonArr = await csv().fromString(e.target.result);
                  let budgetArr = jsonArr.map((budget) => {
                    budget.expenseFrequency = parseInt(budget.expenseFrequency);
                    budget.unitAmount = parseInt(budget.unitAmount);
                    budget.units = parseInt(budget.units);
                    budget.totalAmount = parseInt(budget.totalAmount);
                    return budget;
                  });
                  setBudget(_.cloneDeep(budgetArr));
                };
                reader.readAsText(file);

                return true;
              }}
              onChange={onBudgetChange} data= {{
                path: `${cookies.get(
                  'ngoId'
                )}/project/budget/${new Date().getTime()}`}} 
               action={"http://ec2-18-224-65-21.us-east-2.compute.amazonaws.com:8080/file/upload"}
            >
              <Button icon={<UploadOutlined />}>Upload Project budget</Button>
            </Upload>
            <Button type="dashed" onClick={()=>openInNewTab('https://kelvin6912.s3.us-east-2.amazonaws.com/budget.csv')}>View Format</Button>
            {budgetUrl && <Button type="dashed" onClick={()=>openInNewTab(budgetUrl)}>View Uploaded file</Button>}
          </Form.Item>

          </Panel>
   
          <Panel key="6" header = 'Project KPI'>
          <Form.Item
            name='kpiFile'
            label='Upload Project KPIs'
          >
            <Upload
              accept='.csv'
              showUploadList={false}
              beforeUpload={(file) => {
                const reader = new FileReader();
                reader.onload = async (e: any) => {
                  let jsonArr = await csv().fromString(e.target.result);
                  let kpiArr = jsonArr.map((kpi) => {
                    kpi.targetValue = parseInt(kpi.targetValue);
                    return kpi;
                  });
                  setKpi(_.cloneDeep(kpiArr));
                };
                reader.readAsText(file);

                return true;

              }}

              onChange={onKpiChange} data= {{
                path: `${cookies.get(
                  'ngoId'
                )}/project/kpi/${new Date().getTime()}`}} 
               action={"http://ec2-18-224-65-21.us-east-2.compute.amazonaws.com:8080/file/upload"}
            >
              <Button icon={<UploadOutlined />}>Upload KPI file</Button>
            </Upload>
            <Button type="dashed" onClick={()=>openInNewTab('https://kelvin6912.s3.us-east-2.amazonaws.com/kpi.csv')}>View Format</Button>
            {kpiUrl && <Button type="dashed" onClick={()=>openInNewTab(kpiUrl)}>View Uploaded file</Button>}
          </Form.Item>
          </Panel>
  


          <Panel key="7" header = 'Project sustainability strategy'>
          <Form.Item
            name={['strategy', 'impactMonitoring']}
            label='Impact Monitoring Strategy'
          >
            <TextArea />
          </Form.Item>

          <Form.Item
            name={['strategy', 'sustainability']}
            label='Project sustainability strategy'
          >
            <TextArea />
          </Form.Item>

          <Form.Item
            name={['strategy', 'stakeHolder']}
            label='Project stakeholders'
          >
            <TextArea />
          </Form.Item>

          <Form.Item
            name={['strategy', 'risks']}
            label='Project risks and mitigation strategy'
          >
            <TextArea />
          </Form.Item>
          </Panel>

          <Panel key="8" header="Benefits">
          <Form.Item
            name={['benefits', 'offerDescription']}
            label='Strategic benefits to funders'

          >
            <TextArea />
          </Form.Item>
          </Panel>
          </Collapse>
        
          <Form.Item {...tailFormItemLayout} style ={{marginTop:'16px', float:'left'}}>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Card>
  );
};

export default ProjectForm;