import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getMonitoringPoints, getMonitoringPointById, getActiveAlerts, getAlertsByLevel, getInspectionsByMonitoringPoint } from "../db";

export const monitoringRouter = router({
  // Get all monitoring points
  getPoints: publicProcedure.query(async () => {
    return getMonitoringPoints();
  }),

  // Get specific monitoring point
  getPoint: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getMonitoringPointById(input.id);
    }),

  // Get active alerts
  getActiveAlerts: publicProcedure.query(async () => {
    return getActiveAlerts();
  }),

  // Get alerts by level
  getAlertsByLevel: publicProcedure
    .input(z.object({ level: z.enum(["low", "medium", "high", "critical"]) }))
    .query(async ({ input }) => {
      return getAlertsByLevel(input.level);
    }),

  // Get inspections for a monitoring point
  getInspections: publicProcedure
    .input(z.object({ monitoringPointId: z.number() }))
    .query(async ({ input }) => {
      return getInspectionsByMonitoringPoint(input.monitoringPointId);
    }),

  // Create monitoring point (admin only)
  createPoint: protectedProcedure
    .input(z.object({
      name: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      type: z.enum(["sewer", "drain", "river_section", "flood_zone"]),
      riskLevel: z.enum(["low", "medium", "high", "critical"]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }
      // TODO: Implement database insert
      return { success: true, message: "Monitoring point created" };
    }),
});
