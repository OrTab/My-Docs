
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { useCallback } from 'react'
const toolbarOptions = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline'],
    [{ 'font': [] }],
    ['blockquote', 'code-block', 'image'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'direction': 'rtl' }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    ['clean']
];
export const Doc = () => {

    const quillContainerRef = useCallback(quillContainer => {
        if (!quillContainer) return
        quillContainer.innerHTML = ''
        const editor = document.createElement('div')
        quillContainer.appendChild(editor)
        new Quill(editor,
            {
                theme: 'snow',
                modules: {
                    toolbar: toolbarOptions
                }
            })
    }, [])

    return (
        <div className="quill-container" ref={quillContainerRef}>
        </div>
    )
}

