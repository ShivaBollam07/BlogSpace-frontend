import React, { useContext, useState } from 'react';
import { UserContext } from '../App';
import { Navigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import PublishForm from '../components/publish-form.component';
import BlogEditor from '../components/blog-editor.component';
import { createContext } from 'react';

const blogStructure = {
  title: '',
  banner: '',
  content: [],
  tags: [],  // Ensure tags is initialized as an empty array
  description: '',
  author: { personal_info: {} },
};

export const EditorContext = createContext({});

const Editor = () => {
  const [blog, setBlog] = useState(blogStructure);
  const [tags, setTags] = useState([]); // State for storing tags

  const [editorState, setEditorState] = useState('editor');
  const [textEditor, setTextEditor] = useState({ isReady: false });

  const { userAuth } = useContext(UserContext);
  const access_token = userAuth?.access_token;

  return (
    <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor, tags, setTags }}>
      {access_token === null ? (
        <Navigate to="/signin" />
      ) : editorState === 'editor' ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
