import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
 
const schema = defineSchema({
  ...authTables,
  workspaces: defineTable({
    name: v.string(),
    userId: v.id("users"),
    joinCode: v.string(),
  }),
  members: defineTable({
    userId: v.id("users"),
    workspacesId: v.id("workspaces"),
    role: v.union(v.literal("admin"), v.literal("member")),
  })
    .index("by_user_id", ["userId"])
    .index("by_workspace_id", ["workspacesId"])
    .index("by_workspace_id_user_id", ["workspacesId", "userId"]),
  channels: defineTable({
    name: v.string(),
    workspacesId: v.id("workspaces"),
  })
    .index("by_workspace_id", ["workspacesId"]),
  conversations: defineTable({
    workspacesId: v.id("workspaces"),
    memberOneId: v.id("members"),
    memberTwoId: v.id("members"),
  })
    .index("by_workspace_id", ["workspacesId"]),
  messages: defineTable({
    body: v.string(),
    image: v.optional(v.id("_storage")),
    memberId: v.id("members"),
    workspacesId: v.id("workspaces"),
    channelsId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationsId: v.optional(v.id("conversations")),
    updatedAt:  v.optional(v.number()),
  })
    .index("by_workspace_id", ["workspacesId"])
    .index("by_member_id", ["memberId"])
    .index("by_channe_id", ["channelsId"])
    .index("by_conversation_id", ["conversationsId"])
    .index("by_parent_message_id", ["parentMessageId"])
    .index("by_channe_id_parent_message_id_conversation_id", ["channelsId","parentMessageId", "conversationsId"]),
  reactions: defineTable({
    workspacesId: v.id("workspaces"),
    messagesId: v.id("messages"),
    membersId: v.id("members"),
    value: v.string(),
  })
  .index("by_workspace_id", ["workspacesId"])
  .index("by_messages_id", ["messagesId"])
  .index("by_members_id", ["membersId"])
});
 
export default schema;