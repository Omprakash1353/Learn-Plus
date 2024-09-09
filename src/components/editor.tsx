"use client";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "color", "image"],
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
  "image",
  "code-block",
  "color",
];

export default function Editor({
  placeholder = "Write something...",
  value = "",
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (...event: any[]) => void;
}) {
  return (
    <>
      <ReactQuill
        className="rounded-md border"
        theme="snow"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
      />
    </>
  );
}
