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

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CaretRightOutlined } from '@ant-design/icons';
import { Modal, Button, Collapse } from 'antd';
import uuid from 'react-uuid';
import { connect, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faTimes } from '@fortawesome/free-solid-svg-icons';
import {
  VerticalLine, HorizontalLine, SubLabelLeft, SubLabelRight, GraphSelectDropdown,
} from './SidebarComponents';
import './Sidebar.scss';

// TODO: keep only the cypher query without "select * .."
const genLabelQuery = (eleType, labelName, database) => {
  if (eleType === 'node') {
    if (labelName === '*') {
      return `SELECT * from cypher('${database.graph}', $$
        MATCH (V)
        RETURN V
$$) as (V agtype);`;
    }
    return `SELECT * from cypher('${database.graph}', $$
        MATCH (V:${labelName})
        RETURN V
$$) as (V agtype);`;
  }
  if (eleType === 'edge') {
    if (labelName === '*') {
      return `SELECT * from cypher('${database.graph}', $$
        MATCH (V)-[R]-(V2)
        RETURN V,R,V2
$$) as (V agtype, R agtype, V2 agtype);`;
    }
    return `SELECT * from cypher('${database.graph}', $$
        MATCH (V)-[R:${labelName}]-(V2)
        RETURN V,R,V2
$$) as (V agtype, R agtype, V2 agtype);`;
  }

  return '';
};

const genPropQuery = (eleType, propertyName) => {
  if (eleType === 'v') {
    return `MATCH (V) WHERE V.${propertyName} IS NOT NULL RETURN V`;
  }
  if (eleType === 'e') {
    return `MATCH (V)-[R]->(V2) WHERE R.${propertyName} IS NOT NULL RETURN *`;
  }
  return '';
};

const NodeList = ({ nodes, setCommand }) => {
  let list;
  if (nodes) {
    list = nodes.map((item) => (
      <NodeItems
        key={uuid()}
        label={item.label}
        cnt={item.cnt}
        setCommand={setCommand}
      />
    ));
    return (
      <div style={{
        flexWrap: 'wrap',
        height: 'calc(100% - 2px)',
        overflowY: 'scroll',
      }}
      >
        {list}
      </div>
    );
  }

  return null;
};
NodeList.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    cnt: PropTypes.number,
  })).isRequired,
  setCommand: PropTypes.func.isRequired,
};

const NodeItems = connect((state) => ({
  database: state.database,
}), {})(
  ({
    label, cnt, setCommand, database,
  }) => (
    <div className='node-item' onClick={() => setCommand(genLabelQuery('node', label, database))}>
      <img src="/resources/images/menu/csv.png" alt="Description" className='csvfile' />
      {label}
      (
      {cnt}
      )
    </div>
  ),
);
NodeItems.propTypes = {
  database: PropTypes.shape({
    graph: PropTypes.string,
  }).isRequired,
  label: PropTypes.string.isRequired,
  cnt: PropTypes.number.isRequired,
  setCommand: PropTypes.func.isRequired,
};

const EdgeList = ({ edges, setCommand }) => {
  let list;
  if (edges) {
    list = edges.map((item) => (
      <EdgeItems
        key={uuid()}
        label={item.label}
        cnt={item.cnt}
        setCommand={setCommand}
      />
    ));
    return (
      <div style={{
        flexWrap: 'wrap',
        height: 'calc(100% - 2px)',
        overflowY: 'scroll',
      }}
      >
        {list}
      </div>
    );
  }

  return null;
};
EdgeList.propTypes = {
  edges: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    cnt: PropTypes.number,
  })).isRequired,
  setCommand: PropTypes.func.isRequired,
};

const EdgeItems = connect((state) => ({
  database: state.database,
}), {})(({
  label, cnt, setCommand, database,
}) => (
  <div className='node-item' onClick={() => setCommand(genLabelQuery('edge', label, database))}>
    <img src="/resources/images/menu/csv.png" alt="Description" className='csvfile' />
    {label}
    (
    {cnt}
    )
  </div>
));
EdgeItems.propTypes = {
  database: PropTypes.shape({
    graph: PropTypes.string,
  }).isRequired,
  label: PropTypes.string.isRequired,
  cnt: PropTypes.number.isRequired,
  setCommand: PropTypes.func.isRequired,
};

