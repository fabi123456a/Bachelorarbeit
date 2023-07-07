-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SceneMemberShip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idScene" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "entryDate" DATETIME NOT NULL,
    "readOnly" BOOLEAN NOT NULL,
    CONSTRAINT "SceneMemberShip_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SceneMemberShip_idScene_fkey" FOREIGN KEY ("idScene") REFERENCES "Scene" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SceneMemberShip" ("entryDate", "id", "idScene", "idUser", "readOnly") SELECT "entryDate", "id", "idScene", "idUser", "readOnly" FROM "SceneMemberShip";
DROP TABLE "SceneMemberShip";
ALTER TABLE "new_SceneMemberShip" RENAME TO "SceneMemberShip";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
