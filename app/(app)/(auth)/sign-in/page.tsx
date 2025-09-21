"use client"

import { useRouter } from "next/navigation"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AppIcon from "@/components/app-icon"

export default function SignInPage() {
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const { data, error } = await authClient.signIn.email({
          email: value.email,
          password: value.password,
          callbackURL: "/admin",
        })

        if (error) {
          // Handle different error types from better-auth
          if (error.status === 401) {
            // Invalid credentials
            toast.error("Invalid email or password")
          } else if (error.status === 403) {
            // Email not verified or account locked
            if (error.message?.includes("verify")) {
              toast.error("Please verify your email address")
            } else {
              toast.error(error.message || "Account access denied")
            }
          } else if (error.status === 429) {
            // Rate limited
            toast.error("Too many attempts. Please try again later")
          } else {
            // Other server errors
            toast.error(error.message || "Sign in failed")
          }
          return
        }

        if (data) {
          toast.success("Signed in successfully!")
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
                  <span className="sr-only">Bookmarks</span>
                </a>
                <h1 className="text-xl font-bold">
                  Welcome to Nathan&apos;s Bookmarks
                </h1>
              </div>

              <div className="flex flex-col gap-4">
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

                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                  {([canSubmit, isSubmitting]) => (
                    <Button type="submit" disabled={!canSubmit || isSubmitting}>
                      {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>
                  )}
                </form.Subscribe>
              </div>
            </div>
          </form>
          <div className="text-muted-foreground text-center text-xs text-balance">
            Only Nathan can sign in, because he is better than you. Sorry...
          </div>
        </Card>
      </div>
    </div>
  )
}
