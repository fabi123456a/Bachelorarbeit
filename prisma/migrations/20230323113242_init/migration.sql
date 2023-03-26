/*
  Warnings:

  - Made the column `name` on table `FbxModel` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FbxModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL,
    "name" TEXT NOT NULL
);
INSERT INTO "new_FbxModel" ("id", "name", "path") SELECT "id", "name", "path" FROM "FbxModel";
DROP TABLE "FbxModel";
ALTER TABLE "new_FbxModel" RENAME TO "FbxModel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
