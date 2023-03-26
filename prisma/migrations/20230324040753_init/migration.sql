/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FbxModel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Scene` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loginID" TEXT NOT NULL,
    "password" TEXT
);
INSERT INTO "new_User" ("id", "loginID", "password") SELECT "id", "loginID", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_loginID_key" ON "User"("loginID");
CREATE TABLE "new_FbxModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "folder" TEXT NOT NULL
);
INSERT INTO "new_FbxModel" ("folder", "id", "name") SELECT "folder", "id", "name" FROM "FbxModel";
DROP TABLE "FbxModel";
ALTER TABLE "new_FbxModel" RENAME TO "FbxModel";
CREATE TABLE "new_Scene" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idUserCreater" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createDate" DATETIME NOT NULL,
    "path" TEXT NOT NULL
);
INSERT INTO "new_Scene" ("createDate", "id", "idUserCreater", "name", "path") SELECT "createDate", "id", "idUserCreater", "name", "path" FROM "Scene";
DROP TABLE "Scene";
ALTER TABLE "new_Scene" RENAME TO "Scene";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
