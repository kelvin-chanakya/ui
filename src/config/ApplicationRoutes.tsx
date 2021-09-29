import React, {useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import List from "../components/pages/home";
import ProjectDetail from "../components/pages/projectDetail";
import ProjectDashboard from "../components/pages/projectDashboard";
import ProjectList from "../components/pages/project";
import SideNav from "../components/layouts/sidebar";
import CreateProject from "../components/pages/createProject";
import Videos from "../components/pages/profile";
import UpdateProject from "../components/pages/updateProject";
import FunderProject from "../components/pages/funderProject";
import FunderProjectView from "../components/pages/funderViewProject";
import Cookies from 'universal-cookie';



import { Layout } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined
  } from '@ant-design/icons';

const { Header, Sider, Content} = Layout;


const ApplicationRoutes = () => {
  const [collapse, setCollapse] = useState(false);
  const cookies = new Cookies();

  useEffect(() => {
    window.innerWidth <= 760 ? setCollapse(true) : setCollapse(false);
  }, []);

    const handleToggle = (event: any) => {
        event.preventDefault();
        collapse ? setCollapse(false) : setCollapse(true);
    }
  return (
      <Router>
        <Layout>
          <Sider trigger={null} theme="light" collapsible collapsed={collapse}>
            <SideNav  />
          </Sider>
          <Layout>
              <Content style={{marginLeft: '4px', minHeight: "calc(100vh)", background: "#fff"}}>
                <Switch>
                    <Route path="/home" component={List} />
                    <Route path="/project" component={ProjectList} />
                    <Route path="/funderProject" component={FunderProject} />
                    <Route path="/funderProjectView" component={FunderProjectView} />
                    <Route path="/profile" component={Videos} />
                    <Route path="/projectDetails" component={ProjectDetail} />
                    <Route path="/projectDashboard" component={ProjectDashboard} />
                    <Route path="/updateProject" component={UpdateProject} />
                    <Route path="/createProject" component={CreateProject} />
                    {cookies.get('ngoId') && cookies.get('type') ==='ngo' && <Redirect to="/project" from="/" />}
                    {cookies.get('ngoId') && cookies.get('type') ==='funder' && <Redirect to="/funderProject" from="/" />}
                    {!cookies.get('ngoId') && <Redirect to="/home" from="/" />}
                </Switch>
              </Content>
          </Layout>
        </Layout>
    </Router>
  );
}

export default ApplicationRoutes;