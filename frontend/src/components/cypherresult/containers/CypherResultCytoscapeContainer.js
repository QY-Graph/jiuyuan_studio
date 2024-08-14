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

import React, { useEffect, useState, useRef } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { 
  useWorker, 
  WORKER_STATUS,
} from '@koale/useworker';
import { SoundTwoTone } from '@ant-design/icons';
import CypherResultCytoscape from '../presentations/CypherResultCytoscape';
import { setLabels, setRenderStatus } from '../../../features/cypher/CypherSlice';
import { openModal, addGraphHistory, addElementHistory } from '../../../features/modal/ModalSlice';
// import { generateCytoscapeElement } from '../../../features/cypher/CypherUtil';
import { generateCytoscapeElement } from './generateElementsWorker';

const mapStateToProps = (state, ownProps) => {
  const { refKey } = ownProps;

  return {
    renderStatus: state.cypher.renderStatus,
    queryResult: state.cypher.queryResult[refKey],
    maxDataOfGraph: state.setting.maxDataOfGraph,
    maxDataOfTable: state.setting.maxDataOfTable,
    setChartLegend: ownProps.setChartLegend,
    graph: state.database.graph,
  };
};

const mapDispatchToProps = {
  setLabels,
  openModal,
  addGraphHistory,
  addElementHistory,
};
const CypherResult = (props) => {
  const dispatch = useDispatch();
  // const [renderStatus, setRenderStatus] = useState(0);
  const renderStatus = useSelector((state) => state.cypher.renderStatus);
  const { 
    queryResult, 
    maxDataOfGraph, 
    maxDataOfTable, 
    setChartLegend, 
    graph, 
    setIsTable, 
    refKey, 
    onAddSubmit, 
    onRemoveSubmit,
  } = props;

  const [data, setData] = useState({
    legend: {
      nodeLegend: {},
      edgeLegend: {},
    },
    elements: {
      nodes: [],
      edges: [],
    },
  });
  // const latestQueryResult = useRef(queryResult);
  // useEffect(() => {
  //   latestQueryResult.current = queryResult;
  // }, [queryResult]);
  // const [generateCytoscapeElement] = useWorker(() => 
  // import('./generateElementsWorker').then((module) => module.generateCytoscapeElement));
  const [runworker] = useWorker(generateCytoscapeElement);

  useEffect(() => {
    console.log('=======================================', queryResult);
    if (queryResult.complete) {
      const delay = 100; // 延时 0.1 秒执行
      // setRenderStatus(1)
      // if(queryResult.rowCount == 0)
      dispatch(setRenderStatus({ key: refKey, status: 1 }));
      const timeoutId = setTimeout(async () => {
        console.log('==============init data=============');
        // console.log(renderStatus);
        try {
          const elements = await runworker(
            // latestQueryResult.current.rows,
            queryResult.rows,
            maxDataOfGraph,
            false,
          );

          if (elements && elements.length === 0) {
            // 如果元素数组为空，设置状态为0
            dispatch(setRenderStatus({ key: refKey, status: 0 }));
          } else {
            setData(elements);
          }
        } catch (error) {
          console.error('Worker error:', error);
          dispatch(setRenderStatus({ key: refKey, status: 0 }));
        }
      }, delay);
      // || (queryResult.columns.length == 1 && queryResult.columns[0] === 'r')
      if (queryResult.rowCount === 0 || (queryResult.columns.length === 1 && queryResult.columns[0] === 'r')) {
        dispatch(setRenderStatus({ key: refKey, status: 0 }));
      }

      // Cleanup function to clear the timeout if the component unmounts
      return () => clearTimeout(timeoutId);
    } 
    return () => {};
  }, [queryResult, maxDataOfGraph]);

  return (
    <CypherResultCytoscape
      data={data}
      maxDataOfGraph={maxDataOfGraph}
      maxDataOfTable={maxDataOfTable}
      setChartLegend={setChartLegend}
      graph={graph}
      renderStatus={renderStatus}
      setIsTable={setIsTable}
      onAddSubmit={onAddSubmit}
      onRemoveSubmit={onRemoveSubmit}
      refKey={refKey}
      openModal={openModal}
      addGraphHistory={addGraphHistory}
      addElementHistory={addElementHistory}
    />
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true },
)(CypherResult);
