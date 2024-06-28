/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Col, Form, Input, Row, message, InputNumber,
} from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import Frame from '../Frame2';
import AppHeader from '../../header/AppHeader';
import './ServerConnectFrame.scss';
import styles from './ServerConnectFrame.module.scss';
import { connectToDatabase as connectToDatabaseApi, changeGraph } from '../../../features/database/DatabaseSlice';
import { addAlert } from '../../../features/alert/AlertSlice';
import { addFrame, trimFrame } from '../../../features/frame/FrameSlice';
import { /* getMetaChartData, */ getMetaData } from '../../../features/database/MetadataSlice';

const FormInitialValue = {
  database: '',
  graph: '',
  host: '',
  password: '',
  port: null,
  user: '',
};

const ServerConnectFrame = ({
  refKey,
  isPinned,
  reqString,
  currentGraph,
}) => {
  const dispatch = useDispatch();

  const connectToDatabase = (data) => dispatch(connectToDatabaseApi(data)).then((response) => {
    console.log(response);
    if (response.type === 'database/connectToDatabase/fulfilled') {
      message.success('connect success！');
      dispatch(addAlert('NoticeServerConnected'));
      dispatch(trimFrame('ServerConnect'));
      dispatch(getMetaData({ currentGraph })).then((metadataResponse) => {
        if (metadataResponse.type === 'database/getMetaData/fulfilled') {
          const graphName = Object.keys(metadataResponse.payload)[0];
          /* dispatch(getMetaChartData()); */
          dispatch(changeGraph({ graphName }));
        }
        if (metadataResponse.type === 'database/getMetaData/rejected') {
          dispatch(addAlert('ErrorMetaFail'));
        }
      });
      dispatch(addFrame(':server status', 'ServerStatus'));
    } else if (response.type === 'database/connectToDatabase/rejected') {
      message.error(`connect failed: ${response.error.message}`);
      dispatch(addAlert('ErrorServerConnectFail', response.error.message));
    }
  });

  const [database, setDatabase] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleDatabaseChange = (event) => {
    setDatabase(event.target.value);
  };
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  const handlepasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const [focused1, setFocused1] = useState(false);
  const [focused2, setFocused2] = useState(false);
  const [focused3, setFocused3] = useState(false);
  const handleFocus1 = () => {
    setFocused1(true);
  };

  const handleBlur1 = () => {
    if (!database) {
      setFocused1(false);
    }
  };

  const handleFocus2 = () => {
    setFocused2(true);
  };

  const handleBlur2 = () => {
    if (!username) {
      setFocused2(false);
    }
  };

  const handleFocus3 = () => {
    setFocused3(true);
  };

  const handleBlur3 = () => {
    if (!password) {
      setFocused3(false);
    }
  };

  return (
    <Frame
      reqString={reqString}
      isPinned={isPinned}
      refKey={refKey}
    >
      <Row className={styles.FullHeightRow}>
        <Col span={10}>
          <div className={styles.Mask} />
          {/* 添加遮罩层 */}
          <img src="/resources/images/bgjy.jpg" alt="Description" className={styles.MyImage} />
          <img src="/resources/images/jylogo2.png" alt="Description" className={styles.LogoImage} />
        </Col>
        <Col span={14} className={styles.ColRight}>
          <AppHeader />
          {/* <div className={styles.FrameWrapper}> */}
          <div className={`${styles.FormLogin} form-login`}>
            <div className={styles.FormTitle}>
              <div className={styles.FormTitle1}>
                Connect to Database
              </div>
              <div className={styles.FormTitle2}>
                Database access might require an authenticated connection.
              </div>
            </div>
            <Form
              className={styles.FormMain}
              initialValues={FormInitialValue}
              layout="vertical"
              onFinish={connectToDatabase}
            >
              {/* <Form.Item name="host" label="Connect URL" rules={[{ required: true }]}>
                <Input placeholder="192.168.0.1" />
              </Form.Item>
              <Form.Item name="port" label="Connect Port" rules={[{ required: true }]}>
                <InputNumber placeholder="5432" className={styles.FullWidth} />
              </Form.Item> */}
              {/* <Form.Item name="database" label="Connect Port" rules={[{ required: true }]}>
                <Input placeholder="" className={styles.FullWidth} />
              </Form.Item> */}
              <div className={styles.FormItemOut}>
                <Form.Item 
                  className={styles.FormItem}
                  name="database" 
                  label="" 
                  rules={[{ required: true }]}
                >
                  <Input
                    value={database}
                    onChange={handleDatabaseChange}
                    className={`${styles.InputOner} ${database ? 'FilledColor' : ''}`}
                    onFocus={handleFocus1}
                    onBlur={handleBlur1}
                    size="large"
                    placeholder=""
                    prefix={
                      <img src="/resources/images/login/database.png" alt="icon" className={styles.IMG} />
                    }
                  />
                </Form.Item>
                <span className={`${styles.InputLabel} ${focused1 ? styles.focused : ''} ${database ? styles.filled : ''}`}>
                  {/* <span className={`${styles.InputLabel} ${database ? styles.filled : ''}`}> */}
                  Database Name
                </span>
              </div>

              <div className={styles.FormItemOut}>
                <Form.Item 
                  className={styles.FormItem}
                  name="user"
                  label="" 
                  rules={[{ required: true }]}
                >
                  <Input
                    value={username}
                    onChange={handleUsernameChange}
                    // className={styles.InputOner}
                    className={`${styles.InputOner} ${username ? 'FilledColor' : ''}`}
                    onFocus={handleFocus2}
                    onBlur={handleBlur2}
                    size="large"
                    placeholder=""
                    prefix={
                      <img src="/resources/images/login/user.png" alt="icon" className={styles.IMG} />
                    }
                  />
                </Form.Item>
                {/* 使用伪元素显示标签 */}
                <span className={`${styles.InputLabel} ${focused2 ? styles.focused : ''} ${username ? styles.filled : ''}`}>
                  User Name
                </span>
              </div>
              
              <div className={styles.FormItemOut}>
                <Form.Item
                  className={styles.FormItem}
                  name="password"
                  label="" 
                  rules={[{ required: true }]}
                >
                  <Input.Password
                    value={password}
                    onFocus={handleFocus3}
                    onBlur={handleBlur3}
                    onChange={handlepasswordChange}
                    // className={styles.InputOner}
                    className={`${styles.InputOner} ${password ? 'FilledColor' : ''}`}
                    size="large"
                    placeholder=""
                    prefix={
                      <img src="/resources/images/login/pwd.png" alt="icon" className={styles.IMG} />
                    }
                  />
                </Form.Item>
                {/* 使用伪元素显示标签 */}
                <span className={`${styles.InputLabel} ${focused3 ? styles.focused : ''} ${password ? styles.filled : ''}`}>
                  Password
                </span>
              </div>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" className={styles.SubmitBtn}>
                  Connect
                  <RightOutlined />
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </Frame>
  );
};

ServerConnectFrame.propTypes = {
  refKey: PropTypes.string.isRequired,
  isPinned: PropTypes.bool.isRequired,
  reqString: PropTypes.string.isRequired,
  currentGraph: PropTypes.string.isRequired,
};

export default ServerConnectFrame;
