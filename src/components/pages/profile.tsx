

import React, { useEffect, useState } from 'react';
import { Form, Input, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, message, Collapse, DatePicker } from 'antd';
import { Card } from 'antd';
import { Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Axios from 'axios';
import Cookies from 'universal-cookie';
import moment from 'moment';
const _ = require('lodash');

const { Panel } = Collapse;

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};


const RegistrationForm =  () => {
      const [form] = Form.useForm();
      const [compliancesForm] = Form.useForm();
      const [bankForm] = Form.useForm();
      const [panFile, setPanFile] = useState("");
      const [itr, setItr] = useState("");
      const [eigthyG, setEigthyG] = useState("");
      const [certificate, setCertificate] = useState("");
      const [logo,setLogo] = useState("");
      const cookies = new Cookies();

      

      useEffect(() => {
        async function fetchData() {
          const {data} = await Axios.post("http://ec2-18-224-65-21.us-east-2.compute.amazonaws.com:8080/ngo/getDetails",{_id:cookies.get('ngoId')})
          //set basic values
          form.setFieldsValue({email:_.get(data,"email")});
          form.setFieldsValue({phone:_.get(data,"phone")});
          form.setFieldsValue({name:_.get(data,"name")});
          form.setFieldsValue({address:_.get(data,"address")});
          form.setFieldsValue({city:_.get(data,"city")});
          form.setFieldsValue({state:_.get(data,"state")});
  

          //set compliances
          compliancesForm.setFieldsValue({date:moment(_.get(data,"compliances.date"))});
          compliancesForm.setFieldsValue({number:_.get(data,"compliances.number")});
          compliancesForm.setFieldsValue({with:_.get(data,"compliances.with")});
          compliancesForm.setFieldsValue({city:_.get(data,"compliances.city")});
          compliancesForm.setFieldsValue({state:_.get(data,"compliances.state")});
          
          //setting files
          setLogo(_.get(data,"logo"));
          setPanFile(_.get(data,"compliances.panFile"));
          setItr(_.get(data,"compliances.itr"));
          setCertificate(_.get(data,"compliances.certificate"));
          setEigthyG(_.get(data,"compliances.eigthyG"));
          
          //bank fields
          bankForm.setFieldsValue({panNumber:_.get(data,"bank.panNumber")});
          bankForm.setFieldsValue({bankAccountName:_.get(data,"bank.bankAccountName")});
          bankForm.setFieldsValue({bankName:_.get(data,"bank.bankName")});
          bankForm.setFieldsValue({ifsc:_.get(data,"bank.ifsc")});
          bankForm.setFieldsValue({bankAccountNumber:_.get(data,"bank.bankAccountNumber")});
          bankForm.setFieldsValue({bankBranchAddress:_.get(data,"bank.bankBranchAddress")});
        }
    
        fetchData()
      }, []);

      const onFinishBasicdetails = async (values: any) => {
        message.loading('updating data');
        console.log(logo);
        let {data} = await Axios.post('http://ec2-18-224-65-21.us-east-2.compute.amazonaws.com:8080/ngo/updateDetails',{
          _id: cookies.get('ngoId'),
          ...values,
          logo
        })
  
        message.success('updated data');
        console.log(data);
      };

      const onDateChange = (e:any) =>{
        console.log(e);
      }
      const onFinishCompliances = async (values: any) => {
        message.loading('updating data');
        let {data} = await Axios.post('http://ec2-18-224-65-21.us-east-2.compute.amazonaws.com:8080/ngo/updateDetails',{
          _id: cookies.get('ngoId'),
          compliances: {
            ...values,
            panFile,
            eigthyG,
            certificate,
            itr
          }
        })
        message.success('updated data');
        console.log(data);
      };

      const onFinishBank = async (values: any) => {
        message.loading('updating data');
        let {data} = await Axios.post('http://ec2-18-224-65-21.us-east-2.compute.amazonaws.com:8080/ngo/updateDetails',{
          _id: cookies.get('ngoId'),
          bank: values
        })
        message.success('updated data');
        console.log(data);
      };

      const openInNewTab = (url:string) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
      }
    
      const onPanChange =  (e:any)=> {
        if (e.file.status === 'done') {
          console.log(e.file);
          setPanFile(e.file.response.Location);
        }
  
      }

      const onItrChange = (obj:any)=> {
        if (obj.file.status === 'done') {
          setItr(obj.file.response.Location);
        }
      }

      const on80GChange = (obj:any)=> {
        if (obj.file.status === 'done') {
          setEigthyG(obj.file.response.Location);
        }
      }

      const onCertficate = (obj:any)=> {
        if (obj.file.status === 'done') {
          setCertificate(obj.file.response.Location);
        }
      }
    
      const onLogoChange = (obj:any)=> {
        if (obj.file.status === 'done') {
          setLogo(obj.file.response.Location);
        }
      }
    

      const prefixSelector = (
        <Form.Item name="prefix" noStyle>
          <Select style={{ width: 70 }}>
            <Option value="91">+91</Option>
          </Select>
        </Form.Item>
      );

    
      return (
        <Card title="My Profile">

        <Collapse>
        <Panel header="Basic Details" key="1">    
        <Card type="inner">
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinishBasicdetails}
          initialValues={{
            prefix: '91'
          }}
          scrollToFirstError
        >

          <Form.Item
            name="name"
            label="Organisation legal name"
            rules={[
              {
                required: true,
                message: 'Please input ngo name!',
              },
            ]}
          >
            <Input />
         </Form.Item>
          <Form.Item
            name="email"
            label="Organisation email"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input/>
        </Form.Item>

        <Form.Item
            name="logo"
            label="Upload NGO's logo"
          >
            <Upload  accept='.png,.jpg' onChange={onLogoChange}  data= {{path:`${cookies.get('ngoId')}/logo`}} action={"http://ec2-18-224-65-21.us-east-2.compute.amazonaws.com:8080/file/upload"}>
                <Button icon={<UploadOutlined />}>Upload Logo</Button>
              </Upload>
              {logo && <Button type="dashed" onClick={()=>openInNewTab(logo)}>View Logo</Button>}
          </Form.Item>
         
          <Form.Item
            name="phone"
            label="Organisation phone number"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
          </Form.Item>
    
          <Form.Item
            name="address"
            label="Registered address"
            rules={[{ required: true, message: 'Please input Address!' }]}
          >
            <Input />
          </Form.Item>
    
          <Form.Item
            name="city"
            label="Registered city"
            rules={[{ required: true, message: 'Please enter your City!' }]}
          >
           <Input/>
          </Form.Item>
         <Form.Item
            name="state"
            label="Registered state"
            rules={[{ required: true, message: 'Please enter your State!' }]}
          >
             <Input />
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" >
              Submit
            </Button>
          </Form.Item>
        </Form>
        </Card>
        </Panel>

        <Panel header="Regulatory Compliances" key="2">    
        <Card
          style={{ marginTop: 16 }}
          type="inner"
        >
               <Form
          {...formItemLayout}
          form={compliancesForm}
          name="register"
          onFinish={onFinishCompliances}
          initialValues={{
            residence: ['zhejiang', 'hangzhou', 'xihu'],
            prefix: '91',
          }}
          scrollToFirstError
        >

          <Form.Item
            name="date"
            label="Registration date"
            rules={[
              {
                required: true,
                message: 'Please input Registration Date!',
              },
            ]}
          >
          <DatePicker />
          </Form.Item>
    
          <Form.Item
            name="number"
            label="Registration number"
            rules={[
              {
                required: true,
                message: 'Please input your Registration Number!',
              },
            ]}
            hasFeedback
          >
           <Input/>
          </Form.Item>
  
          <Form.Item
            name="with"
            label="Registered under"
            rules={[{ required: true, message: 'Please input the org you are Registered with!', whitespace: true }]}
          >
           <Input/>
          </Form.Item>

          <Form.Item
            name="city"
            label="Registration city"
            rules={[{ required: true, message: 'Please input the city you are Registered with!', whitespace: true }]}
          >
           <Input/>
          </Form.Item>


          <Form.Item
            name="panfile"
            label="Upload organisation pan card"
          >
            <Upload onChange={onPanChange} data= {{path:`${cookies.get('ngoId')}/pan`}} action={"http://ec2-18-224-65-21.us-east-2.compute.amazonaws.com:8080/file/upload"}>
                <Button icon={<UploadOutlined />}>Upload Pan Card</Button>
              </Upload>
              {panFile && <Button type="dashed" onClick={()=>openInNewTab(panFile)}>View Pan Card</Button>}
          </Form.Item>

          <Form.Item
            name="itr"
            label="Upload latest income tax returns (ITR)"
          >
            <Upload onChange={onItrChange} data= {{path:`${cookies.get('ngoId')}/itr`}} action={"http://ec2-18-224-65-21.us-east-2.compute.amazonaws.com:8080/file/upload"}>
                <Button icon={<UploadOutlined />}>Upload ITR Certificate</Button>
              </Upload>
              {itr && <Button type="dashed" onClick={()=>openInNewTab(panFile)}>View ITR</Button>}
          </Form.Item>

          <Form.Item
            name="eigthyG"
            label="Upload 80G Certificate"
          >
            <Upload  onChange={on80GChange}  data= {{path:`${cookies.get('ngoId')}/80g`}} action={"http://ec2-18-224-65-21.us-east-2.compute.amazonaws.com:8080/file/upload"}>
                <Button icon={<UploadOutlined />}>Upload 80G Certificate</Button>
              </Upload>
              {eigthyG && <Button type="dashed" onClick={()=>openInNewTab(eigthyG)}>View 80G</Button>}
          </Form.Item>

          <Form.Item
            name="certificate"
            label="Upload registration document"
          >
            <Upload  onChange={onCertficate}  data= {{path:`${cookies.get('ngoId')}/certificate`}} action={"http://ec2-18-224-65-21.us-east-2.compute.amazonaws.com:8080/file/upload"}>
                <Button icon={<UploadOutlined />}>Upload Certificate</Button>
              </Upload>
              {certificate && <Button type="dashed" onClick={()=>openInNewTab(certificate)}>View Certificate</Button>}
          </Form.Item>
                    
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" >
              Submit
            </Button>
          </Form.Item>
        </Form>
        </Card>
        </Panel>

        <Panel header="Financial information" key="3">    
        <Card
          style={{ marginTop: 16 }}
          type="inner"
        >
               <Form
          {...formItemLayout}
          form={bankForm}
          name="register"
          onFinish={onFinishBank}
          initialValues={{
            prefix: '91',
          }}
          scrollToFirstError
        >

          <Form.Item
            name="panNumber"
            label="Organisation pan card number"
            rules={[
              {
                required: true,
                message: 'Please input pan card number!',
              },
            ]}
          >
          <Input />
          </Form.Item>
    
          <Form.Item
            name="bankAccountName"
            label="Bank account name"
            rules={[
              {
                required: true,
                message: 'Please input your Bank account name!',
              },
            ]}
          >
           <Input/>
          </Form.Item>

          <Form.Item
            name="bankName"
            label="Bank name"
            rules={[
              {
                required: true,
                message: 'Please input your bank name!',
              },
            ]}
          >
           <Input/>
          </Form.Item>
  
          <Form.Item
            name="bankAccountNumber"
            label="Bank account number"
            rules={[{ required: true, message: 'Please input your Bank account number!', whitespace: true }]}
          >
           <Input/>
          </Form.Item>

          <Form.Item
            name="bankBranchAddress"
            label="Bank branch address"
            rules={[{ required: true, message: 'Please input the Bank branch address!', whitespace: true }]}
          >
           <Input/>
          </Form.Item>

          <Form.Item
            name="ifsc"
            label="IFSC code"
            rules={[{ required: true, message: 'Please input the Bank IFSC code!', whitespace: true }]}
          >
           <Input/>
          </Form.Item>


    
                    
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" >
              Submit
            </Button>
          </Form.Item>
        </Form>
        </Card>
        </Panel>

        </Collapse>
      </Card>
      );
  };
    
export default RegistrationForm;
