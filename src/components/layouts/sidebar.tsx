import React from 'react';
import {
    UserOutlined,
    EditFilled,
    ProjectFilled,
    HomeFilled
  } from '@ant-design/icons';

import { Menu, Typography } from 'antd';
import {useHistory}  from 'react-router';
import { PageHeader } from 'antd';
import Cookies from 'universal-cookie';


const { Text } = Typography;

const SideNav = () => {

    const cookies = new Cookies();

    const showProfile = cookies.get('ngoId') ? true:false;
    const history = useHistory();

    const handleProfileClick = () => {
        history.push('/profile');
    }

    const handleProjectClick = () => {
        history.push('/project');
    }


    const handleCreateProjectClick = () => {
        history.push('/createProject');
    }

    const handleFunderProjectClick = () => {
        history.push('/funderProject');
    }


    const handleFunderProjectViewClick = () => {
        history.push('/funderProjectView');
    }





  return (
      <div style={{background: "#fff"}}>
        <div>
        <PageHeader
            title="Kelvin"
            avatar={{ src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4' }}
        />             
        </div>
            {cookies.get('type') === 'funder' && <Menu mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1" onClick={handleFunderProjectClick}>
                    <ProjectFilled />
                    <span>My Projects</span>
                </Menu.Item>
                <Menu.Item key="2" onClick={handleFunderProjectViewClick}>
                    <EditFilled />
                    <span>View projects</span>
                </Menu.Item>
            </Menu>}

            {cookies.get('type') === 'ngo' &&  <Menu mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" onClick={handleProjectClick}>
                    <ProjectFilled />
                    <span>Projects</span>
                </Menu.Item>

                {showProfile && <Menu.Item key="2" onClick={handleProfileClick}>
                    <UserOutlined />
                    <span>Profile</span>
                </Menu.Item>
                }
                <Menu.Item key="3" onClick={handleCreateProjectClick}>
                    <EditFilled />
                    <span>Create project</span>
                </Menu.Item>
            </Menu>}

        </div>

            
  );
}

export default SideNav;
