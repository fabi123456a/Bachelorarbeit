/*
  Warnings:

  - You are about to drop the column `sessionID` on the `Sessions` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idUser" TEXT NOT NULL
);
INSERT INTO "new_Sessions" ("id", "idUser") SELECT "id", "idUser" FROM "Sessions";
DROP TABLE "Sessions";
ALTER TABLE "new_Sessions" RENAME TO "Sessions";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
