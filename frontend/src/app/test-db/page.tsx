import React from "react";
import { createSupabaseServerClient } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Database, Server } from "lucide-react";

export const dynamic = "force-dynamic";

async function testDatabaseConnection() {
  try {
    const supabase = await createSupabaseServerClient();

    const startTime = Date.now();
    // Verify we can access the public users table
    const { error, status } = await supabase
      .from("users")
      .select("id")
      .limit(1);

    const latency = Date.now() - startTime;

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: "Supabase connection successful!",
      details: {
        database: "Supabase Postgres",
        version: `HTTP Status: ${status}`,
        tableCount: `${latency}ms (Latency)`,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Supabase connection failed!",
      error: error.message || "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
}

export default async function TestDbPage() {
  const result = await testDatabaseConnection();

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <div className="glass-card card-shadow w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur">
        {/* Header */}
        <div className="border-b border-white/[0.06] px-6 py-8 text-center">
          <div className="mb-4 flex justify-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full ring-1 ${
                result.success
                  ? "bg-emerald-500/10 ring-emerald-500/20"
                  : "bg-red-500/10 ring-red-500/20"
              }`}
            >
              <Database
                className={`h-8 w-8 ${
                  result.success ? "text-emerald-400" : "text-red-400"
                }`}
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Supabase Connection Test
          </h1>
        </div>

        <div className="space-y-6 p-6">
          {/* Status */}
          <div className="flex items-center justify-center gap-3">
            {result.success ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                <span className="text-lg font-semibold text-emerald-400">
                  {result.message}
                </span>
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-400" />
                <span className="text-lg font-semibold text-red-400">
                  {result.message}
                </span>
              </>
            )}
          </div>

          {/* Details */}
          {result.success && result.details ? (
            <div className="space-y-3 border-t border-white/[0.06] pt-4">
              <h3 className="flex items-center gap-2 font-semibold text-white">
                <Server className="h-4 w-4 text-muted-foreground" />
                Connection Details
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-4">
                  <p className="mb-1 text-xs text-muted-foreground">
                    Database Name
                  </p>
                  <p className="font-mono text-sm font-semibold text-foreground">
                    {result.details.database}
                  </p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-4">
                  <p className="mb-1 text-xs text-muted-foreground">Version</p>
                  <p className="font-mono text-sm font-semibold text-foreground">
                    {result.details.version}
                  </p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-4">
                  <p className="mb-1 text-xs text-muted-foreground">
                    Ping Response
                  </p>
                  <p className="font-mono text-sm font-semibold text-foreground">
                    {result.details.tableCount}
                  </p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-4">
                  <p className="mb-1 text-xs text-muted-foreground">
                    Test Timestamp
                  </p>
                  <p className="font-mono text-xs text-foreground">
                    {new Date(result.details.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 border-t border-white/[0.06] pt-4">
              <h3 className="font-semibold text-red-400">Error Details</h3>
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                <p className="break-all font-mono text-sm text-red-200">
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
          <div className="border-t border-white/[0.06] pt-4">
            <h3 className="mb-3 text-sm font-semibold text-white">Environment</h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="border-white/[0.08] bg-white/[0.04] text-muted-foreground"
              >
                Node: {process.version}
              </Badge>
              <Badge
                variant="outline"
                className="border-white/[0.08] bg-white/[0.04] text-muted-foreground"
              >
                ENV: {process.env.NODE_ENV || "development"}
              </Badge>
              <Badge
                variant="outline"
                className="border-white/[0.08] bg-white/[0.04] text-muted-foreground"
              >
                Supabase URL:{" "}
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Set" : "✗ Not Set"}
              </Badge>
            </div>
          </div>

          {/* Warning */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
            <p className="text-xs text-amber-200">
              ⚠️ <strong>Security Note:</strong> Remove or protect this page in
              production to prevent exposing database status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
