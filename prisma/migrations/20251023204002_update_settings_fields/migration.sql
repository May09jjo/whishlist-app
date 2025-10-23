/*
  Warnings:

  - You are about to drop the column `description` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Settings` table. All the data in the column will be lost.
  - Added the required column `businessAddress` to the `Settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeName` to the `Settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Settings` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "storeName" TEXT NOT NULL,
    "businessAddress" TEXT NOT NULL,
    "storePhone" TEXT,
    "primaryCurrency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Settings" ("id") SELECT "id" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
