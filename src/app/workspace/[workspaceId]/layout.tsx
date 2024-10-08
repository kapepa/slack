"use client"

import { FC, ReactNode } from "react";
import { Toolbar } from "../components/toolbar";
import { Sidebar } from "../components/sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { WorkspaceSidebar } from "../components/workspace-sidebar";
import { usePanel } from "@/hooks/use-panel";
import { Loader } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Thread } from "@/features/messages/components/thread";
import { Profile } from "@/features/members/components/profile";

interface WorkspaceLayoutProps {
  children: ReactNode
}

const WorkspaceIdLayout: FC<WorkspaceLayoutProps> = (props) => {
  const { children } = props;
  const { parentMessageId, profileMemberId, onClose } = usePanel();

  const showPanel = !!parentMessageId || !!profileMemberId;

  return (
    <div
      className="h-full"
    >
      <Toolbar/>
      <div
        className="flex h-[calc(100vh-40px)]"
      >
        <Sidebar/>
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="workspace-layout"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5E2C5F]"
          >
            <WorkspaceSidebar/>
          </ResizablePanel>
          <ResizableHandle
            withHandle
          />
          <ResizablePanel
            minSize={20}
          >
            { children }
          </ResizablePanel>
          {
            showPanel && (
              <>
                <ResizableHandle
                  withHandle
                />
                <ResizablePanel
                  maxSize={20}
                  defaultSize={80}
                >
                  {
                    parentMessageId 
                    ? (
                      <Thread
                        messageId={parentMessageId as Id<"messages">}
                        onClose={onClose}
                      />
                    )
                    : profileMemberId 
                      ? (
                        <Profile
                          memberId={profileMemberId as Id<"members">}
                          onClose={onClose}
                        />
                      ) 
                      :(
                        <div
                          className="flex h-full items-center justify-center"
                        >
                          <Loader
                            className="size-5 animate-spin text-muted-foreground"
                          />
                        </div>
                      )
                  }
                </ResizablePanel>
              </>
            )
          }
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default WorkspaceIdLayout;