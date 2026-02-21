import type { Prisma } from "../generated/prisma/client"

export const database = db as {
    bookmark: {
        findMany: (options: Prisma.BookmarkFindManyArgs) => Promise<Prisma.BookmarkModel[]>,
        create: (options: Prisma.BookmarkCreateArgs) => Promise<Prisma.BookmarkModel>,
        delete: (options: Prisma.BookmarkDeleteArgs) => Promise<Prisma.BookmarkModel>
    }
}