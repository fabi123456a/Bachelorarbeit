-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idScene" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "datum" DATETIME NOT NULL,
    CONSTRAINT "ChatEntry_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ChatEntry" ("datum", "id", "idScene", "idUser", "message") SELECT "datum", "id", "idScene", "idUser", "message" FROM "ChatEntry";
DROP TABLE "ChatEntry";
ALTER TABLE "new_ChatEntry" RENAME TO "ChatEntry";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
