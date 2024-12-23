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
// import { generateCytoscapeElement } from './generateElementsWorker';

const d = [];
const generateCytoscapeElement = (data, maxDataOfGraph, isNew) => {
  const nodeLabelColors = [
    {
      color: '#604A0E', borderColor: '#423204', fontColor: '#FFF', nodeLabels: new Set([]), index: 0,
    },
    {
      color: '#C990C0', borderColor: '#B261A5', fontColor: '#FFF', nodeLabels: new Set([]), index: 1,
    },
    {
      color: '#F79767', borderColor: '#F36924', fontColor: '#FFF', nodeLabels: new Set([]), index: 2,
    },
    {
      color: '#57C7E3', borderColor: '#23B3D7', fontColor: '#2A2C34', nodeLabels: new Set([]), index: 3,
    },
    {
      color: '#F16667', borderColor: '#EB2728', fontColor: '#FFF', nodeLabels: new Set([]), index: 4,
    },
    {
      color: '#D9C8AE', borderColor: '#C0A378', fontColor: '#2A2C34', nodeLabels: new Set([]), index: 5,
    },
    {
      color: '#8DCC93', borderColor: '#5DB665', fontColor: '#2A2C34', nodeLabels: new Set([]), index: 6,
    },
    {
      color: '#ECB5C9', borderColor: '#DA7298', fontColor: '#2A2C34', nodeLabels: new Set([]), index: 7,
    },
    {
      color: '#498EDA', borderColor: '#2870C2', fontColor: '#FFF', nodeLabels: new Set([]), index: 8,
    },
    {
      color: '#FFC454', borderColor: '#D7A013', fontColor: '#2A2C34', nodeLabels: new Set([]), index: 9,
    },
    {
      color: '#DA7194', borderColor: '#CC3C6C', fontColor: '#FFF', nodeLabels: new Set([]), index: 10,
    },
    {
      color: '#569480', borderColor: '#447666', fontColor: '#FFF', nodeLabels: new Set([]), index: 11,
    },
  ];
  
  const edgeLabelColors = [
    {
      color: '#CCA63D', borderColor: '#997000', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 0,
    },
    {
      color: '#C990C0', borderColor: '#B261A5', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 1,
    },
    {
      color: '#F79767', borderColor: '#F36924', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 2,
    },
    {
      color: '#57C7E3', borderColor: '#23B3D7', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 3,
    },
    {
      color: '#F16667', borderColor: '#EB2728', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 4,
    },
    {
      color: '#D9C8AE', borderColor: '#C0A378', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 5,
    },
    {
      color: '#8DCC93', borderColor: '#5DB665', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 6,
    },
    {
      color: '#ECB5C9', borderColor: '#DA7298', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 7,
    },
    {
      color: '#498EDA', borderColor: '#2870C2', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 8,
    },
    {
      color: '#FFC454', borderColor: '#D7A013', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 9,
    },
    {
      color: '#DA7194', borderColor: '#CC3C6C', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 10,
    },
    {
      color: '#569480', borderColor: '#447666', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 11,
    },
  ];

  const nodes = [];
  const edges = [];
  const nodeLegend = {};
  const edgeLegend = {};

  const nodeLabelSizes = [
    { size: 11, labels: new Set([]), index: 0 },
    { size: 33, labels: new Set([]), index: 0 },
    { size: 55, labels: new Set([]), index: 0 },
    { size: 77, labels: new Set([]), index: 0 },
    { size: 99, labels: new Set([]), index: 0 },
  ];

  const edgeLabelSizes = [
    { size: 1, labels: new Set([]), index: 0 },
    { size: 6, labels: new Set([]), index: 0 },
    { size: 11, labels: new Set([]), index: 0 },
    { size: 16, labels: new Set([]), index: 0 },
    { size: 21, labels: new Set([]), index: 0 },
  ];

  const nodeLabelCaptions = {};
  const edgeLabelCaptions = {};

  const sortByKey = (datam) => {
    const sorted = {};
    if (datam === undefined) {
      return sorted;
    }
    Object.keys(datam).sort().forEach((key) => {
      sorted[key] = datam[key];
    });
    return sorted;
  };
  
  const getNodeColor = (labelName) => {
    let selectedColor = {};
    nodeLabelColors.forEach((labelColor) => {
      if (labelColor.nodeLabels.has(labelName)) {
        selectedColor = {
          color: labelColor.color,
          borderColor: labelColor.borderColor,
          fontColor: labelColor.fontColor,
        };
      }
    });
  
    if (Object.keys(selectedColor).length === 0) {
      const randomIndex = Math.floor(Math.random() * (nodeLabelColors.length));
      nodeLabelColors[randomIndex].nodeLabels.add(labelName);
      selectedColor = {
        color: nodeLabelColors[randomIndex].color,
        borderColor: nodeLabelColors[randomIndex].borderColor,
        fontColor: nodeLabelColors[randomIndex].fontColor,
      };
    }
    return selectedColor;
  };

  const getEdgeColor = (labelName) => {
    let selectedColor = {};
    edgeLabelColors.forEach((labelColor) => {
      if (labelColor.edgeLabels.has(labelName)) {
        selectedColor = {
          color: labelColor.color,
          borderColor: labelColor.borderColor,
          fontColor: labelColor.fontColor,
        };
      }
    });
  
    if (Object.keys(selectedColor).length === 0) {
      const randomIndex = Math.floor(Math.random() * (edgeLabelColors.length));
      edgeLabelColors[randomIndex].edgeLabels.add(labelName);
      selectedColor = {
        color: edgeLabelColors[randomIndex].color,
        borderColor: edgeLabelColors[randomIndex].borderColor,
        fontColor: edgeLabelColors[randomIndex].fontColor,
      };
    }
    return selectedColor;
  };

  const getCaption = (valType, val) => {
    if (valType === 'node' && Object.prototype.hasOwnProperty.call(nodeLabelCaptions, val.label)) {
      return nodeLabelCaptions[val.label];
    }
    if (valType === 'edge' && Object.prototype.hasOwnProperty.call(edgeLabelCaptions, val.label)) {
      return edgeLabelCaptions[val.label];
    }
  
    let caption = valType === 'node' ? 'gid' : 'label';
    const { properties } = val;
    if (properties !== undefined) {
      if (Object.prototype.hasOwnProperty.call(properties, 'name')) {
        caption = 'name';
      } else if (Object.prototype.hasOwnProperty.call(properties, 'id')) {
        caption = 'id';
      }
    }
  
    return caption;
  };

  const getNodeSize = (labelName) => {
    let selectedSize = 0;
  
    const nSize = nodeLabelSizes.find((labelSize) => labelSize.labels.has(labelName));
  
    if (nSize) {
      selectedSize = nSize.size;
    } else {
      nodeLabelSizes[2].labels.add(labelName);
      selectedSize = nodeLabelSizes[2].size;
    }
  
    return selectedSize;
  };

  const getEdgeSize = (labelName) => {
    let selectedSize = 0;
  
    const eSize = edgeLabelSizes.find((labelSize) => labelSize.labels.has(labelName));
  
    if (eSize) {
      selectedSize = eSize.size;
    } else {
      edgeLabelSizes[0].labels.add(labelName);
      selectedSize = edgeLabelSizes[0].size;
    }
  
    return selectedSize;
  };

  function generateElements(alias, val) {
    const labelName = val.label.trim();
    let source = val.start;
    let target = val.end;

    if (!source) {
      source = val.start_id;
    }

    if (!target) {
      target = val.end_id;
    }

    if (source && target) {
      if (!Object.prototype.hasOwnProperty.call(edgeLegend, labelName)) {
        edgeLegend[labelName] = {
          size: getEdgeSize(labelName),
          caption: getCaption('edge', val),
          ...getEdgeColor(labelName),
        };
      }
      if (!Object.prototype.hasOwnProperty.call(edgeLabelCaptions, labelName)) {
        edgeLabelCaptions[labelName] = 'label';

        // if has property named [ name ], than set [ name ]
        if (Object.prototype.hasOwnProperty.call(val.properties, 'name')) {
          nodeLabelCaptions[labelName] = 'name';
        }
      }

      if (!Object.prototype.hasOwnProperty.call(val.properties, edgeLegend.caption)) {
        edgeLegend[labelName].caption = getCaption('edge', val);
      }
      edges.push(
        {
          group: 'edges',
          data: {
            id: val.id,
            source,
            target,
            label: val.label,
            backgroundColor: edgeLegend[labelName].color,
            borderColor: edgeLegend[labelName].borderColor,
            fontColor: edgeLegend[labelName].fontColor,
            size: edgeLegend[labelName].size,
            properties: val.properties,
            caption: edgeLegend[labelName].caption,
          },
          alias,
          classes: isNew ? 'new node' : 'edge',
        },
      );
      console.log(JSON.stringify(labelName), edgeLegend[labelName], edges);
    } else {
      if (!Object.prototype.hasOwnProperty.call(nodeLegend, labelName)) {
        nodeLegend[labelName] = {
          size: getNodeSize(labelName),
          caption: getCaption('node', val),
          ...getNodeColor(labelName),
        };
      }
      if (!Object.prototype.hasOwnProperty.call(nodeLabelCaptions, labelName)) {
        nodeLabelCaptions[labelName] = 'gid';

        // if has property named [ name ], than set [ name ]
        if (Object.prototype.hasOwnProperty.call(val.properties, 'name')) {
          nodeLabelCaptions[labelName] = 'name';
        }
      }

      if (!Object.prototype.hasOwnProperty.call(val.properties, nodeLegend.caption)) {
        nodeLegend[labelName].caption = getCaption('node', val);
      }
      nodes.push(
        {
          group: 'nodes',
          data: {
            id: val.id,
            label: val.label,
            backgroundColor: nodeLegend[labelName].color,
            borderColor: nodeLegend[labelName].borderColor,
            fontColor: nodeLegend[labelName].fontColor,
            size: nodeLegend[labelName].size,
            properties: val.properties,
            caption: nodeLegend[labelName].caption,
          },
          alias,
          classes: isNew ? 'new node' : 'node',
        },
      );
    }
  }
  if (data) {
    data.forEach((row, index) => {
      if (index >= maxDataOfGraph && maxDataOfGraph !== 0) {
        return;
      }
      Object.entries(row).forEach((rowEntry) => {
        const [alias, val] = rowEntry;
        if (Array.isArray(val)) {
          // val이 Path인 경우 ex) MATCH P = (V)-[R]->(V2) RETURN P;
          Object.entries(val).forEach((valueEntry) => {
            const [pathAlias, pathVal] = valueEntry;
            generateElements(pathAlias, pathVal);
          });
        } else if (val) {
          generateElements(alias, val);
        }
      });
    });
  }
  console.log('edge sizes', edgeLabelSizes);
  return {
    legend: {
      nodeLegend: sortByKey(nodeLegend),
      edgeLegend: sortByKey(edgeLegend),
    },
    elements: {
      nodes,
      edges,
    },
  };
};

const generateMetadataElements = (nodeLegend, edgeLegend, nodes, edges, val) => {
  const labelName = val.la_name;
  if (val.la_start && val.la_end) {
    edges.push(
      {
        group: 'edges',
        data: {
          id: val.la_oid,
          source: val.la_start,
          target: val.la_end,
          label: val.la_name,
          backgroundColor: edgeLegend[labelName].color,
          borderColor: edgeLegend[labelName].borderColor,
          fontColor: edgeLegend[labelName].fontColor,
          size: edgeLegend[labelName].size,
          properties: { count: val.la_count, id: val.la_oid, name: val.la_name },
          caption: edgeLegend[labelName].caption,
        },
        classes: 'edge',
      },
    );
  } else {
    nodes.push(
      {
        group: 'nodes',
        data: {
          id: val.la_oid,
          label: val.la_name,
          backgroundColor: nodeLegend[labelName].color,
          borderColor: nodeLegend[labelName].borderColor,
          fontColor: nodeLegend[labelName].fontColor,
          size: nodeLegend[labelName].size,
          properties: { count: val.la_count, id: val.la_oid, name: val.la_name },
          caption: nodeLegend[labelName].caption,
        },
        classes: 'node',
      },
    );
  }
};

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
