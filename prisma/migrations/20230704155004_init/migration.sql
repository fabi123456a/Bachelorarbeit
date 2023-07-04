/*
  Warnings:

  - You are about to drop the `ModelName` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ModelName";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Model" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "positionX" INTEGER NOT NULL,
    "positionY" INTEGER NOT NULL,
    "positionZ" INTEGER NOT NULL,
    "scaleX" REAL NOT NULL,
    "scaleY" REAL NOT NULL,
    "scaleZ" REAL NOT NULL,
    "rotationX" INTEGER NOT NULL,
    "rotationY" INTEGER NOT NULL,
    "rotationZ" INTEGER NOT NULL,
    "visibleInOtherPerspective" BOOLEAN NOT NULL,
    "showXTransform" BOOLEAN NOT NULL,
    "showYTransform" BOOLEAN NOT NULL,
    "showZTransform" BOOLEAN NOT NULL,
    "modelPath" TEXT,
    "info" TEXT,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "texture" TEXT
);
