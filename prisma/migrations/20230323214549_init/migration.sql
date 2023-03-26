-- CreateTable
CREATE TABLE "Scene" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idUserCreater" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createDate" DATETIME NOT NULL,
    "path" TEXT NOT NULL
);