const PropertyList = ({ propertyKeys, setCommand }) => {
  let list;
  if (propertyKeys) {
    list = propertyKeys.map((item) => (
      <PropertyItems
        key={uuid()}
        propertyName={item.key}
        keyType={item.key_type}
        setCommand={setCommand}
      />
    ));
    return (
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        height: '80px',
        overflowY: 'auto',
        marginTop: '12px',
      }}
      >
        {list}
      </div>
    );
  }

  return null;
};
PropertyList.propTypes = {
  propertyKeys: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    key_type: PropTypes.string,
  })).isRequired,
  setCommand: PropTypes.func.isRequired,
};

const PropertyItems = ({ propertyName, keyType, setCommand }) => (
  <button
    type="button"
    className={`${keyType === 'v' ? 'propertie-item' : 'propertie-item'} propertie-item`}
    onClick={() => setCommand(genPropQuery(keyType, propertyName))}
  >
    {propertyName}
  </button>
);
PropertyItems.propTypes = {
  propertyName: PropTypes.string.isRequired,
  keyType: PropTypes.string.isRequired,
  setCommand: PropTypes.func.isRequired,
};

const GraphList = ({
  graphs,
  currentGraph,
  changeCurrentGraph,
  changeGraph,
}) => {
  let list;
  if (graphs) {
    list = graphs.map((item) => (
      <GraphItems
        key={uuid()}
        graph={item[0]}
        gid={item[1]}
        currentGraph={currentGraph}
        changeCurrentGraph={changeCurrentGraph}
        changeGraph={changeGraph}
      />
    ));
    return (
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        height: '80px',
        overflowY: 'auto',
        marginTop: '12px',
      }}
      >
        {list}
      </div>
    );
  }

  return null;
};
GraphList.propTypes = {
  graphs: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  currentGraph: PropTypes.string.isRequired,
  changeCurrentGraph: PropTypes.func.isRequired,
  changeGraph: PropTypes.func.isRequired,
};

const GraphItems = ({
  graph,
  gid,
  currentGraph,
  changeCurrentGraph,
  changeGraph,
}) => (
  <button
    type="button"
    className={`${graph === currentGraph ? 'graph-item-clicked' : 'graph-item'}`}
    onClick={() => { changeCurrentGraph({ id: gid }); changeGraph({ graphName: graph }); }}
  >
    {graph}
  </button>
);
GraphItems.propTypes = {
  graph: PropTypes.string.isRequired,
  gid: PropTypes.string.isRequired,
  currentGraph: PropTypes.string.isRequired,
  changeCurrentGraph: PropTypes.func.isRequired,
  changeGraph: PropTypes.func.isRequired,
};

const ConnectedText = ({ userName, roleName }) => (
  <div>
    <h6>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <SubLabelRight label="Username :" classes="col-sm-6" />
        <SubLabelLeft label={userName} classes="col-sm-6" />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <SubLabelRight label="Roles :" classes="col-sm-6" />
        <SubLabelLeft label={roleName} classes="col-sm-6" />
      </div>
    </h6>
  </div>
);
ConnectedText.propTypes = {
  userName: PropTypes.string.isRequired,
  roleName: PropTypes.string.isRequired,
};

const DBMSText = ({ dbname, graph }) => (
  <div>
    <h6>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <SubLabelRight label="Databases :" classes="col-sm-6" />
        <SubLabelLeft label={dbname} classes="col-sm-6" />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <SubLabelRight label="Graph Path :" classes="col-sm-6" />
        <SubLabelLeft label={graph} classes="col-sm-6" />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <SubLabelRight label="Information :" classes="col-sm-6" />
        <SubLabelLeft label="-" classes="col-sm-6" />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <SubLabelRight label="Query List :" classes="col-sm-6" />
        <SubLabelLeft label="-" classes="col-sm-6" />
      </div>
    </h6>
  </div>
);
DBMSText.propTypes = {
  dbname: PropTypes.string.isRequired,
  graph: PropTypes.string.isRequired,
};

const { Panel } = Collapse;

