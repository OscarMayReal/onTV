-- CreateTable
CREATE TABLE "Bookmark" (
    "bookmarkId" TEXT NOT NULL PRIMARY KEY,
    "programId" TEXT NOT NULL,
    "availabilityStart" DATETIME NOT NULL,
    "availabilityEnd" DATETIME NOT NULL,
    "imageUrl" TEXT,
    "mainTitle" TEXT NOT NULL,
    "secondaryTitle" TEXT,
    "eventUUID" TEXT,
    "originalEventLocator" TEXT,
    "onDemand" JSONB NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_bookmarkId_key" ON "Bookmark"("bookmarkId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_programId_key" ON "Bookmark"("programId");
