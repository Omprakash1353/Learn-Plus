"use client";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "color"],
    [{ "code-block": true }],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "indent",
  "code-block",
  "color",
];

export default function Editor({
  placeholder = "Write something...",
  value = "",
  disabled = false,
  onChange,
}: {
  placeholder: string;
  value: string;
  disabled?: boolean;
  onChange: (...event: any[]) => void;
}) {
  return (
    <>
      <ReactQuill
        className="rounded-md border h-auto max-h-[500px] overflow-y-auto"
        theme="snow"
        placeholder={placeholder}
        value={value}
        readOnly={disabled}
        onChange={onChange}
        modules={modules}
        formats={formats}
        style={{ height: "auto", maxHeight: "500px" }}
      />
    </>
  );
}
