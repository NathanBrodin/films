import Link from "next/link"
import { ArrowLeft, FileX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <FileX className="text-muted-foreground h-24 w-24" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Film Not Found</h1>
          <p className="text-muted-foreground text-lg">
            The film you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>

        <Card className="p-6 text-left">
          <h2 className="mb-3 font-semibold">What you can do:</h2>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li>• Check if the URL is spelled correctly</li>
            <li>• Browse all films from the homepage</li>
            <li>• Use the search function to find specific films</li>
          </ul>
        </Card>

        <Button asChild size="lg">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Films
          </Link>
        </Button>
      </div>
    </div>
  )
}
