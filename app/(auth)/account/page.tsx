import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { getUserById } from "@/lib/actions/users"
import { auth } from "@/lib/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Diamond } from "@/components/ui/diamond"
import { Hero, HeroDescription, SmallHeroHeading } from "@/components/ui/hero"

import { UserForm } from "./_components/user-form"

export default async function Account() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect("/")

  const user = await getUserById(session?.user.id)

  return (
    <>
      <Hero>
        <SmallHeroHeading>My Account</SmallHeroHeading>
        <HeroDescription>Manage your film account</HeroDescription>
      </Hero>
      <div className="sm:px-4 md:px-8">
        <section className="container-wrapper border-grid relative isolate flex w-full flex-col items-center gap-8 p-4 sm:border-x sm:p-8 lg:pb-16">
          <div className="flex w-full max-w-2xl justify-start">
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarImage src={user.image ?? ""} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold">{user.name}</p>
                <p className="text-sm">{user.email}</p>
              </div>
            </div>
          </div>
          <UserForm user={user} />
          <Diamond top left />
          <Diamond top right />
        </section>
      </div>
    </>
  )
}
