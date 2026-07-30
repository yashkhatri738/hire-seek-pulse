"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, KeyRound, Loader2, Mail, Sparkles } from "lucide-react";

import {
  forgotPasswordSchema,
  ForgotPasswordData,
} from "@/lib/schemaValidation/auth.schema";
import { requestPasswordResetAction } from "@/lib/action/forgotPassword.action";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: ForgotPasswordData) => {
    setServerError(null);
    setSuccessMessage(null);

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const result = await requestPasswordResetAction(data, origin);

    if (result.status === "ERROR") {
      setServerError(result.message);
      return;
    }

    setSuccessMessage(result.message);
  };

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-pink-600 shadow-lg glow-md">
          <KeyRound className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold gradient-text">Reset Password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your email to receive recovery instructions
        </p>
      </div>

      <Card className="glass-strong card-shadow border-0">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-semibold text-center">
            Forgot Password?
          </CardTitle>
          <CardDescription className="text-center">
            No worries! Enter your registered email below and we will send you a reset link.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {successMessage ? (
            <div className="space-y-6 text-center py-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Check your email
                </h3>
                <p className="text-sm text-muted-foreground">
                  {successMessage}
                </p>
              </div>
              <Button
                asChild
                className="w-full h-11 bg-gradient-to-r from-violet-600 to-purple-600 font-semibold text-white shadow-lg"
              >
                <Link href="/login">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Server Error */}
                {serverError && (
                  <div className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center">
                    {serverError}
                  </div>
                )}

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            disabled={isSubmitting}
                            className="pl-10"
                            {...field}
                          />
                          <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="mt-2 h-11 w-full border-0 bg-gradient-to-r from-violet-600 to-purple-600 font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-500/50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending reset link…
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            </Form>
          )}

          {/* Footer Back Link */}
          {!successMessage && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Remembered your password?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center"
              >
                Sign in
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
