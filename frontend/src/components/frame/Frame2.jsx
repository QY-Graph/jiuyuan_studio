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
import { Button, Popover } from 'antd';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import styles from './Frame2.module.scss';
import { removeFrame } from '../../features/frame/FrameSlice';
import { setCommand } from '../../features/editor/EditorSlice';
import { removeActiveRequests } from '../../features/cypher/CypherSlice';
import EdgeWeight from '../../icons/EdgeWeight';
import IconFilter from '../../icons/IconFilter';
import IconSearchCancel from '../../icons/IconSearchCancel';

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
  const [isFullScreen, setFullScreen] = useState(true);
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

  return (
    <div className={`${styles.Frame} ${isFullScreen ? styles.FullScreen : ''}`}>
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
