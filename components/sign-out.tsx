"use client"

import { useRouter } from "next/navigation"
import { LogOutIcon } from "lucide-react"

import { authClient } from "@/lib/auth-client"

export function SignOut() {
  const router = useRouter()

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
        },
      },
    })
  }

  return (
    <button
      onClick={signOut}
      className="hover:bg-accent inline-flex h-8 w-full cursor-pointer items-center justify-start gap-2 rounded-sm border border-transparent px-1 text-sm tracking-tight text-nowrap transition-colors duration-75 select-none disabled:cursor-not-allowed disabled:opacity-50"
    >
      <LogOutIcon className="text-primary size-4" />
      Sign Out
    </button>
  )
}
