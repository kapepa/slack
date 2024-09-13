import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, QueryCtx } from "./_generated/server";
import { auth } from "./auth";

const getMember = async (ctx: QueryCtx, workspacesId: Id<"workspaces">, userId: Id<"users">) => {
  return ctx.db
  .query("members")
  .withIndex("by_workspace_id_user_id", (q) => 
    q.eq("workspacesId", workspacesId).eq("userId", userId),
  )
  .unique();
};

export const toggle = mutation({
  args: {
    messagesId: v.id("messages"),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
  
    const message = await ctx.db.get(args.messagesId);
    if (!message) throw new Error("Message not found");
  
    const member = await getMember(ctx, message.workspacesId, userId);
    if (!member) throw new Error("Unauthorized");

    const existingMessageReactionFromUser = await ctx.db
    .query("reactions")
    .filter(q => 
      q.and(
        q.eq(q.field("messagesId"), args.messagesId),
        q.eq(q.field("membersId"), member?._id),
        q.eq(q.field("value"), args.value),
      )
    )
    .first();

    if (existingMessageReactionFromUser) {
      await ctx.db.delete(existingMessageReactionFromUser._id);

      return existingMessageReactionFromUser._id
    } else {
      const newReactionId = await ctx.db.insert("reactions", {
        value: args.value,
        membersId: member._id,
        messagesId: message._id,
        workspacesId: message.workspacesId,
      });

      return newReactionId;
    }

  }
})