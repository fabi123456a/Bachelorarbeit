/*
  Warnings:

  - Added the required column `startDate` to the `Sessions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idUser" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL
);
INSERT INTO "new_Sessions" ("id", "idUser") SELECT "id", "idUser" FROM "Sessions";
DROP TABLE "Sessions";
ALTER TABLE "new_Sessions" RENAME TO "Sessions";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
