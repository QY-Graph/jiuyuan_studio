import React, { useState, useRef } from 'react';
import {
  /* Form, */ Col, Button, ListGroup, Spinner, Alert,
} from 'react-bootstrap';
import { DeleteTwoTone, PlusOutlined } from '@ant-design/icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import uuid from 'react-uuid';
// import PropTypes from 'prop-types';
import './GraphInit.scss';
import {
  Divider, Checkbox, Input, message, Layout,
} from 'antd';
import { useDispatch } from 'react-redux';
import { addAlert } from '../../../features/alert/AlertSlice';
import { changeGraph, getConnectionStatus } from '../../../features/database/DatabaseSlice';
import { changeCurrentGraph, getMetaData } from '../../../features/database/MetadataSlice';
import AppHeader2 from '../../header/AppHeader2';

const InitGraphModal = () => {
  // const [show, setShow] = useState(true);
  const [nodeFiles, setNodeFiles] = useState({});
  const [edgeFiles, setEdgeFiles] = useState({});
  const [graphName, setGraphName] = useState('');
  const [dropGraph, setDropGraph] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const edgeInputRef = useRef();
  const nodeInputRef = useRef();
  const dispatch = useDispatch();

  const { 
    Header, Footer, Sider, Content,
  } = Layout;

  const clearState = () => {
    setNodeFiles({});
    setEdgeFiles({});
    setGraphName('');
    setDropGraph(false);
    setLoading(false);
    setError('');
  };
  const handleSelectNodeFiles = (e) => {
    Array.from(e.target.files).forEach((file) => {
      const key = uuid();
      nodeFiles[key] = {
        data: file,
        name: '',
      };
    });
    setNodeFiles({ ...nodeFiles });
    nodeInputRef.current.value = '';
  };

  const handleSelectEdgeFiles = (e) => {
    Array.from(e.target.files).forEach((file) => {
      const key = uuid();
      edgeFiles[key] = {
        data: file,
        name: '',
      };
    });
    setEdgeFiles({ ...edgeFiles });
    edgeInputRef.current.value = '';
  };

  const removeNodeFile = (k) => {
    delete nodeFiles[k];
    setNodeFiles({ ...nodeFiles });
  };

  const removeEdgeFile = (k) => {
    delete edgeFiles[k];
    setEdgeFiles({ ...edgeFiles });
  };
  const setName = (name, key, type) => {
    if (type === 'node') {
      const fileProps = nodeFiles[key];
      fileProps.name = name;
    }
    if (type === 'edge') {
      const fileProps = edgeFiles[key];
      fileProps.name = name;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const sendFiles = new FormData();

    Object.entries(nodeFiles).forEach(([, node]) => sendFiles.append('nodes', node.data, node.name));
    Object.entries(edgeFiles).forEach(([, edge]) => sendFiles.append('edges', edge.data, edge.name));
    sendFiles.append('graphName', graphName);
    sendFiles.append('dropGraph', dropGraph);
    const reqData = {
      method: 'POST',
      body: sendFiles,
      mode: 'cors',

    };
    fetch('/api/v1/cypher/init', reqData)
      .then(async (res) => {
        setLoading(false);

        if (res.status !== 204) {
          const resData = await res.json();
          throw resData;
        } else {
          // setShow(false);
          message.success('Upload successful, please go to the Search tab to use it!');
          dispatch(addAlert('CreateGraphSuccess'));
          dispatch(getMetaData()).then(() => {
            dispatch(changeCurrentGraph({ name: graphName }));
            dispatch(changeGraph({ graphName }));
          });
          clearState();
        }
      })
      .catch((err) => {
        console.log('error', err);
        message.error('Upload failed, please check the parameters and try again.');
        setLoading(false);
        setError(err);
      });
  };

  const modalInputBody = () => (
    <>
      <div className="graphOuter">
        <div className='graphTitle'>
          <div className='blockItem' />
          Create a Graph
        </div>
        <div className="graphInputCol">
          <div id="graphInputRow">
            <Input
              id="graphNameInput"
              className='InputOner'
              type="text"
              placeholder="graph name"
              defaultValue={graphName}
              value={graphName}
              onChange={(e) => setGraphName(e.target.value)}
              required
            />
          </div>
          <div id="graphInputRow2">
            <Checkbox
              onChange={(e) => setDropGraph(e.target.checked)}
              defaultChecked={dropGraph}
              checked={dropGraph}
            >
              <div className='checkbox-text'>DROP graph if exists</div>
            </Checkbox>
          </div>
        </div>
      </div>
      <div className="uploadOuter">
        <div className="modalRow">
          {/* <div className="modalRow"> */}
          <div className='listOut'>
            <ListGroup className="readyFiles">
              {
                Object.entries(nodeFiles).map(([k, { data: file, name }]) => (
                  <ListGroup.Item key={k} className='listItem'>
                    <div className="modalRowInner">
                      <img src="/resources/images/menu/csv.png" alt="Description" className='csvfile' />
                      <div className='fileName'>{file.name}</div>
                      <div className="inputOut">
                        <Input
                          id="graphNameInput"
                          placeholder="Node Name"
                          data-key={k}
                          defaultValue={name}
                          onChange={(e) => {
                            setName(e.target.value, k, 'node');
                          }}
                          required
                        />
                      </div>
                      <DeleteTwoTone id="removeFile" data-id={k} className="largeIcon" twoToneColor="#eb2f96" onClick={() => removeNodeFile(k)} />
                    </div>
                  </ListGroup.Item>
                ))
            }
            </ListGroup>
          </div>
          <div className="BtnOuter">
            <Button onClick={() => nodeInputRef.current.click()} className="uploadBtn">
              ADD NODE TABLES
              <PlusOutlined className='add-icon' />
              <input type="file" ref={nodeInputRef} onChange={handleSelectNodeFiles} accept=".csv" multiple hidden />
            </Button>
          </div>
        </div>
        <div className="modalRow2">
          <div className='listOut'>
            <ListGroup className="readyFiles">
              {
                Object.entries(edgeFiles).map(([k, { data: file, name }]) => (
                  <ListGroup.Item key={k} className='listItem'>
                    <div className="modalRowInner">
                      <img src="/resources/images/menu/csv.png" alt="Description" className='csvfile' />
                      <div className='fileName'>{file.name}</div>
                      <div className="inputOut">
                        <Input
                          id="graphNameInput"
                          data-key={k}
                          onChange={(e) => {
                            setName(e.target.value, k, 'edge');
                          }}
                          placeholder="Edge Name"
                          defaultValue={name}
                          required
                        />
                      </div>
                      <DeleteTwoTone id="removeFile" data-id={k} className="largeIcon" twoToneColor="#eb2f96" onClick={() => removeEdgeFile(k)} />
                    </div>
                  </ListGroup.Item>
                ))
            }
            </ListGroup>
          </div>
          <div className="BtnOuter">
            <Button onClick={() => edgeInputRef.current.click()} className="uploadBtn">
              ADD EDGE TABLES
              <PlusOutlined className='add-icon' />
              <input type="file" ref={edgeInputRef} onChange={handleSelectEdgeFiles} accept=".csv" multiple hidden />
            </Button>
          </div>
        </div>
      </div>
      <div className="clearOuter">
        <Button id="clearButton" onClick={clearState}>
          Clear
        </Button>
        <Button id="doneButton" onClick={handleSubmit}>
          Done
          <img src="/resources/images/menu/right.png" alt="Description" className='rightPng' />
        </Button>
      </div>
      {/* <Divider /> */}
    </>
  );

  const modalBody = () => {
    if (loading) return <Spinner animation="border" />;
    if (error !== '') {
      return (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          <Alert.Heading>
            An error occured
          </Alert.Heading>
          <p>
            {`Error Code: ${error.code}`}
          </p>
          <p>
            {`Error Details: ${error.details}`}
          </p>
        </Alert>
      );
    }
    return modalInputBody();
  };

  return (
    <div>
      <div className="ModalContainer2">
        <Layout>
          <Header className='edit-header'>
            <AppHeader2 />
          </Header>
          <Content>
            <div className="headerOuter">
              <div id="headerRow">
                <div className="title">Upload</div>
              </div>

              <div className="modalCol">
                {modalBody()}
              </div>
            </div>
          </Content>
        </Layout>
      </div>
    </div>

  );
};

// InitGraphModal.propTypes = {
//   show: PropTypes.bool.isRequired,
//   setShow: PropTypes.func.isRequired,
// };

export default InitGraphModal;
