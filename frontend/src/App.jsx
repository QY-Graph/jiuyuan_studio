/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * 'License'); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import './static/style.css';
import './static/navbar-fixed-left.css';
// import AppHeader from './components/header/AppHeader';
// import MainPage from './pages/Main/MainPage';
import Group from './components/template/presentations/Group';
// import EditorContainer from './components/contents/containers/Editor';
// import Sidebar from './components/sidebar/containers/Sidebar';
import Connct from './components/template/presentations/Connct';
import Upload from './components/initializer2/presentation/GraphInitializer';
// import Upload from '../../initializer/presentation/GraphInitializer';
// import Connct from './components/template/presentations/SimpleContents';
import { getConnectionStatus } from './features/database/DatabaseSlice';
// const App = () => (
//   <React.StrictMode>
//     <MainPage />
//   </React.StrictMode>
// );

// const App = () => {
//   const dispatch = useDispatch();
//   const databaseStatus = useSelector((state) => state.database.status);
//   // const location = useLocation(); // 获取当前的路由位置信息
  
//   useEffect(() => {
//     // 只在状态为'init'时调用检查连接状态
//     if (databaseStatus === 'init') {
//       dispatch(getConnectionStatus());
//     }
//   }, [dispatch, databaseStatus]);

//   // const renderMainRoute = () => {
//   //   if (databaseStatus === 'init') {
//   //     return null;
//   //   }
//   //   if (databaseStatus === 'connected') {
//   //     // 当状态为 'connected' 但用户位于 'connect' 路由时，重定向到 '/editor'
//   //     if (location.pathname === '/connect' || location.pathname === '/editor') {
//   //       return <Navigate replace to='/editor' />;
//   //     } 
//   //     if (location.pathname === '/upload') {
//   //       return <Navigate replace to='/upload' />;
//   //     }
//   //     return null;
//   //   }

//   //   return <Navigate replace to='/connect' />;
//   // };
  
//   return (
//     <React.StrictMode>
//       <Router>
//         <Routes>
//           {/* 根据连接状态重定向到相应页面 */}
//           {/* <Route path='/' element={renderMainRoute()} />
//           <Route path="connect" element={<Connct />} />
//           <Route path="editor" element={<Group />} />
//           <Route path="upload" element={<Upload />} /> */}
//           <Route
//             path="connect"
//             element={databaseStatus === 'connected' ? 
//               <Navigate replace to="/editor" /> : <Connct />}
//           />
//           <Route
//             path="editor"
//             element={databaseStatus === 'connected' ? 
//               <Group /> : <Navigate replace to="/connect" />}
//           />
//           <Route
//             path="upload"
//             element={databaseStatus === 'connected' ? <Upload /> :
//                <Navigate replace to="/connect" />}
//           />
//         </Routes>
//       </Router>
//     </React.StrictMode>
//   );
// };

// export default App;

const App = () => { 
  return (
    <React.StrictMode>
      <Router>
        <AppContent />
      </Router>
    </React.StrictMode>
  );
};

const AppContent = () => {
  const dispatch = useDispatch();
  const databaseStatus = useSelector((state) => state.database.status);

  useEffect(() => {
    // 只在状态为'init'时调用检查连接状态
    if (databaseStatus === 'init') {
      dispatch(getConnectionStatus());
    }
  }, [dispatch, databaseStatus]);

  const renderMainRoute = (targetPath) => {
    console.log(databaseStatus);
    console.log(targetPath);

    if (targetPath === '/connect') {
      // if (databaseStatus !== 'connected') {
      return <Connct />;
      // }
      // return <Navigate replace to='/editor' />;
    }
    if (targetPath === '/editor') {
      // if (databaseStatus === 'connected') {
      return <Group />;
      // }
      // return <Navigate replace to='/connect' />;
    }
    if (targetPath === '/upload') {
      // if (databaseStatus === 'connected') {
      return <Upload />;
      // }
      // return <Navigate replace to='/connect' />;
    }
    return <Navigate replace to='/connect' />;
  };

  return (
    <Routes>
      <Route path='/' element={renderMainRoute()} />
      <Route path="connect" element={renderMainRoute('/connect')} />
      <Route path="editor" element={renderMainRoute('/editor')} />
      <Route path="upload" element={renderMainRoute('/upload')} />
    </Routes>
  );
};

export default App;
