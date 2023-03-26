/*
  Warnings:

  - You are about to drop the column `path` on the `FbxModel` table. All the data in the column will be lost.
  - Added the required column `folder` to the `FbxModel` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FbxModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "folder" TEXT NOT NULL
);
INSERT INTO "new_FbxModel" ("id", "name") SELECT "id", "name" FROM "FbxModel";
DROP TABLE "FbxModel";
ALTER TABLE "new_FbxModel" RENAME TO "FbxModel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
