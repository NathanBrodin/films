"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AppIcon from "@/components/app-icon"

export default function SignUpPage() {
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      // Validate password confirmation before submitting
      if (value.password !== value.confirmPassword) {
        toast.error("Passwords do not match")
        return
      }

      try {
        const { data, error } = await authClient.signUp.email({
          name: value.name,
          email: value.email,
          password: value.password,
          callbackURL: "/",
        })

        if (error) {
          // Handle different error types from better-auth
          if (error.status === 400) {
            // Bad request - validation errors
            toast.error(error.message || "Please check your information")
          } else if (error.status === 409) {
            // User already exists
            toast.error("An account with this email already exists")
          } else if (error.status === 429) {
            // Rate limited
            toast.error("Too many attempts. Please try again later")
          } else {
            // Other server errors
            toast.error(error.message || "Sign up failed")
          }
          return
        }

        if (data) {
          toast.success("Account created successfully!")
          router.push("/")
        }
      } catch (err) {
        console.error("Sign in error:", err)
        toast.error("Network error. Please try again.")
      }
    },
  })

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card className="flex flex-col gap-6 p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <a
                  href="#"
                  className="flex flex-col items-center gap-2 font-medium"
                >
                  <div className="flex size-8 items-center justify-center rounded-md">
                    <AppIcon className="size-6" />
                  </div>
                  <span className="sr-only">Films</span>
                </a>
                <h1 className="text-xl font-bold">
                  Welcome to Nathan&apos;s Films
                </h1>
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

              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <form.Field
                    name="name"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value || value.trim().length === 0) {
                          return "Name is required"
                        }
                        if (value.trim().length < 2) {
                          return "Name must be at least 2 characters"
                        }
                        return undefined
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <Label htmlFor={field.name}>Name</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          placeholder="John Doe"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {!field.state.meta.isValid &&
                        field.state.meta.errors.length > 0 ? (
                          <p className="text-destructive text-xs" role="alert">
                            {String(field.state.meta.errors[0])}
                          </p>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div className="grid gap-2">
                  <form.Field
                    name="email"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) {
                          return "Email is required"
                        }
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        if (!emailRegex.test(value)) {
                          return "Please enter a valid email address"
                        }
                        return undefined
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <Label htmlFor={field.name}>Email</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          placeholder="m@example.com"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {!field.state.meta.isValid &&
                        field.state.meta.errors.length > 0 ? (
                          <p className="text-destructive text-xs" role="alert">
                            {String(field.state.meta.errors[0])}
                          </p>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div className="grid gap-2">
                  <form.Field
                    name="password"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value || value.length === 0) {
                          return "Password is required"
                        }
                        if (value.length < 8) {
                          return "Password must be at least 8 characters"
                        }
                        return undefined
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="password"
                          placeholder="********"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {!field.state.meta.isValid &&
                        field.state.meta.errors.length > 0 ? (
                          <p className="text-destructive text-xs" role="alert">
                            {String(field.state.meta.errors[0])}
                          </p>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <div className="grid gap-2">
                  <form.Field
                    name="confirmPassword"
                    validators={{
                      onChange: ({ value, fieldApi }) => {
                        if (!value || value.length === 0) {
                          return "Please confirm your password"
                        }
                        const passwordValue =
                          fieldApi.form.getFieldValue("password")
                        if (value !== passwordValue) {
                          return "Passwords do not match"
                        }
                        return undefined
                      },
                    }}
                  >
                    {(field) => (
                      <>
                        <Label htmlFor="confirmPassword">
                          Confirm Password
                        </Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="password"
                          placeholder="********"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {!field.state.meta.isValid &&
                        field.state.meta.errors.length > 0 ? (
                          <p className="text-destructive text-xs" role="alert">
                            {String(field.state.meta.errors[0])}
                          </p>
                        ) : null}
                      </>
                    )}
                  </form.Field>
                </div>

                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                  {([canSubmit, isSubmitting]) => (
                    <Button type="submit" disabled={!canSubmit || isSubmitting}>
                      {isSubmitting ? "Creating account..." : "Sign Up"}
                    </Button>
                  )}
                </form.Subscribe>
              </div>
            </div>
          </form>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </Card>
      </div>
    </div>
  )
}
