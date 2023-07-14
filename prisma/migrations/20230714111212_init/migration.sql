/*
  Warnings:

  - You are about to drop the column `readOnly` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loginID" TEXT NOT NULL,
    "password" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT true,
    "write" BOOLEAN NOT NULL DEFAULT false,
    "delete" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("id", "isAdmin", "loginID", "password") SELECT "id", "isAdmin", "loginID", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_loginID_key" ON "User"("loginID");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
