"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeOffIcon, LoaderIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

import { authClient } from "@/lib/auth-client"
import { AnimatedState } from "@/components/ui/animate-state"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import AppIcon from "@/components/app-icon"

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name is required")
      .max(20, "Why is your name so long ?!"),
    email: z.email("Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
        "Password must include uppercase, lowercase, and a number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function SignUpPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isGooglePending, startGoogleTransition] = useTransition()
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState<boolean>(false)

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev)
  const toggleConfirmVisibility = () => setIsConfirmVisible((prev) => !prev)

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  function onSubmit(values: z.infer<typeof signUpSchema>) {
    startTransition(async () => {
      try {
        const { data, error } = await authClient.signUp.email({
          name: values.name,
          email: values.email,
          password: values.password,
          callbackURL: "/",
        })

        if (error) {
          if (error.status === 409) {
            toast.error("An account with this email already exists")
          } else {
            toast.error(error.message || "Sign up failed")
          }
          return
        }

        if (data) {
          toast.success(
            "Account created successfully! Please check your email for verification."
          )
          router.push("/sign-in")
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to sign up"
        toast.error(errorMessage)
      }
    })
  }

  function signUpWithGoogle() {
    startGoogleTransition(async () => {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
      })

      if (error) {
        toast.error(error.message || "Sign up failed")
      }
    })
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <AppIcon className="size-4" />
          </div>
          Films.
        </Link>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Create an account</CardTitle>
              <CardDescription>
                Sign up with Google or with email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid gap-6">
                    <div className="flex flex-col gap-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        type="button"
                        onClick={signUpWithGoogle}
                        disabled={isGooglePending}
                      >
                        <AnimatedState>
                          {isGooglePending ? (
                            <span className="flex items-center gap-2">
                              <LoaderIcon className="size-4 animate-spin" />
                              Signing up...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                  fill="currentColor"
                                />
                              </svg>
                              Sign up with Google
                            </span>
                          )}
                        </AnimatedState>
                      </Button>
                    </div>
                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                      <span className="bg-card text-muted-foreground relative z-10 px-2">
                        Or continue with
                      </span>
                    </div>
                    <div className="grid gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="m@example.com"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nathan" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  className="pe-9"
                                  placeholder="Password"
                                  type={isPasswordVisible ? "text" : "password"}
                                  {...field}
                                />
                                <button
                                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                  type="button"
                                  onClick={togglePasswordVisibility}
                                  aria-label={
                                    isPasswordVisible
                                      ? "Hide password"
                                      : "Show password"
                                  }
                                  aria-pressed={isPasswordVisible}
                                  aria-controls="password"
                                >
                                  {isPasswordVisible ? (
                                    <EyeOffIcon
                                      className="size-4"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <EyeIcon
                                      className="size-4"
                                      aria-hidden="true"
                                    />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  className="pe-9"
                                  placeholder="Confirm password"
                                  type={isConfirmVisible ? "text" : "password"}
                                  {...field}
                                />
                                <button
                                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                  type="button"
                                  onClick={toggleConfirmVisibility}
                                  aria-label={
                                    isConfirmVisible
                                      ? "Hide password"
                                      : "Show password"
                                  }
                                  aria-pressed={isConfirmVisible}
                                  aria-controls="confirmPassword"
                                >
                                  {isConfirmVisible ? (
                                    <EyeOffIcon
                                      className="size-4"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <EyeIcon
                                      className="size-4"
                                      aria-hidden="true"
                                    />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                      >
                        <AnimatedState>
                          {isPending ? "Creating account..." : "Create account"}
                        </AnimatedState>
                      </Button>
                    </div>
                    <div className="text-center text-sm">
                      Already have an account?{" "}
                      <Link
                        href="/sign-in"
                        className="underline underline-offset-4"
                      >
                        Sign in
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking create account, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  )
}
