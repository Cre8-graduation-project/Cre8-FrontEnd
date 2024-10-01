import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Button } from "@mui/material";

import PageContent from "../components/Common/PageContent";
import LoginTest from "../components/Test/LoginTest";
import { EditorMenuBar, editorExtensions } from "../components/Common/Editor";

export default function TestPage() {
  const [count, setCount] = useState(0);

  function cilckHandler() {
    setCount(count + 1);
  }

  return (
    <PageContent title="Test Page">
      <h3>Counter</h3>
      <button onClick={cilckHandler}>Counter - {count}</button>
      <h3>Editor Test Section</h3>
      <TestEditor />
      <LoginTest />
    </PageContent>
  );
}

export const TestEditor = () => {
  const editor = useEditor({
    extensions: editorExtensions,
    content: "Hello!",
  });

  return (
    <>
      <div style={{ border: "1px solid gray" }}>
        <EditorMenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
      <Button
        type="button"
        href={`data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(editor.getJSON().content)
        )}`}
        download="filename.json"
        variant="contained"
      >
        Export JSON Data
      </Button>
    </>
    
  );
};

