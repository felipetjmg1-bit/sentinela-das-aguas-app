import { decimal, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "analyst", "responder"]).default("user").notNull(),
  organization: varchar("organization", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Monitoring Points (Bueiros, Drenagens, Seções de Rio)
export const monitoringPoints = mysqlTable("monitoring_points", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  type: mysqlEnum("type", ["sewer", "drain", "river_section", "flood_zone"]).notNull(),
  riskLevel: mysqlEnum("risk_level", ["low", "medium", "high", "critical"]).default("low").notNull(),
  status: mysqlEnum("status", ["operational", "maintenance", "blocked", "flooded"]).default("operational").notNull(),
  lastInspection: timestamp("last_inspection"),
  inspectionNotes: text("inspection_notes"),
  createdBy: int("created_by").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MonitoringPoint = typeof monitoringPoints.$inferSelect;
export type InsertMonitoringPoint = typeof monitoringPoints.$inferInsert;

// Inspections (Histórico de Inspeções)
export const inspections = mysqlTable("inspections", {
  id: int("id").autoincrement().primaryKey(),
  monitoringPointId: int("monitoring_point_id").notNull(),
  inspectorId: int("inspector_id").notNull(),
  inspectionDate: timestamp("inspection_date").notNull(),
  photos: json("photos").$type<string[]>(),
  findings: text("findings"),
  maintenanceRequired: boolean("maintenance_required").default(false),
  status: varchar("status", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Inspection = typeof inspections.$inferSelect;
export type InsertInspection = typeof inspections.$inferInsert;

// Alerts (Sistema de Alertas)
export const alerts = mysqlTable("alerts", {
  id: int("id").autoincrement().primaryKey(),
  monitoringPointId: int("monitoring_point_id"),
  alertLevel: mysqlEnum("alert_level", ["low", "medium", "high", "critical"]).notNull(),
  description: text("description"),
  detectedBy: mysqlEnum("detected_by", ["ai_analysis", "manual_report", "sensor"]).notNull(),
  aiConfidence: decimal("ai_confidence", { precision: 3, scale: 2 }),
  imageUrl: varchar("image_url", { length: 500 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  isActive: boolean("is_active").default(true),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: int("resolved_by"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = typeof alerts.$inferInsert;

// AI Analysis Results
export const aiAnalysisResults = mysqlTable("ai_analysis_results", {
  id: int("id").autoincrement().primaryKey(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  analysisTimestamp: timestamp("analysis_timestamp").notNull(),
  detectedPatterns: json("detected_patterns").$type<Record<string, number>>(),
  confidenceScores: json("confidence_scores").$type<Record<string, number>>(),
  generatedAlertId: int("generated_alert_id"),
  batchJobId: varchar("batch_job_id", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AIAnalysisResult = typeof aiAnalysisResults.$inferSelect;
export type InsertAIAnalysisResult = typeof aiAnalysisResults.$inferInsert;

// Alert Notifications
export const alertNotifications = mysqlTable("alert_notifications", {
  id: int("id").autoincrement().primaryKey(),
  alertId: int("alert_id").notNull(),
  recipientId: int("recipient_id").notNull(),
  notificationType: mysqlEnum("notification_type", ["email", "push", "sms"]).notNull(),
  status: mysqlEnum("status", ["pending", "sent", "failed"]).default("pending"),
  sentAt: timestamp("sent_at"),
  errorMessage: text("error_message"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AlertNotification = typeof alertNotifications.$inferSelect;
export type InsertAlertNotification = typeof alertNotifications.$inferInsert;

// Reports (Relatórios Técnicos)
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  reportType: mysqlEnum("report_type", ["daily", "weekly", "monthly", "incident"]).notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  totalAlerts: int("total_alerts").default(0),
  criticalAlerts: int("critical_alerts").default(0),
  affectedAreas: json("affected_areas").$type<string[]>(),
  responseTimeAvg: int("response_time_avg"),
  generatedBy: int("generated_by"),
  pdfUrl: varchar("pdf_url", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

// Heatmap Data (Dados para Mapas de Calor)
export const heatmapData = mysqlTable("heatmap_data", {
  id: int("id").autoincrement().primaryKey(),
  region: varchar("region", { length: 255 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  riskScore: decimal("risk_score", { precision: 3, scale: 2 }).notNull(),
  incidentCount30d: int("incident_count_30d").default(0),
  lastUpdated: timestamp("last_updated").defaultNow().onUpdateNow(),
});

export type HeatmapData = typeof heatmapData.$inferSelect;
export type InsertHeatmapData = typeof heatmapData.$inferInsert;
