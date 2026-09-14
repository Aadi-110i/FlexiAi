import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCanvases = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("canvases")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getCanvas = query({
  args: { id: v.id("canvases") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createCanvas = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("canvases", {
      userId: args.userId,
      title: args.title,
      createdAt: now,
      updatedAt: now,
    });
  },
});
