"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Lock } from "lucide-react";

import {
  updatePasswordSchema,
  UpdatePasswordData,
} from "@/lib/schemaValidation/auth.schema";
import { updatePasswordAction } from "@/lib/action/forgotPassword.action";

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

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<UpdatePasswordData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: UpdatePasswordData) => {
    setServerError(null);
    const result = await updatePasswordAction(data);

    if (result.status === "ERROR") {
      setServerError(result.message);
      return;
    }

    setIsSuccess(true);
  };

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-pink-600 shadow-lg glow-md">
          <KeyRound className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold gradient-text">New Password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a strong password for your account
        </p>
      </div>

      <Card className="glass-strong card-shadow border-0">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-semibold text-center">
            Set New Password
          </CardTitle>
          <CardDescription className="text-center">
            Please enter your new password below.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="space-y-6 text-center py-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Password Updated!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your password has been reset successfully. You can now sign in with your new credentials.
                </p>
              </div>
              <Button
                onClick={() => router.push("/login")}
                className="w-full h-11 bg-gradient-to-r from-violet-600 to-purple-600 font-semibold text-white shadow-lg"
              >
                Go to Sign In
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

                {/* New Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            disabled={isSubmitting}
                            className="pr-10 pl-10"
                            {...field}
                          />
                          <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowPassword((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            disabled={isSubmitting}
                            className="pr-10 pl-10"
                            {...field}
                          />
                          <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowConfirmPassword((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
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
                      Updating Password…
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>
          )}

          {/* Footer Back Link */}
          {!isSuccess && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Remembered your password?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
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
