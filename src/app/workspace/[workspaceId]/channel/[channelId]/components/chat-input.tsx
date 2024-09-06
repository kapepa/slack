"use client"

// import { Editor } from "@/components/editor";
import dynamic from 'next/dynamic';
import Quill from 'quill';
import { FC, useRef } from "react";


interface ChatInputProps {
  placeholder: string,
}

const Editor = dynamic(() => import('@/components/editor').then(mod => mod.Editor), { ssr: false });

const ChatInput: FC<ChatInputProps> = (props) => {
  const { placeholder } = props;
  const editorRef = useRef<Quill | null>(null);

  if (typeof window === 'undefined') return null;

  editorRef.current?.focus();

  return (
    <div
      className="px-5 w-full"
    >
      <Editor
        placeholder={placeholder}
        disabled={false}
        innerRef={editorRef}
      />
    </div>
  )
}

export { ChatInput }