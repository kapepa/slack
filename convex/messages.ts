import { v } from "convex/values";
import { mutation, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";

const getMember = async (ctx: QueryCtx, workspacesId: Id<"workspaces">, userId: Id<"users">) => {
  return ctx.db
  .query("members")
  .withIndex("by_workspace_id_user_id", (q) => 
    q.eq("workspacesId", workspacesId).eq("userId", userId),
  )
  .unique();
};

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspacesId: v.id("workspaces"),
    channelsId: v.id("channels"),
    parentMessageId: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const member = await getMember(ctx, args.workspacesId, userId);
    if (!member) throw new Error("Unauthorized");

    const messagesId = await ctx.db.insert("messages", {
      memberId: member._id,
      body: args.body,
      image: args.image,
      channelsId: args.channelsId,
      workspacesId: args.workspacesId,
      parentMessageId: args.parentMessageId,
      updatedAt: Date.now(),
    });

    return messagesId;
  }
})