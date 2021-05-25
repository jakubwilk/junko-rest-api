/*
  Warnings:

  - Made the column `first_name` on table `User` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `last_name` on table `User` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `photo` on table `User` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `phone_number` on table `User` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `city` on table `User` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `description` on table `User` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `is_active` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `first_name` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `last_name` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `photo` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `phone_number` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `city` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `description` VARCHAR(191) NOT NULL DEFAULT '';
