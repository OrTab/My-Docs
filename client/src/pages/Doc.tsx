
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { useEffect, useState } from 'react';
import { useCallback } from 'react'
import { socketService } from '../services/socketService';
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

    const [quill, setQuill] = useState({} as Quill)


    useEffect(() => {
        if (!Object.keys(quill).length) return
        const emitChange = (delta: any, oldDelta: any, source: string) => {
            if (source !== 'user') return
            socketService.emit('quill-changed', delta)
        }
        quill.on('text-change', emitChange);

        const updateQuill = (delta: any) => {
            quill.updateContents(delta)
        }
        socketService.setup()
        socketService.on('update-quill', updateQuill)
        return () => {
            quill.off('text-change', emitChange)
            socketService.off('update-quill', updateQuill)
        }
    }, [quill])

    const quillContainerRef = useCallback(quillContainer => {
        if (!quillContainer) return
        quillContainer.innerHTML = ''
        const editor = document.createElement('div')
        quillContainer.appendChild(editor)
        const quillInstance = new Quill(editor,
            {
                theme: 'snow',
                modules: {
                    toolbar: toolbarOptions
                }
            })
        setQuill(quillInstance)
    }, [])

    return (
        <div className="quill-container" ref={quillContainerRef}>
        </div>
    )
}

