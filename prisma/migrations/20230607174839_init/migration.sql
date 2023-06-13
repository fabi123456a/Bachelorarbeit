/*
  Warnings:

  - You are about to alter the column `readOnly` on the `User` table. The data in that column could be lost. The data in that column will be cast from `String` to `Boolean`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loginID" TEXT NOT NULL,
    "password" TEXT,
    "readOnly" BOOLEAN NOT NULL
);
INSERT INTO "new_User" ("id", "loginID", "password", "readOnly") SELECT "id", "loginID", "password", "readOnly" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_loginID_key" ON "User"("loginID");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;