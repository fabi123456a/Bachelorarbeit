-- CreateTable
CREATE TABLE "ModelName" (
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
