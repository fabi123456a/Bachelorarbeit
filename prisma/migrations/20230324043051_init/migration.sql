-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Scene" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idUserCreater" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createDate" DATETIME NOT NULL,
    "path" TEXT NOT NULL
);
INSERT INTO "new_Scene" ("createDate", "id", "idUserCreater", "name", "path") SELECT "createDate", "id", "idUserCreater", "name", "path" FROM "Scene";
DROP TABLE "Scene";
ALTER TABLE "new_Scene" RENAME TO "Scene";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
