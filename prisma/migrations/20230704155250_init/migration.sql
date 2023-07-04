/*
  Warnings:

  - Added the required column `idScene` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Model" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idScene" TEXT NOT NULL,
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
INSERT INTO "new_Model" ("color", "id", "info", "modelPath", "name", "positionX", "positionY", "positionZ", "rotationX", "rotationY", "rotationZ", "scaleX", "scaleY", "scaleZ", "showXTransform", "showYTransform", "showZTransform", "texture", "visibleInOtherPerspective") SELECT "color", "id", "info", "modelPath", "name", "positionX", "positionY", "positionZ", "rotationX", "rotationY", "rotationZ", "scaleX", "scaleY", "scaleZ", "showXTransform", "showYTransform", "showZTransform", "texture", "visibleInOtherPerspective" FROM "Model";
DROP TABLE "Model";
ALTER TABLE "new_Model" RENAME TO "Model";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
