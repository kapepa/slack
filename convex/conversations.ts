import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { auth } from "./auth";

export const createOrGet = mutation({
  args: {
    membersId: v.id("members"),
    workspacesId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspacesId", args.workspacesId).eq("userId", userId)
      )
      .unique();

    const otherMembers = await ctx.db.get(args.membersId);
    if (!currentMember || !otherMembers) throw new Error("Member not found");

    const existingConversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("workspacesId"), args.workspacesId))
      .filter((q) => q.or(
        q.and(
          q.eq(q.field("memberOneId"), currentMember._id),
          q.eq(q.field("memberOneId"), otherMembers._id),
        ),
        q.and(
          q.eq(q.field("memberOneId"), otherMembers._id),
          q.eq(q.field("memberOneId"), currentMember._id),
        )
      ))
      .unique();
    if (existingConversation) return existingConversation._id;

    const conversationId = await ctx.db.insert("conversations", {
      workspacesId: args.workspacesId,
      memberOneId: currentMember._id,
      memberTwoId: otherMembers._id
    });

    return conversationId;
  }
})