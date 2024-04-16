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
// import { Routes, Route, useLocation } from 'react-router-dom';
import DefaultTemplate from '../../components/template/DefaultTemplate';
// import Group from '../../components/template/presentations/Group';
// import Connct from '../../components/template/presentations/Connct';
// import Upload from '../../components/initializer/presentation/GraphInitializer';

const MainPage = () => <DefaultTemplate />;
// const MainPage = () => {
//   const [showUpload, setShowUpload] = useState(false);
//   const location = useLocation();

//   // 监听路由变化，更新 showUpload 状态
//   useEffect(() => {
//     setShowUpload(location.pathname.includes('/upload'));
//   }, [location]);

//   return (
//     <DefaultTemplate>
//       <Upload show={showUpload} setShow={setShowUpload} />
//       <Routes>
//         <Route path="editor" element={<Group />} />
//         <Route path="contents" element={<Connct />} />
//         <Route path="upload" element={null} />
//       </Routes>
//     </DefaultTemplate>
//   );
// };

export default MainPage;
