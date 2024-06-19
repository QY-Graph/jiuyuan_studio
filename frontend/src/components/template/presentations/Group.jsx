// GroupedEditorSidebar.jsx
import React from 'react';
import { Layout } from 'antd';
import EditorContainer from '../../contents/containers/Editor';
import Sidebar from '../../sidebar/containers/Sidebar';
import Contents from '../../contents/containers/Contents2';
import AppHeader2 from '../../header/AppHeader2';
import './DefaultTemplate.scss';

const { 
  Header, Footer, Sider, Content, 
} = Layout;

const Group = () => (
  <div>
    <Layout>
      <Header className='edit-header'>
        <AppHeader2 />
      </Header>
      <div className='group-main-content'>
        <div className='edit-sidebar'>
          <Sidebar />
        </div>
        <div className='edit-main'>
          <EditorContainer />
          <Contents />
        </div>
      </div>
    </Layout>  
  </div>
);

export default Group;
