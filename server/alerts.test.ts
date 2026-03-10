import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("alerts router", () => {
  it("should get active alerts", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.alerts.getActive();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should filter alerts by level", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.alerts.getByLevel({ level: "critical" });
    expect(Array.isArray(result)).toBe(true);
  });

  it("should get alerts by region", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.alerts.getByRegion({
      latitude: -19.8,
      longitude: -43.9,
      radiusKm: 5,
    });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("monitoring router", () => {
  it("should get all monitoring points", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.monitoring.getPoints();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should get specific monitoring point", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.monitoring.getPoint({ id: 1 });
    expect(result === undefined || typeof result === "object").toBe(true);
  });

  it("should get inspections for a monitoring point", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.monitoring.getInspections({ monitoringPointId: 1 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("ai analysis router", () => {
  it("should analyze image (admin only)", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.aiAnalysis.analyzeImage({
      imageUrl: "https://example.com/image.jpg",
      monitoringPointId: 1,
    });

    expect(result.success).toBe(true);
    expect(result.patterns).toBeDefined();
    expect(result.confidenceScores).toBeDefined();
  });

  it("should batch analyze images (admin only)", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.aiAnalysis.analyzeBatch({
      imageUrls: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
      ],
      region: "centro",
    });

    expect(result.success).toBe(true);
    expect(result.batchJobId).toBeDefined();
  });

  it("should get analysis results", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.aiAnalysis.getResults({
      limit: 50,
    });

    expect(Array.isArray(result)).toBe(true);
  });

  it("should generate heatmap (admin only)", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.aiAnalysis.generateHeatmap({
      region: "centro",
      period: "7d",
    });

    expect(result.points).toBeDefined();
    expect(result.maxRiskScore).toBeDefined();
  });
});

describe("notifications router", () => {
  it("should send email notification (admin only)", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.notifications.sendEmail({
      recipientEmail: "user@example.com",
      alertId: 1,
      alertLevel: "critical",
      description: "Enchente detectada",
      latitude: -19.8,
      longitude: -43.9,
      location: "Centro",
    });

    expect(result.success).toBe(true);
    expect(result.emailTemplate).toBeDefined();
  });

  it("should subscribe to alerts", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.notifications.subscribe({
      email: "user@example.com",
      region: "centro",
      alertLevels: ["critical", "high"],
    });

    expect(result.success).toBe(true);
  });

  it("should unsubscribe from alerts", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.notifications.unsubscribe({
      email: "user@example.com",
    });

    expect(result.success).toBe(true);
  });
});

describe("reports router", () => {
  it("should generate daily report (admin only)", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reports.generateDaily({});

    expect(result.success).toBe(true);
    expect(result.reportId).toBeDefined();
    expect(result.pdfUrl).toBeDefined();
  });

  it("should get statistics (admin only)", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reports.getStatistics({
      period: "30d",
    });

    expect(result.totalAlerts).toBeDefined();
    expect(result.criticalAlerts).toBeDefined();
    expect(result.effectivenessRate).toBeDefined();
  });

  it("should get heatmap data (admin only)", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reports.getHeatmapData({
      region: "centro",
      period: "7d",
    });

    expect(result.points).toBeDefined();
    expect(result.maxRiskScore).toBeDefined();
  });
});
