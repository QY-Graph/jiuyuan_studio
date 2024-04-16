// GroupedEditorSidebar.jsx
import React from 'react';
import EditorContainer from '../../contents/containers/Editor';
import Sidebar from '../../sidebar/containers/Sidebar';
import Contents from '../../contents/containers/Contents';

const Group = () => (
  <div>
    <EditorContainer />
    <Sidebar />
    <Contents />
  </div>
);

export default Group;
