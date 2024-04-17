import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
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
          <svg className="icon1" aria-hidden="true">
            <use href="#icon-zhuye1" />
          </svg>
          <Link to="/">主页</Link>
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
            <use href="#icon-lianjie2" />
          </svg>
          <Link to="/contents">连接</Link>
        </div>
      ),
      key: '3',
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
    <Header>
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} className="antdMenu" />
    </Header>
  );
};

export default AppHeader;
