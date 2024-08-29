import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

const generateCode = () => {
  const code = Array.from(
    { length: 6 },
    () => "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)],
  ).join();

  return code;
}

export const create = mutation ({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const joinCode = generateCode();

    const workspacesId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode,
    });

    await ctx.db.insert("members", {
      userId,
      workspacesId,
      role: "admin"
    })

    return workspacesId;
  }
})

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return []
    }

    const memeber = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const workspaceIds = memeber.map((memeber) => memeber.workspacesId);
    const workspaces = [];

    for (const workspacesId of workspaceIds) {
      const workspace = await ctx.db.get(workspacesId);
      if (workspace) workspaces.push(workspace);
    }

    return workspaces;
  }
})

export const getById = query({
  args: { id: v.id("workspaces") },
  async handler(ctx, args) {
    const userId = await auth.getUserId(ctx);

    if (!userId) throw new Error("Unauthorized");

    const memeber = await ctx.db
      .query("members")
      .withIndex(
        "by_workspace_id_user_id", 
        (q) => q.eq("workspacesId", args.id).eq("userId", userId),
      )
      .unique();

    if (!memeber) return null;

    return await ctx.db.get(args.id);
  },
})