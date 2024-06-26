import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Layout, Col, Input, Row, Modal,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { disconnectToDatabase } from '../../features/database/DatabaseSlice';
import { resetMetaData } from '../../features/database/MetadataSlice';
import './AppHeader2.scss';

const { Header } = Layout;
const { confirm } = Modal;

const AppHeader = () => {
  const [current, setCurrent] = useState('1');

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  const location = useLocation();
  const getImageSrc = (type, path) => {
    // console.log(path);
    switch (path) {
      case '/editor':
        if (type === 2) { 
          return '/resources/images/menu/mn1.png';
        }
        return '/resources/images/menu/mn2.png';
      case '/upload':
        if (type === 3) { 
          return '/resources/images/menu/mn1.png';
        }
        return '/resources/images/menu/mn2.png';
      default:
        return '/resources/images/menu/mn1.png'; // 默认图片
    }
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = (index) => () => {
    console.log(index);
    if (index === 1) {
      confirm({
        title: 'Are you sure you want to disconnect?',
        icon: <ExclamationCircleOutlined />,
        content: 'Once disconnected, you will need to reconnect to access the database.',
        okText: 'disconnect',
        okType: 'danger',
        cancelText: 'cancel',
        onOk() {
          dispatch(disconnectToDatabase()).then((response) => {
            if (response.type === 'database/disconnectToDatabase/fulfilled') {
              localStorage.removeItem('databaseStatus');
              resetMetaData();
              navigate('/connect');
            }
          });
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else if (index === 3) {
      navigate('/editor');
    } else if (index === 2) {
      navigate('/upload');
    }
  };

  return (
    <div className='header2'>
      <div className='logo2'>
        <img src="/resources/images/menu/logo.png" alt="icon" className='logo-img2' />
      </div>
      <Row className='myrow2'>
        <Col span={8} className='mycol2'>
          <div className='colinner2' onClick={handleClick(1)}>
            <div className='imgout2'>
              <img src="/resources/images/menu/disconnect.png" alt="disconnect" className='Circle22' />
            </div>
            <div className='title12'>Disconnect</div>
          </div>
        </Col>
        <Col span={8} className='mycol2'>
          <div className='colinner2' onClick={handleClick(2)}>
            <div className='imgout2'>
              <img src={getImageSrc(2, location.pathname)} alt="Background" className='Circle22' />
              <img src="/resources/images/menu/menuicon2.png" alt="Logo" className='Circle222' />
            </div>
            <div className='title22'>Upload</div>
          </div>
        </Col>
        <Col span={8} className='mycol2'>
          <div className='colinner2' onClick={handleClick(3)}>
            <div className='imgout2'>
              <img src={getImageSrc(3, location.pathname)} alt="Background" className='Circle22' />
              <img src="/resources/images/menu/menuicon3.png" alt="Logo" className='Circle32' />
            </div>
            <div className='title22'>Search</div>
          </div>
        </Col>
      </Row>

    </div>
  );
};

export default AppHeader;
