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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faAngleUp,
  faCompressAlt,
  faExpandAlt,
  faSync,
  faTimes,
  faClone,
} from '@fortawesome/free-solid-svg-icons';
import { Button, Popover, Modal } from 'antd';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import styles from './Frame.module.scss';
import { removeFrame } from '../../features/frame/FrameSlice';
import { setCommand } from '../../features/editor/EditorSlice';
import { removeActiveRequests } from '../../features/cypher/CypherSlice';
import EdgeWeight from '../../icons/EdgeWeight';
import IconFilter from '../../icons/IconFilter';
import IconSearchCancel from '../../icons/IconSearchCancel';

// const { confirm } = Modal;
const Frame = ({
  reqString,
  children,
  refKey,
  onSearch,
  onSearchCancel,
  onRefresh,
  onThick,
  thicnessMenu,
  bodyNoPadding,
  isTable,
}) => {
  const dispatch = useDispatch();
  const [isFullScreen, setFullScreen] = useState(false);
  const [isExpand, setExpand] = useState(true);

  // const downloadMenu = () => (
  //   <Menu onClick={(e) => onDownload(e)}>
  //     <Menu.Item key="png">
  //       Save as PNG
  //     </Menu.Item>
  //     <Menu.Item key="json">
  //       Save as JSON
  //     </Menu.Item>
  //     <Menu.Item key="csv">
  //       Save as CSV
  //     </Menu.Item>
  //   </Menu>
  // );

  const handleRemove = () => {
    Modal.confirm({
      title: 'Are you sure you want to close this window?',
      onOk() {
        dispatch(removeFrame(refKey));
        dispatch(removeActiveRequests(refKey));
      },
      onCancel() {
        // 可以在这里处理取消的逻辑，如果没有需要则留空
      },
      okText: 'Yes',
      cancelText: 'No',
      className: styles.customModalClass, // 如果需要自定义模态框的样式
    });
  };

  return (
    <div className={`${styles.Frame} ${isFullScreen ? styles.FullScreen : ''}`}>
      <div className={styles.FrameHeader}>
        <div className={styles.FrameHeaderText}>
          {'$ '}
          <strong>
            {reqString}
          </strong>
        </div>
        <div>
          <FontAwesomeIcon
            id={styles.toEditor}
            title="copy to editor"
            icon={faClone}
            size="s"
            onClick={() => dispatch(setCommand(reqString))}
            style={{
              cursor: 'pointer', marginLeft: '5px',
            }}
          />
        </div>
        <div className={styles.ButtonArea}>
          {
            !isTable && onRefresh ? (
              <Button
                size="large"
                type="link"
                className={`${styles.FrameButton}`}
                onClick={() => onRefresh()}
                title="Refresh"
              >
                {/* <FontAwesomeIcon
                  icon={faSync}
                  size="lg"
                /> */}
                <svg className={`${styles.iconFrame}`} aria-hidden="true">
                  <use href="#icon-shuaxin3" />
                </svg>
              </Button>
            ) : null
          }
          <Button
            size="large"
            type="link"
            className={`${styles.FrameButton}`}
            onClick={handleRemove}
            //   () => {
            //   if (window.confirm('Are you sure you want to close this window?')) {
            //     dispatch(removeFrame(refKey));
            //     dispatch(removeActiveRequests(refKey));
            //   } else {
            //     // Do nothing!
            //   }
            // }}
            title="Close Window"
          >
            {/* <FontAwesomeIcon icon={faTimes} size="lg" /> */}
            <svg className={`${styles.iconFrame2}`} aria-hidden="true">
              <use href="#icon-guanbi" />
            </svg>
          </Button>
        </div>
      </div>
      <div
        className={`${styles.FrameBody} ${isExpand ? '' : styles.Contract} ${
          bodyNoPadding ? styles.NoPadding : ''
        }`}
      >
        {children}
      </div>
    </div>
  );
};

Frame.defaultProps = {
  onSearch: null,
  onThick: null,
  onSearchCancel: null,
  thicnessMenu: null,
  onRefresh: null,
  bodyNoPadding: false,
};

Frame.propTypes = {
  reqString: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  refKey: PropTypes.string.isRequired,
  onSearch: PropTypes.func,
  onThick: PropTypes.func,
  thicnessMenu: PropTypes.func,
  onSearchCancel: PropTypes.func,
  onRefresh: PropTypes.func,
  bodyNoPadding: PropTypes.bool,
  isTable: PropTypes.bool.isRequired,
};

export default Frame;
