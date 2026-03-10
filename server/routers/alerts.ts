import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getActiveAlerts, getAlertsByLevel } from "../db";

export const alertsRouter = router({
  // Get all active alerts
  getActive: publicProcedure.query(async () => {
    return getActiveAlerts();
  }),

  // Get alerts by level
  getByLevel: publicProcedure
    .input(z.object({ level: z.enum(["low", "medium", "high", "critical"]) }))
    .query(async ({ input }) => {
      return getAlertsByLevel(input.level);
    }),

  // Get alerts in a region (by coordinates)
  getByRegion: publicProcedure
    .input(z.object({
      latitude: z.number(),
      longitude: z.number(),
      radiusKm: z.number().default(5),
    }))
    .query(async ({ input }) => {
      // TODO: Implement geospatial query
      return [];
    }),

  // Resolve an alert (admin/responder only)
  resolve: protectedProcedure
    .input(z.object({
      alertId: z.number(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!["admin", "responder"].includes(ctx.user?.role || "")) {
        throw new Error("Unauthorized");
      }
      // TODO: Implement database update
      return { success: true, message: "Alert resolved" };
    }),

  // Create alert manually (admin/responder only)
  create: protectedProcedure
    .input(z.object({
      alertLevel: z.enum(["low", "medium", "high", "critical"]),
      description: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!["admin", "responder"].includes(ctx.user?.role || "")) {
        throw new Error("Unauthorized");
      }
      // TODO: Implement database insert
      return { success: true, message: "Alert created" };
    }),
});
