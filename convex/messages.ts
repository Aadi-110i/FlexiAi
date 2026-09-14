import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getMessages = query({
  args: { nodeId: v.id("nodes") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_node", (q) => q.eq("nodeId", args.nodeId))
      .collect();
  },
});

export const addMessage = mutation({
  args: {
    nodeId: v.id("nodes"),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      nodeId: args.nodeId,
      role: args.role,
      content: args.content,
      createdAt: Date.now(),
    });
  },
});
