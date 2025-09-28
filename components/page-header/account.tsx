import { headers } from "next/headers"
import Link from "next/link"

import { auth } from "@/lib/auth"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Divider } from "@/components/ui/separator"

import { SignOut } from "../sign-out"
import { Button } from "../ui/button"

export async function Account() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return (
      <Button asChild variant="secondary">
        <Link href="/sign-in">Sign In</Link>
      </Button>
    )
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Account</NavigationMenuTrigger>
          <NavigationMenuContent className="p-1">
            <div className="flex flex-col gap-0.5 p-2">
              <p className="text-muted-foreground text-xs">Signed in as</p>
              <p className="text-sm font-semibold">{session.user.name}</p>
              <p className="text-muted-foreground text-sm">
                {session.user.email}
              </p>
            </div>
            <Divider />
            <ul className="flex w-full flex-col py-1">
              {/*<li>
                <Link
                  href="/user"
                  className="group hover:bg-offgray-100/50 dark:hover:bg-offgray-500/10 inline-flex h-8 w-full items-center justify-start gap-2 rounded-sm border border-transparent px-1 text-sm tracking-tight text-nowrap transition-colors duration-75 select-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <UsersIcon className="text-primary size-4" />
                  My Account
                </Link>
              </li>*/}
              <li>
                <SignOut />
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
