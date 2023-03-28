/*
  Warnings:

  - You are about to drop the `FbxModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Scene` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FbxModel";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Scene";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loginID" TEXT NOT NULL,
    "password" TEXT
);

-- CreateTable
CREATE TABLE "FbxModels" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "folder" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Scenes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idUserCreater" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createDate" DATETIME NOT NULL,
    "path" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionID" TEXT NOT NULL,
    "idUser" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_loginID_key" ON "Users"("loginID");
