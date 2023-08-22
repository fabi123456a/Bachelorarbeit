-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CurrentSceneEdit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idUser" TEXT NOT NULL,
    "idScene" TEXT NOT NULL,
    "entryDate" DATETIME NOT NULL,
    CONSTRAINT "CurrentSceneEdit_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CurrentSceneEdit" ("entryDate", "id", "idScene", "idUser") SELECT "entryDate", "id", "idScene", "idUser" FROM "CurrentSceneEdit";
DROP TABLE "CurrentSceneEdit";
ALTER TABLE "new_CurrentSceneEdit" RENAME TO "CurrentSceneEdit";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
