import Quill from 'quill';
import { useEffect, useState } from 'react';

export default function QuillComponent() {
  const [quill, setQuill] = useState({})

  const imageHandler = (quill) => {
    const tooltip = quill.theme.tooltip;
    const originalSave = tooltip.save;
    const originalHide = tooltip.hide;
  
    tooltip.save = function () {
      const range = quill.getSelection(true);
      const value = this.textbox.value;
      if (value) {
        quill.insertEmbed(range.index, 'image', value, 'user');
      }
    };
    // Called on hide and save.
    tooltip.hide = function () {
      tooltip.save = originalSave;
      tooltip.hide = originalHide;
      tooltip.hide();
    };
    tooltip.edit('image');
    tooltip.textbox.placeholder = 'Embed URL';
  }
  
  const modules = {
    toolbar: {
      container: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { indent: '-1' },
          { indent: '+1' },
          { direction: 'rtl'},
        ],
        ['link', 'image', 'video'],
        ['clean'],
      ],
      // handlers: {
      //   image: () => imageHandler()
      // },
    },
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  }
  
  useEffect(() => {
    const quill = new Quill('#editor', {
      modules: modules,
      theme: 'snow'
    });
    var toolbar = quill.getModule('toolbar');
    toolbar.addHandler('image', () => imageHandler(quill));
    quill.formats = [
      "header",
      "font",
      "size",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
      "image",
      "video",
      "color",
    ];
    setQuill(quill)
  }, [])

  const sendContent = (quill) => {
    const delta = quill.getContents()
    console.log(delta)
  }

  return (
    <>
      <div id="toolbar"></div>
      <div id="editor"></div>
      <button onClick={() => sendContent(quill)}>Send</button>
    </>
  )
}
