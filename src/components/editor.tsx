"use client"

import { FC, forwardRef, MutableRefObject, useEffect, useLayoutEffect, useRef, useState} from "react";
import Quill from "quill";
import 'quill/dist/quill.snow.css';
import { Button } from "./ui/button";
import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";
import { ImageIcon, Keyboard, Smile } from "lucide-react";
import { Hint } from "./hint";
import { Delta, Op } from "quill/core";
import { cn } from "@/lib/utils";
import { EmojiPopover } from "./emoji-popover";

type EditorValue = {
  image: File | null;
  body: string,
}

interface EditorProps {
  variant?: "create" | "update";
  onSubmit: (props: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
}

const Editor: FC<EditorProps> = forwardRef((props) => {
  const { variant = "create", onCancel, innerRef, onSubmit, defaultValue = [], disabled = false, placeholder = "Write something..." } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quilrRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);

  const [text, setText] = useState<string>('');
  const [isToolbarVisible, setIsToolbarVisible] = useState<boolean>(true);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(container.ownerDocument.createElement("div"));

    const quill = new Quill(editorContainer, {
      theme: 'snow',
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{list: "ordered"}, {list: "bullet"}],
        ],
        keyboard: {
          binding: {
            enter: {
              key: "Enter",
              handler: () => {
                return 
              }
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              }
            }
          }
        }
      }
    });

    quilrRef.current = quill;
    quilrRef.current.focus();

    if (innerRef) innerRef.current = quill;

    quill.setContents(defaultValueRef.current);
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    })

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) container.innerHTML = "";
      if (quilrRef) quilrRef.current = null;
      if (innerRef) innerRef.current = null;
    }
  }, []);

  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  const toogleToolbar = () => {
    setIsToolbarVisible((current) => !current);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

    if (toolbarElement) toolbarElement.classList.toggle("hidden");
  };

  const onEmojiSelect = (emoji: any) => {
    const quill = quilrRef.current;

    quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
  }

  return (
    <div
      className="flex flex-col"
    >
      <div
        className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-200 focus-within:shadow-sm transition bg-white"
      >
        <div
          ref={containerRef}
          className="h-full ql-custom"
        />
        <div
          className="flex px-2 pb-2 pt-2 z-[5]"
        >
          <Hint
            label={isToolbarVisible ? "Hide formatting" : "Show formating"}
          >
            <Button
              disabled={disabled}
              size="iconSm"
              variant="ghost"
              onClick={toogleToolbar}
            >
              <PiTextAa
                className="size-4"
              />
            </Button>
          </Hint>
          <EmojiPopover
            onEmojiSelect={onEmojiSelect}
          >
            <Button
              disabled={disabled}
              size="iconSm"
              variant="ghost"
            >
              <Smile
                className="size-4"
              />
            </Button>
          </EmojiPopover>
          {
            variant === "create"
            && (
              <Hint
                label="Image"
              >
                <Button
                  disabled={disabled}
                  size="iconSm"
                  variant="ghost"
                  onClick={() => {}}
                >
                  <ImageIcon
                    className="size-4"
                  />
                </Button>
              </Hint>
            )
          }
          {
            variant === "update"
            && (
              <div
                className="ml-auto flex items-center gap-x-2"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {}}
                  disabled={disabled}
                >
                  Cnacel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {}}
                  className="ml-auto bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                  disabled={disabled || isEmpty}
                >
                  Save
                </Button>
              </div>
            )
          }
          {
            variant === "create"
            && (
              <Button
                disabled={disabled || isEmpty}
                size="iconSm"
                className={cn(
                  "ml-auto",
                  isEmpty 
                    ? " bg-white hover:bg-white text-muted-foreground"
                    : " bg-[#007a5a] hover:bg-[#007a5a]/80 text-w",
                )}
                onClick={() => {}}
              >
                <MdSend/>
              </Button>
            )
          }
        </div>
      </div>
      {
        variant === "create"
        && (
          <div
            className={cn(
              "p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",
              !isEmpty && "opacity-100",
            )}
          >
            <p>
              <strong>
                Shift + Return
              </strong>
              to add a new line
            </p>
          </div>
        )
      }

    </div>
  )
});

export { Editor };