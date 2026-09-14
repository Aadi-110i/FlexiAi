import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getNodes = query({
  args: { canvasId: v.id("canvases") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("nodes")
      .withIndex("by_canvas", (q) => q.eq("canvasId", args.canvasId))
      .collect();
  },
});

export const createNode = mutation({
  args: {
    canvasId: v.id("canvases"),
    title: v.string(),
    x: v.number(),
    y: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("nodes", {
      canvasId: args.canvasId,
      title: args.title,
      x: args.x,
      y: args.y,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateNodePosition = mutation({
  args: {
    id: v.id("nodes"),
    x: v.number(),
    y: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      x: args.x,
      y: args.y,
      updatedAt: Date.now(),
    });
  },
});
