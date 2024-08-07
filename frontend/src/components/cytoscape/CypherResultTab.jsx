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

/* eslint-disable react/react-in-jsx-scope */
import { Tabs } from 'antd';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import IconGraph from '../../icons/IconGraph';
import './Cypher.scss';

class CypherResultTab extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.refKey = props.refKey;
    this.currentTab = props.currentTab;
    this.setIsTable = props.setIsTable;
  }

  render() {
    const activeTab = (refKey, tabType) => {
      console.log(refKey);
      console.log(tabType);
      if (tabType === 'graph') {
        document.getElementById(`${refKey}-${tabType}`).classList.add('selected-frame-tab');
        document.getElementById(`${refKey}-${tabType}`).classList.remove('deselected-frame-tab');
        document.getElementById(`${refKey}-table`).classList.add('deselected-frame-tab');
        document.getElementById(`${refKey}-table`).classList.remove('selected-frame-tab');
      } else if (tabType === 'table') {
        document.getElementById(`${refKey}-${tabType}`).classList.add('selected-frame-tab');
        document.getElementById(`${refKey}-${tabType}`).classList.remove('deselected-frame-tab');
        document.getElementById(`${refKey}-graph`).classList.add('deselected-frame-tab');
        document.getElementById(`${refKey}-graph`).classList.remove('selected-frame-tab');
      }
    };

    const handleTabChange = (activeKey) => {
      console.log(this.refKey);
      if (activeKey === '1') {
        activeTab(this.refKey, 'graph');
        this.setIsTable(false);
      } else if (activeKey === '2') {
        this.setIsTable(true);
        activeTab(this.refKey, 'table');
      }
    };

    const { currentTab } = this.props; 
    // 将currentTab转换为对应的Tab key
    const getActiveKey = () => {
      // currentTab = this.props.currentTab;
      console.log(currentTab);
      return currentTab === 'graph' ? '1' : '2';
    };

    return (
      <div className="legend-button-area">
        {/* Current Tab: 
        {currentTab} */}
        <Tabs activeKey={getActiveKey()} onChange={handleTabChange}>
          <Tabs.TabPane tab="&nbsp;&nbsp;graph&nbsp;&nbsp;" key="1" />
          <Tabs.TabPane tab="&nbsp;&nbsp;table&nbsp;&nbsp;" key="2" />
        </Tabs>
        {/* <button
          className="btn"
          type="button"
          style={{ width: '50%', fontSize: '14px', color: this.currentTab === 'graph' 
          ? '#142B80' : '#495057' }}
          onClick={() => { activeTab(this.refKey, 'graph'); this.setIsTable(false); }}
        >
          <IconGraph />
          <br />
          <b style={{ fontSize: '14px;' }}>Graph</b>
        </button> */}
        {/* <div
          style={{
            backgroundColor: '#C4C4C4',
            width: '1px',
            height: '76px',
            marginTop: '20px',
          }}
        /> */}
        {/* <button
          className="btn"
          type="button"
          style={{ width: '50%', fontSize: '14px', color: this.currentTab === 'table' 
            ? '#142B80' : '#495057' }}
          onClick={() => { activeTab(this.refKey, 'table'); this.setIsTable(true); }}
        >
          <FontAwesomeIcon icon={faTable} style={{ fontSize: '25px' }} />
          <br />
          <b style={{ fontSize: '14px;' }}>Table</b>
        </button> */}
      </div>
    );
  }
}

CypherResultTab.propTypes = {
  refKey: PropTypes.string.isRequired,
  currentTab: PropTypes.string.isRequired,
  setIsTable: PropTypes.func.isRequired,
};

export default CypherResultTab;
