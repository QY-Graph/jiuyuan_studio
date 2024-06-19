import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layout, Col, Input, Row,
} from 'antd';
import './AppHeader.scss';

const { Header } = Layout;

const AppHeader = () => {
  const [current, setCurrent] = useState('1');

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  const items = [
    {
      label: (
        <div className="svgOuter">
          <svg className="icon" aria-hidden="true">
            <use href="#icon-lianjie2" />
          </svg>
          <Link to="/contents">连接</Link>
        </div>
      ),
      key: '1',
    },
    {
      label: (
        <div className="svgOuter">
          <svg className="icon2" aria-hidden="true">
            <use href="#icon-shujuchaxun" />
          </svg>
          <Link to="/editor">查询</Link>
        </div>
      ),
      key: '2',
    },
    {
      label: (
        <div className="svgOuter">
          <svg className="icon" aria-hidden="true">
            <use href="#icon-shangchuan" />
          </svg>
          <Link to="/upload">上传</Link>
        </div>
      ),
      key: '4',
    },
  ];

  return (
    <div className='rowout'>
      {/* <Menu onClick={onClick} selectedKeys={[current]}
      mode="horizontal" items={items} className="antdMenu" /> */}
      <Row className='myrow'>
        <Col span={8} className='mycol'>
          <div className='colinner'>
            <div className='imgout'>
              <img src="/resources/images/menu/menu1.png" alt="Description" className='Circle' />
              <img src="/resources/images/menu/menuicon1.png" alt="Description" className='Circle2' />
            </div>
            <div className='activetitle'>Broken Line</div>
          </div>
        </Col>
        <Col span={8} className='mycol'>
          <div className='colinner'>
            <div className='imgout'>
              <img src="/resources/images/menu/menu2.png" alt="Background" className='Circle' />
              <img src="/resources/images/menu/menuicon2.png" alt="Logo" className='Circle2' />
            </div>
            <div className='deactivetitle'>Upload</div>
          </div>
        </Col>
        <Col span={8} className='mycol'>
          <div className='colinner'>
            <div className='imgout'>
              <img src="/resources/images/menu/menu3.png" alt="Description" className='Circle' />
            </div>
            <div className='deactivetitle'>Search</div>
          </div>
        </Col>
      </Row>

    </div>
  );
};

export default AppHeader;
