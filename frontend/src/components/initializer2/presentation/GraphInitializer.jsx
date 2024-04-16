import React, { useState, useRef } from 'react';
import {
  /* Form, */ Col, Button, ListGroup, Spinner, Alert,
} from 'react-bootstrap';
import { DeleteTwoTone } from '@ant-design/icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import uuid from 'react-uuid';
// import PropTypes from 'prop-types';
import './GraphInit.scss';
import { Divider, Checkbox, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { addAlert } from '../../../features/alert/AlertSlice';
import { changeGraph } from '../../../features/database/DatabaseSlice';
import { changeCurrentGraph, getMetaData } from '../../../features/database/MetadataSlice';

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
          dispatch(addAlert('CreateGraphSuccess'));
          dispatch(getMetaData()).then(() => {
            dispatch(changeCurrentGraph({ name: graphName }));
            dispatch(changeGraph({ graphName }));
          });
        }
      })
      .catch((err) => {
        console.log('error', err);
        setLoading(false);
        setError(err);
      });
  };

  const modalInputBody = () => (
    <>
      <div className="graphOuter">
        <div className="graphInputCol">
          <div id="graphInputRow">
            <Input
              id="graphNameInput"
              type="text"
              placeholder="graph name"
              defaultValue={graphName}
              value={graphName}
              onChange={(e) => setGraphName(e.target.value)}
              required
            />
          </div>
          <div id="graphInputRow">
            <Checkbox
              onChange={(e) => setDropGraph(e.target.checked)}
              defaultChecked={dropGraph}
              checked={dropGraph}
            >
              DROP graph if exists
            </Checkbox>
          </div>
        </div>
        <div className="clearOuter">
          <Button id="clearButton" onClick={clearState}>
            Clear
          </Button>
          <Button id="doneButton" onClick={handleSubmit}>
            Done
          </Button>
        </div>
      </div>
      <Divider />
      <div className="uploadOuter">
        <div className="modalRow">
          <div className="BtnOuter">
            <div className="tableTitle">
              Node Tables
            </div>
            <Button onClick={() => nodeInputRef.current.click()} className="uploadBtn">
              Add
              <input type="file" ref={nodeInputRef} onChange={handleSelectNodeFiles} accept=".csv" multiple hidden />
            </Button>
          </div>
          <Divider style={{ margin: '10px 0 12px 0' }} />
          {/* <div className="modalRow"> */}
          <div>
            <ListGroup className="readyFiles">
              {
                Object.entries(nodeFiles).map(([k, { data: file, name }]) => (
                  <ListGroup.Item key={k}>
                    <div className="modalRowInner">
                      <Input
                        id="graphNameInput"
                        placeholder="label name"
                        data-key={k}
                        defaultValue={name}
                        onChange={(e) => {
                          setName(e.target.value, k, 'node');
                        }}
                        required
                      />
                    </div>
                    <div className="modalRowInner">
                      <div>{file.name}</div>
                      {/* <FontAwesomeIcon
                        id="removeFile"
                        data-id={k}
                        onClick={() => removeNodeFile(k)}
                        icon={faMinusCircle}
                      /> */}
                      <DeleteTwoTone id="removeFile" data-id={k} className="largeIcon" twoToneColor="#eb2f96" onClick={() => removeNodeFile(k)} />
                    </div>
                  </ListGroup.Item>
                ))
            }
            </ListGroup>
          </div>
          {/* </div> */}
        </div>
        <div className="modalRow2">
          <div className="BtnOuter">
            <div className="tableTitle">
              Edge Tables
            </div>
            <Button onClick={() => edgeInputRef.current.click()} className="uploadBtn">
              Add
              <input type="file" ref={edgeInputRef} onChange={handleSelectEdgeFiles} accept=".csv" multiple hidden />
            </Button>
          </div>
          {/* <div className="modalRow"> */}
          <Col>
            <ListGroup className="readyFiles">
              {
                Object.entries(edgeFiles).map(([k, { data: file, name }]) => (
                  <ListGroup.Item key={k}>
                    <div className="modalRowInner">
                      <Input
                        id="graphNameInput"
                        data-key={k}
                        onChange={(e) => {
                          setName(e.target.value, k, 'edge');
                        }}
                        placeholder="edge name"
                        defaultValue={name}
                        required
                      />
                    </div>
                    <div className="modalRowInner">
                      <div>{file.name}</div>
                      {/* <FontAwesomeIcon
                        id="removeFile"
                        data-id={k}
                        onClick={() => removeEdgeFile(k)}
                        icon={faMinusCircle}
                      /> */}
                      <DeleteTwoTone id="removeFile" data-id={k} className="largeIcon" twoToneColor="#eb2f96" onClick={() => removeEdgeFile(k)} />
                    </div>
                  </ListGroup.Item>
                ))
            }
            </ListGroup>
          </Col>
          {/* </div> */}
        </div>
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
      <div className="ModalContainer">
        <div className="headerOuter">
          <div id="headerRow">
            <div className="title">Create a Graph</div>
          </div>
          <Divider />
          <div className="modalCol">
            {modalBody()}
          </div>
        </div>
      </div>
    </div>

  );
};

// InitGraphModal.propTypes = {
//   show: PropTypes.bool.isRequired,
//   setShow: PropTypes.func.isRequired,
// };

export default InitGraphModal;
