import { EditorData, Block } from "@/components/organisms/UMLEditor/types"


export interface ColumnEditorProps {
  editorData: EditorData
  blocks: { [key: string]: Block }
}

export interface TableEditorProps {
  editorData: EditorData
  blocks: { [key: string]: Block }
}