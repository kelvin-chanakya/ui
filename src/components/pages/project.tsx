import React, {useEffect, useState} from 'react';
import {Row, Col, Typography, Input, Form, Button, 
Radio, Switch, Slider, Select, message, Card, Divider} from 'antd';
import axios from 'axios';
import {useHistory} from 'react-router';
import { List, Avatar, Space } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
import { EditOutlined, FundViewOutlined, SettingOutlined } from '@ant-design/icons';
import Cookies from 'universal-cookie';

const { Title, Paragraph, Text, Link } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};



const ProjectList = () => {
  const [listData, setListData] = useState([]);
  const history = useHistory();
  const cookies = new Cookies();
   useEffect(() => {
        async function fetchData() {
          let {data} = await axios.post(`http://ec2-18-224-65-21.us-east-2.compute.amazonaws.com:8080/ngo/getProjects`, {ngoId: cookies.get('ngoId'), type: cookies.get('type')})
          setListData(data);
        }    
        fetchData()
      }, [])


      const logout = () => {
        cookies.remove('ngoId');
        cookies.remove('type');
        history.push('/home');
        window.location.reload();
      };

  return (
      <Card title="My Projects" extra={<Button  onClick={logout} size = {'large'} >
      Logout
     </Button>}>
         {
           listData.map((item:any)=>{
            const status = item.status? item.status: "Not Started" ;
             return (
              <Card.Grid 
              hoverable={false}
              style={{width:'25%%',textAlign:'center'}}>
              <Card title={<Title level={3}>{item.name}</Title>}   type= "inner" color ={""}
              hoverable={true}
           
                    cover={
                              <img
                                width="100"
                                height="150"
                                onClick={()=>{
                                  history.push({ pathname: '/projectDashboard',
                                      search: `?id=${item._id}`,
                                    })
                                  }}
                                src={item.logo? item.logo: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"}
                              />}
                           actions={[<FundViewOutlined key="view" onClick={()=>{
                            history.push({ pathname: '/projectDetails',
                                search: `?id=${item._id}`,
                              })
                           }} / > ,<EditOutlined key="edit" onClick={()=>{
                            history.push({ pathname: '/updateProject',
                                search: `?id=${item._id}`,
                              })
                           }} />]}                    
                    >
              <Meta style={{margin:"8px"}}
                description={`Status: ${status}`}
              />

              <Paragraph style = {{margin:"8px", height:'72px'}}
                ellipsis={{
                  rows: 3
                }}
              >
              {item.description}
              </Paragraph> 
              </Card>
            </Card.Grid>
             )
           })
         }
       </Card>
  );
}

export default ProjectList;
