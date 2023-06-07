/*
  Warnings:

  - Added the required column `readOnly` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loginID" TEXT NOT NULL,
    "password" TEXT,
    "readOnly" TEXT NOT NULL
);
INSERT INTO "new_User" ("id", "loginID", "password") SELECT "id", "loginID", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_loginID_key" ON "User"("loginID");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
