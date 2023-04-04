/*
  Warnings:

  - Added the required column `datum` to the `ChatEntry` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idScene" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "datum" DATETIME NOT NULL
);
INSERT INTO "new_ChatEntry" ("id", "idScene", "idUser", "message") SELECT "id", "idScene", "idUser", "message" FROM "ChatEntry";
DROP TABLE "ChatEntry";
ALTER TABLE "new_ChatEntry" RENAME TO "ChatEntry";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
