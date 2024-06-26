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

import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import FramesContainer from '../containers/Frames2';
import styles from './Contents.module.scss';
import { resetScrollToTop } from '../../../features/scroll/scrollSlice';

const Contents = ({
  database, isActive, getConnectionStatus, getMetaData, currentGraph,
}) => {
  const dispatch = useDispatch();
  const shouldScrollToTop = useSelector((state) => state.scroll.shouldScrollToTop);
  const scrollRef = useRef();

  useEffect(() => {
    console.log('Component Mounted');
    if (database.status === 'init') {
      dispatch(() => {
        getConnectionStatus().then((response) => {
          if (response.type === 'database/getConnectionStatus/fulfilled') {
            getMetaData({ currentGraph });
            getMetaData();
          }
        });
      });
    }

    if (shouldScrollToTop && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      dispatch(resetScrollToTop());
    }
  }, [shouldScrollToTop, database.status]);

  return (
    <div className={`${styles.Content} ${isActive ? styles.Expanded : ''}`}>
      <div>
        <div className={`${styles.searchResult}`}>
          <div className={`${styles.searchIcon}`} />
          Search Results
        </div>
        <div className={`${styles.frameOut}`} ref={scrollRef}>
          <FramesContainer />
        </div>
      </div>
    </div>
  );
};

Contents.propTypes = {
  database: PropTypes.shape({
    status: PropTypes.string.isRequired,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  getConnectionStatus: PropTypes.func.isRequired,
  getMetaData: PropTypes.func.isRequired,
  currentGraph: PropTypes.string.isRequired,
};

export default Contents;
