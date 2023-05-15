/*
  Warnings:

  - You are about to drop the `FbxModels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FbxModels";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "FbxModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "folder" TEXT NOT NULL
);
