import React from "react";
import { db } from "@/config/db";
import { sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Database, Server } from "lucide-react";

export const dynamic = "force-dynamic";

async function testDatabaseConnection() {
  try {
    // Test basic connection
    const result = await db.execute(sql`SELECT 1 as test`);

    // Get database info
    const dbName = await db.execute(sql`SELECT DATABASE() as db_name`);
    const version = await db.execute(sql`SELECT VERSION() as version`);

    // Count tables
    const tables = await db.execute(
      sql`SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = DATABASE()`,
    );

    return {
      success: true,
      message: "Database connection successful!",
      details: {
        database: (dbName[0] as any)?.db_name || "Unknown",
        version: (version[0] as any)?.version || "Unknown",
        tableCount: (tables[0] as any)?.table_count || 0,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Database connection failed!",
      error: error.message || "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
}

export default async function TestDbPage() {
  const result = await testDatabaseConnection();

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <Card className="w-full max-w-2xl border-2">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div
              className={`h-16 w-16 rounded-full flex items-center justify-center ${
                result.success
                  ? "bg-green-100 dark:bg-green-950"
                  : "bg-red-100 dark:bg-red-950"
              }`}
            >
              <Database
                className={`h-8 w-8 ${
                  result.success ? "text-green-600" : "text-red-600"
                }`}
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Database Connection Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-center gap-3">
            {result.success ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <span className="text-lg font-semibold text-green-600">
                  {result.message}
                </span>
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-600" />
                <span className="text-lg font-semibold text-red-600">
                  {result.message}
                </span>
              </>
            )}
          </div>

          {/* Details */}
          {result.success && result.details ? (
            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-semibold flex items-center gap-2">
                <Server className="h-4 w-4" />
                Connection Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">
                    Database Name
                  </p>
                  <p className="font-mono text-sm font-semibold">
                    {result.details.database}
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Version</p>
                  <p className="font-mono text-sm font-semibold">
                    {result.details.version}
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">
                    Total Tables
                  </p>
                  <p className="font-mono text-sm font-semibold">
                    {result.details.tableCount}
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">
                    Test Timestamp
                  </p>
                  <p className="font-mono text-xs">
                    {new Date(result.details.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-semibold text-red-600">Error Details</h3>
              <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-900">
                <p className="font-mono text-sm break-all">
                  {result.error || "Unknown error occurred"}
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                Tested at:{" "}
                {new Date(
                  result.timestamp || new Date().toISOString(),
                ).toLocaleString()}
              </div>
            </div>
          )}

          {/* Environment Info */}
          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-3 text-sm">Environment</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Node: {process.version}</Badge>
              <Badge variant="outline">
                ENV: {process.env.NODE_ENV || "development"}
              </Badge>
              <Badge variant="outline">
                DB URL: {process.env.DATABASE_URL ? "✓ Set" : "✗ Not Set"}
              </Badge>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              ⚠️ <strong>Security Note:</strong> Remove or protect this page in
              production to prevent exposing database information.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
