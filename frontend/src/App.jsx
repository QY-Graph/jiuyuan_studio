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

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import './static/style.css';
import './static/navbar-fixed-left.css';
import AppHeader from './components/header/AppHeader';
import MainPage from './pages/Main/MainPage';
import Group from './components/template/presentations/Group';
// import EditorContainer from './components/contents/containers/Editor';
// import Sidebar from './components/sidebar/containers/Sidebar';
import Connct from './components/template/presentations/Connct';
import Upload from './components/initializer2/presentation/GraphInitializer';
// import Upload from '../../initializer/presentation/GraphInitializer';
// import Connct from './components/template/presentations/SimpleContents';

// const App = () => (
//   <React.StrictMode>
//     <MainPage />
//   </React.StrictMode>
// );
const App = () => (
  <React.StrictMode>
    <Router>
      <AppHeader />
      {/* <MainPage /> */}
      <Routes>
        <Route path="/" element={<MainPage />}>
          <Route path="editor" element={<Group />} />
          <Route path="contents" element={<Connct />} />
          <Route path="upload" element={<Upload />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);

export default App;
