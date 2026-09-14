import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),

  canvases: defineTable({
    userId: v.id("users"),
    title: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  nodes: defineTable({
    canvasId: v.id("canvases"),
    title: v.string(),
    x: v.number(),
    y: v.number(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    systemPrompt: v.optional(v.string()),
    model: v.optional(v.string()),
    temperature: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_canvas", ["canvasId"]),

  edges: defineTable({
    canvasId: v.id("canvases"),
    sourceNodeId: v.id("nodes"),
    targetNodeId: v.id("nodes"),
    label: v.optional(v.string()),
  }).index("by_canvas", ["canvasId"]),

  messages: defineTable({
    nodeId: v.id("nodes"),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.string(),
    createdAt: v.number(),
    parentMessageId: v.optional(v.id("messages")),
  }).index("by_node", ["nodeId"]),

  branches: defineTable({
    fromNodeId: v.id("nodes"),
    fromMessageId: v.id("messages"),
    toNodeId: v.id("nodes"),
    createdAt: v.number(),
  }),
});
