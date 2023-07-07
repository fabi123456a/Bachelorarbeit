-- CreateTable
CREATE TABLE "SceneMemberShip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idScene" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "entryDate" DATETIME NOT NULL,
    "readOnly" BOOLEAN NOT NULL
);
