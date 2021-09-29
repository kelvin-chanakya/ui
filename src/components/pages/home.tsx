import React, {useEffect, useState,useCallback} from 'react'
import {Table, Row, Col, Card, Button, Typography, message ,Avatar, Divider, Layout, Modal, Input, Tooltip, Select} from 'antd';
import {useHistory} from 'react-router';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { EditOutlined, EllipsisOutlined, SettingOutlined, ProjectFilled } from '@ant-design/icons';

const { Header, Footer, Sider, Content } = Layout;

const { Meta } = Card;

const { Option } = Select;
const {Title} = Typography;


const Home = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const cookies = new Cookies();
  const history = useHistory();
  const [showRegister,setShowRegister] = useState(!cookies.get('ngoId'));


  const showModal = () => {
    setIsModalVisible(true);
  };

  const logout = () => {
    cookies.remove('ngoId');
    cookies.remove('type');
    setShowRegister(false);
    window.location.reload();
  };


  const handleOk = async () => {
    let response = await axios.post('http://ec2-18-224-65-21.us-east-2.compute.amazonaws.com:8080/ngo/addDetails',{email:email,phone:phone, type: type});
    cookies.set('ngoId',response.data._id);
    cookies.set('type',type);
    console.log(response);
    console.log(type);
    setIsModalVisible(false);
    if(type=='ngo')
      history.push('/project')
    else
      history.push('/funderProject');
    window.location.reload();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onEmailChange = (obj:any) => {
    setEmail(obj.target.value);

  };

  const onPhoneChange = (obj:any) => {
    setPhone(obj.target.value);
  };

  const onTypeChange = (value:any) => {
    setType(value);
  };


  // const onProjectClick =() =>{
  //   if(!cookies.get('ngoId')) {
  //     message.error('Please Login to View Projects')
  //     return;
  //   }
    
  //   history.push('/project')
  // }

  // const onCreateProjectClick =() =>{
  //   if(!cookies.get('ngoId')) {
  //     message.error('Please Login to create Project')
  //     return;
  //   }
  //   history.push('/createProject')
  // }


  return (
    <Layout>
    <Header style={{background:"#fff",backgroundImage:'url(https://static.vecteezy.com/system/resources/thumbnails/000/165/005/small/2-02.jpg)'}}>
       <div style = {{float:'right'}}>
         {showRegister && <Button  onClick={showModal} size = {'large'} >
           Register
         </Button>}

         {!showRegister && <Button  onClick={logout} size = {'large'} >
          Logout
         </Button>}
      <Modal title="Register" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Input
          placeholder="Enter your Email"
          prefix="Email"
          onChange = {onEmailChange}
        />
        <br />
        <br />
        <Input
          placeholder="Enter your phone"
          prefix="+91"
          onChange = {onPhoneChange}
        />
        <br />
        <br />

        <Select
          placeholder="Login as"
          onChange = {onTypeChange}

        

        >
      <Option value="ngo">NGO</Option>
      <Option value="funder">DONER</Option>
        </Select>
        <br />
        <br />
      </Modal>
       </div>
       <Divider orientation="left"> 
    </Divider>
    </Header>

    <Content>
       <Card title="Our Products">
        <Card.Grid style={{width:'50%',textAlign:'center'}} hoverable={false}>
        <Card type= "inner" hoverable={true}cover={<img onClick = {showModal}  height="250px" alt="example" src="https://leverageedu.com/blog/wp-content/uploads/2020/05/Report-Writing.jpg" />}
                   actions={[<ProjectFilled />]}>

        <Meta style={{margin:"8px"}}
          description="View Projects"
          />
        </Card>
         </Card.Grid>
         <Card.Grid  style={{width:'50%',textAlign:'center'}}  hoverable={false}>
        <Card type= "inner"  hoverable={true} onClick = {showModal} cover={<img  height="250px" alt="example" src="https://hygger.io/wp-content/uploads/2020/07/7.png" />}
                   actions={[<EditOutlined key="edit" />
                
                  ]}
                  
                  >
        <Meta style={{margin:"8px"}}
               description="Create a Project"
          />
        </Card>
        </Card.Grid>
       </Card>
    </Content>
  </Layout>

  );
}

export default Home;