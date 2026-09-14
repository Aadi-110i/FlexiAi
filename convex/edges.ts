import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getEdges = query({
  args: { canvasId: v.id("canvases") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("edges")
      .withIndex("by_canvas", (q) => q.eq("canvasId", args.canvasId))
      .collect();
  },
});

export const createEdge = mutation({
  args: {
    canvasId: v.id("canvases"),
    sourceNodeId: v.id("nodes"),
    targetNodeId: v.id("nodes"),
    label: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("edges", {
      canvasId: args.canvasId,
      sourceNodeId: args.sourceNodeId,
      targetNodeId: args.targetNodeId,
      label: args.label,
    });
  },
});
