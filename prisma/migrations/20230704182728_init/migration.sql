/*
  Warnings:

  - You are about to drop the column `safeDate` on the `Model` table. All the data in the column will be lost.
  - Added the required column `newestVersion` to the `Scene` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Scene" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idUserCreater" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createDate" DATETIME NOT NULL,
    "newestVersion" INTEGER NOT NULL
);
INSERT INTO "new_Scene" ("createDate", "id", "idUserCreater", "name") SELECT "createDate", "id", "idUserCreater", "name" FROM "Scene";
DROP TABLE "Scene";
ALTER TABLE "new_Scene" RENAME TO "Scene";
CREATE TABLE "new_Model" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idScene" TEXT NOT NULL,
    "positionX" REAL NOT NULL,
    "positionY" REAL NOT NULL,
    "positionZ" REAL NOT NULL,
    "scaleX" REAL NOT NULL,
    "scaleY" REAL NOT NULL,
    "scaleZ" REAL NOT NULL,
    "rotationX" REAL NOT NULL,
    "rotationY" REAL NOT NULL,
    "rotationZ" REAL NOT NULL,
    "visibleInOtherPerspective" BOOLEAN NOT NULL,
    "showXTransform" BOOLEAN NOT NULL,
    "showYTransform" BOOLEAN NOT NULL,
    "showZTransform" BOOLEAN NOT NULL,
    "modelPath" TEXT,
    "info" TEXT,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "texture" TEXT,
    "version" INTEGER NOT NULL
);
INSERT INTO "new_Model" ("color", "id", "idScene", "info", "modelPath", "name", "positionX", "positionY", "positionZ", "rotationX", "rotationY", "rotationZ", "scaleX", "scaleY", "scaleZ", "showXTransform", "showYTransform", "showZTransform", "texture", "visibleInOtherPerspective") SELECT "color", "id", "idScene", "info", "modelPath", "name", "positionX", "positionY", "positionZ", "rotationX", "rotationY", "rotationZ", "scaleX", "scaleY", "scaleZ", "showXTransform", "showYTransform", "showZTransform", "texture", "visibleInOtherPerspective" FROM "Model";
DROP TABLE "Model";
ALTER TABLE "new_Model" RENAME TO "Model";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