const SidebarHome = ({
  edges,
  nodes,
  currentGraph,
  graphs,
  propertyKeys,
  setCommand,
  command,
  trimFrame,
  addFrame,
  getMetaData,
  changeCurrentGraph,
  changeGraph,
  isLabel,
}) => {
  const dispatch = useDispatch();
  const { confirm } = Modal;

  useEffect(() => {
    dispatch(() => getMetaData({ currentGraph }));
  }, [currentGraph]);

  const requestDisconnect = () => {
    const refKey = uuid();
    dispatch(() => trimFrame('ServerDisconnect'));
    dispatch(() => addFrame(command, 'ServerDisconnect', refKey));
  };

  const refreshSidebarHome = () => {
    getMetaData({ currentGraph });
  };

  // 控制展开的面板
  const [activeKey, setActiveKey] = useState(['1', '2']);
  // 处理全部展开和收起
  const handleToggleExpand = () => {
    if (activeKey.length === 2) {
      setActiveKey([]);
    } else {
      setActiveKey(['1', '2']);
    }
  };

  return (
    <div className="sidebar-home mysidebar">
      <div className="sidebar sidebar-body">
        <div className='graphPick'>
          { !isLabel && (
            <>
              <div className="sidebar-item-disconnect-buttons">
                <GraphSelectDropdown
                  currentGraph={currentGraph}
                  graphs={graphs}
                  changeCurrentGraph={changeCurrentGraph}
                  changeGraphDB={changeGraph}
                />
              </div>
            </>
          ) }
          <div>
            <Button type="primary" onClick={() => refreshSidebarHome()}>
              <img src="/resources/images/menu/refresh.png" alt="Description" className='btnimg' />
            </Button>
            <Button type="primary" onClick={() => handleToggleExpand()}>
              <img 
                src="/resources/images/menu/open.png" 
                alt="Description" 
                className={`btnimg2 ${activeKey.length === 2 ? 'rotated' : ''}`} 
              />
            </Button>
          </div>
        </div>
        <Collapse
          bordered={false}
          activeKey={activeKey}
          defaultActiveKey={['1', '2']}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          className="site-collapse-custom-collapse"
        >
          <Panel header="Node Label" key="1" className='nodelabel'>
            <NodeList nodes={nodes} setCommand={setCommand} />
          </Panel>
          <Panel header="Edge Label" key="2" className='nodelabel'>
            <EdgeList edges={edges} setCommand={setCommand} />
          </Panel>
        </Collapse>
        {/* <div className="form-group sidebar-item">
          <div className='nodelabel'>Node Label</div>
          <br />
          <NodeList nodes={nodes} setCommand={setCommand} />
        </div>

        <div className="form-group sidebar-item">
          <div className='nodelabel'>Edge Label</div>
          <br />
          <EdgeList edges={edges} setCommand={setCommand} />
        </div> */}

        {/* <div className="form-group sidebar-item">
          <b>Properties</b>
          <br />
          <PropertyList propertyKeys={propertyKeys} setCommand={setCommand} />
        </div>
        { isLabel && (
          <>
            <div className="form-group sidebar-item">
              <b>Graphs</b>
              <br />
              <GraphList
                graphs={graphs}
                currentGraph={currentGraph}
                changeCurrentGraph={changeCurrentGraph}
                changeGraph={changeGraph}
              />
            </div>
          </>
        ) } */}
      </div>
      {/* <div className="sidebar-item-disconnect-outer">
        <div className="form-group sidebar-item-disconnect">
          <div className="sidebar-item-disconnect-buttons">

            <br />
            <b>Refresh</b>
          </div>
          <HorizontalLine />
          <div className="sidebar-item-disconnect-buttons">
            <button
              className="frame-head-button close_session btn btn-link"
              type="button"
              color="#142B80"
              onClick={() => confirm({
                title: 'Are you sure you want to close this window?',
                onOk() {
                  requestDisconnect();
                },
                onCancel() {
                  return false;
                },
              })}
              aria-label="Close Button"
            >
              <FontAwesomeIcon
                icon={faTimes}
                size="1x"
                color="white"
              />
            </button>
            <br />
            <b>Close Session</b>
          </div>
          
        </div>
      </div> */}
    </div>
  );
};

SidebarHome.propTypes = {
  edges: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    cnt: PropTypes.number,
  })).isRequired,
  nodes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    cnt: PropTypes.number,
  })).isRequired,
  propertyKeys: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    key_type: PropTypes.string,
  })).isRequired,
  setCommand: PropTypes.func.isRequired,
  command: PropTypes.string.isRequired,
  trimFrame: PropTypes.func.isRequired,
  addFrame: PropTypes.func.isRequired,
  getMetaData: PropTypes.func.isRequired,
  changeCurrentGraph: PropTypes.func.isRequired,
  currentGraph: PropTypes.string.isRequired,
  graphs: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  changeGraph: PropTypes.func.isRequired,
  isLabel: PropTypes.bool.isRequired,
};

export default SidebarHome;
