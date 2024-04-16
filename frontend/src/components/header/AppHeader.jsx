import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

const AppHeader = () => {
  const [current, setCurrent] = useState('1');

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  const items = [
    {
      label: <Link to="/">主页</Link>,
      key: '1',
    },
    {
      label: <Link to="/editor">查询</Link>,
      key: '2',
    },
    {
      label: <Link to="/contents">连接</Link>,
      key: '3',
    },
    {
      label: <Link to="/upload">上传</Link>,
      key: '4',
    },
  ];

  return (
    <Header>
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
    </Header>
  );
};

export default AppHeader;
