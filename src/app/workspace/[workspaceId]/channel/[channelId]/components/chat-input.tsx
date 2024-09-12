"use client"

import { useCreateMessage } from '@/features/messages/api/use-create-message';
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url';
import { useChannelId } from '@/hooks/use-channel-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
// import { Editor } from "@/components/editor";
import dynamic from 'next/dynamic';
import Quill from "quill";
import { FC, useRef, useState } from "react";
import { toast } from 'sonner';
import { Id } from '../../../../../../../convex/_generated/dataModel';

interface CreateMessageValues {
  channelsId: Id<"channels">,
  workspacesId: Id<"workspaces">,
  body: string,
  image: Id<"_storage"> | undefined,
}

interface HandleSubmitProps {
  body: string,
  image: File | null,
}

interface ChatInputProps {
  placeholder: string,
}

const Editor = dynamic(() => import('@/components/editor').then(mod => mod.Editor), { ssr: false });

const ChatInput: FC<ChatInputProps> = (props) => {
  const { placeholder } = props;
  const editorRef = useRef<Quill | null>(null);
  const workspacesId = useWorkspaceId();
  const channelsId = useChannelId();
  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const [editorKey, setEditorKey] = useState<number>(0);
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleSubmit = async ({body, image}: HandleSubmitProps) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);

      const values: CreateMessageValues = {
        channelsId,
        workspacesId,
        body,
        image: undefined
      }

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) throw new Error("Url not found");

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });
        if (!result.ok) throw new Error("Failed to upload image");

        const { storageId } = await result.json();

        values.image = storageId;
      }

      await createMessage(values, {throwError: true});
  
      setEditorKey(prev => prev + 1);
    } catch (error){
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  }

  if (typeof window === 'undefined') return null;

  editorRef.current?.focus();

  return (
    <div
      className="px-5 w-full"
    >
      <Editor
        key={editorKey}
        placeholder={placeholder}
        disabled={isPending}
        innerRef={editorRef}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export { ChatInput }