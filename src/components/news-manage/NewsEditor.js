import React, { useState,useEffect } from 'react'
import { Editor } from "react-draft-wysiwyg"
import { EditorState } from 'draft-js'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs'
import { convertToRaw,ContentState } from 'draft-js'
function myBlockRenderer(contentBlock) {
    const type = contentBlock.getType()

    // Convert image type to mediaComponent
    if (type === 'atomic') {
        return {
            component: MediaComponent,
            editable: false,
            props: {
                foo: 'bar'
            }
        }
    }
}

class MediaComponent extends React.Component {
    render() {
        const { block, contentState } = this.props
        //   const { foo } = this.props.blockProps;
        const data = contentState.getEntity(block.getEntityAt(0)).getData()


        const emptyHtml = ' '
        return (
            <div>
                {emptyHtml}
                <img
                    src={data.src}
                    alt={data.alt || ''}
                    style={{ height: data.height || 'auto', width: data.width || 'auto' }}
                />
            </div>
        )
    }
}
export default function NewsEditor(props) {
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const onEditorStateChange = (editorState) => {
        setEditorState(editorState)
    }
    useEffect(()=>{
        if(props.content===undefined){
          return 
        }// htmlToDraft 不接受undefined
        
        //普通html==>editorState 对象
        const contentBlock = htmlToDraft(props.content);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
           
            // 同步状态
            setEditorState(editorState)
        }
      },[props.content])
    return (
        <Editor
            editorState={editorState}
            blockRendererFn={myBlockRenderer}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={onEditorStateChange}
            onBlur={() => {
                console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
            }}
        />
    )
}
