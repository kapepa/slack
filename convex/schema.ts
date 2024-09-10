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
  messages: defineTable({
    body: v.string(),
    image: v.optional(v.id("_storage")),
    memberId: v.id("members"),
    workspacesId: v.id("workspaces"),
    channelsId: v.id("channels"),
    parentMessageId: v.optional(v.id("messages")),
    updatedAt: v.number(),
  })
});
 
export default schema;