-- CreateTable
CREATE TABLE "Bookmark" (
    "bookmarkId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "availabilityStart" TIMESTAMP(3) NOT NULL,
    "availabilityEnd" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "mainTitle" TEXT NOT NULL,
    "secondaryTitle" TEXT,
    "eventUUID" TEXT,
    "originalEventLocator" TEXT,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("bookmarkId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_bookmarkId_key" ON "Bookmark"("bookmarkId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_programId_key" ON "Bookmark"("programId");
