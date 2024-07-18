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

import React, { createRef, useEffect, useState } from 'react';
import uuid from 'react-uuid';
import { useDispatch } from 'react-redux';
import { saveAs } from 'file-saver';
import { Parser } from 'json2csv';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { CloseSquareOutlined, CloseOutlined, StopOutlined } from '@ant-design/icons';
import { Spinner } from 'react-bootstrap';
import { removeActiveRequests } from '../../../features/cypher/CypherSlice';
import CypherResultCytoscapeContainer from '../../cypherresult/containers/CypherResultCytoscapeContainer';
import CypherResultTableContainer from '../../cypherresult/containers/CypherResultTableContainer';
import GraphFilterModal from '../../cypherresult/components/GraphFilterModal';
import EdgeThicknessMenu from '../../cypherresult/components/EdgeThicknessMenu';
import Frame from '../Frame';

const CypherResultFrame = ({
  cancelCypherQuery,
  queryComplete,
  refKey,
  isPinned,
  reqString,
}) => {
  const dispatch = useDispatch();
  const chartAreaRef = createRef();
  const [cytoscapeContainerKey, setCytoscapeContainerKey] = useState(uuid());

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [thicknessModalVisible, setThicknessModalVisible] = useState(false);

  const [filterProperties, setFilterProperties] = useState([]);
  const [filterTable, setFilterTable] = useState(null);
  const [edgeProperties, setEdgeProperties] = useState([]);
  const [addFilter, setAddFilter] = useState(null);
  const [removeFilter, setRemoveFilter] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [globalThickness, setGlobalThickness] = useState(null);

  const [chartLegend, setChartLegend] = useState({ edgeLegend: {}, nodeLegend: {} });
  const [isTable, setIsTable] = useState(false);

  useEffect(() => {
    if (chartAreaRef.current && filterModalVisible) {
      const labels = Object.keys(chartLegend.nodeLegend)
        .map(
          (label) => {
            const propertiesIter = Array.from(chartAreaRef.current.getCaptionsFromCytoscapeObject('node', label));
            return propertiesIter.map((value) => ({
              label,
              property: value,
            }));
          },
        ).flat();
      setFilterProperties(labels);
    }
    if (chartAreaRef.current && thicknessModalVisible) {
      const edges = Object.keys(chartLegend.edgeLegend)
        .map((edge) => {
          const propertiesIter = Array.from(chartAreaRef.current.getCaptionsFromCytoscapeObject('edge', edge));
          return propertiesIter.map((value) => ({
            edge,
            property: value,
          }));
        }).flat();
      setEdgeProperties(edges);
    }
  }, [filterModalVisible, thicknessModalVisible, chartLegend]);

  useEffect(() => {
    if (!chartAreaRef.current) return;
    if (globalFilter && !isTable) {
      chartAreaRef.current.applyFilterOnCytoscapeElements(globalFilter);
    } else if (globalFilter && isTable) {
      setFilterTable(globalFilter);
    } else {
      chartAreaRef.current.resetFilterOnCytoscapeElements();
      setFilterTable();
    }
  }, [globalFilter]);

  useEffect(() => {
    if (addFilter) {
      if (globalFilter) setGlobalFilter([...globalFilter, addFilter]);
      else setGlobalFilter([addFilter]);
    }
  }, [addFilter]);

  useEffect(() => {
    if (removeFilter) {
      if (globalFilter) {
        const newFilterList = globalFilter.filter((filterItem) => (
          filterItem.keyword !== removeFilter.keyword
        ));
        if (newFilterList.length > 0) setGlobalFilter(newFilterList);
        else setGlobalFilter(null);
      }
    }
  }, [removeFilter]);

  useEffect(() => {
    if (!chartAreaRef.current) return;
    chartAreaRef.current.applyEdgeThicknessCytoscapeElements(globalThickness);
  }, [globalThickness]);

  const refreshFrame = () => {
    console.log('refreshFrame');
    setCytoscapeContainerKey(uuid());
  };

  const downloadPng = () => {
    const eleJson = chartAreaRef.current.getCy().elements().jsons();
    if (eleJson.length === 0) {
      alert('No data to download!');
      return;
    }

    const pngOption = {
      output: 'base64uri',
      bg: 'transparent',
      full: true,

    };
    saveAs(chartAreaRef.current.getCy().png(pngOption), `${reqString.replace(/ /g, '_')}.png`);
  };

  const downloadJson = () => {
    const eleJson = chartAreaRef.current.getCy().elements().jsons();
    if (eleJson.length === 0) {
      alert('No data to download!');
      return;
    }
    saveAs(new Blob([JSON.stringify(eleJson.map((ele) => ({
      label: ele.data.label,
      gid: ele.data.id,
      source: ele.data.source,
      target: ele.data.target,
      properties: ele.data.properties,
    })))], { type: 'application/json;charset=utf-8' }), `${reqString.replace(/ /g, '_')}.json`);
  };

  const downloadCsv = () => {
    console.log('refresh==================');
    const eleJson = chartAreaRef.current.getCy().elements().jsons();
    if (eleJson.length === 0) {
      alert('No data to download!');
      return;
    }

    const dataJson = eleJson.map((ele) => ({
      label: ele.data.label,
      gid: ele.data.id,
      source: ele.data.source,
      target: ele.data.target,
      properties: ele.data.properties,
    }));

    try {
      const json2csvParser = new Parser();
      saveAs(new Blob([`\uFEFF${json2csvParser.parse(dataJson)}`], { type: 'text/csv;charset=utf-8' }), `${reqString.replace(/ /g, '_')}.csv`);
    } catch (err) {
      alert('Unknown Error.');
    }
  };

  const onClick = () => {
    dispatch(cancelCypherQuery(refKey))
      .then((response) => {
        dispatch(removeActiveRequests(refKey));
        console.log('Cancellation confirmed:', response);
      })
      .catch((error) => {
        console.error('Failed to cancel query:', error);
      });
  };
  
  return (
    <>
      <Frame
        bodyNoPadding
        onSearch={() => setFilterModalVisible(true)}
        onThick={() => setThicknessModalVisible(true)}
        thicnessMenu={
          (
            <EdgeThicknessMenu
              onSubmit={(thicness) => {
                setGlobalThickness(thicness);
              }}
              properties={edgeProperties}
            />
          )
        }
        onSearchCancel={() => setGlobalFilter(null)}
        onRefresh={refreshFrame}
        onDownload={(type) => {
          if (type === 'csv') {
            downloadCsv();
          } else if (type === 'json') {
            downloadJson();
          } else if (type === 'png') {
            downloadPng();
          }
        }}
        reqString={reqString}
        isPinned={isPinned}
        refKey={refKey}
        isTable={isTable}
      >
        {
          queryComplete?.complete
            ? (
              <div className="d-flex h-100">
                <div style={{ height: '100%', width: '100%' }} id={`${refKey}-graph`} className="selected-frame-tab">
                  <CypherResultCytoscapeContainer
                    key={cytoscapeContainerKey}
                    ref={chartAreaRef}
                    refKey={refKey}
                    setChartLegend={setChartLegend}
                    onAddSubmit={(filters) => {
                      setAddFilter(filters);
                    }}
                    onRemoveSubmit={(filters) => {
                      setRemoveFilter(filters);
                    }}
                    setIsTable={setIsTable}
                  />
                </div>
                <div style={{ height: '100%', width: '100%' }} id={`${refKey}-table`} className="deselected-frame-tab">
                  <CypherResultTableContainer
                    refKey={refKey}
                    filterTable={filterTable}
                    setIsTable={setIsTable}
                  />
                </div>
              </div>
            )
            : (
              <div style={{ alignContent: 'center' }}>
                <div 
                  style={{ 
                    marginRight: '45%', padding: '20px', background: '#fff', float: 'right',
                  }} 
                  id={`${refKey}-loading`}
                >
                  <Spinner animation="border" />
                  {/* <Button
                    onClick={() => onClick()}
                    danger
                    type="primary" 
                    icon={<StopOutlined />} 
                    style={{ 
                      position: 'absolute', right: '40px', top: '22px', display: 
                      'flex', alignItems: 'center',
                    }} 
                  >
                    取消
                  </Button> */}
                </div>
              </div>
            )
        }
      </Frame>
      <GraphFilterModal
        onSubmit={(filters) => {
          setGlobalFilter(filters);
        }}
        visible={filterModalVisible}
        setVisible={setFilterModalVisible}
        properties={filterProperties}
        globalFilter={globalFilter}
        isTable={isTable}
      />
    </>

  );
};

CypherResultFrame.propTypes = {
  queryComplete: PropTypes.shape(
    {
      complete: PropTypes.bool.isRequired,
    },
  ).isRequired,
  refKey: PropTypes.string.isRequired,
  isPinned: PropTypes.bool.isRequired,
  reqString: PropTypes.string.isRequired,
};

export default CypherResultFrame;
