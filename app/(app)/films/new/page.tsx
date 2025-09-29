import { headers } from "next/headers"
import Link from "next/link"

import { auth } from "@/lib/auth"
import { Lines } from "@/components/ui/backgrounds"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

import { FilmForm } from "./_components/film-form"

export default async function NewFilm() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user.id) {
    return (
      <div className="flex h-full items-center justify-center text-center">
        <Card>
          <CardContent>
            <h3>Only authenticated users can add a film</h3>
            <CardFooter className="mt-4 items-center justify-center gap-2">
              <Button asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/">Go back home</Link>
              </Button>
            </CardFooter>
          </CardContent>
        </Card>
        <Lines className="text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row">
      <FilmForm />
    </div>
  )
}
