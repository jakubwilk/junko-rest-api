/*
  Warnings:

  - Added the required column `first_name` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photo` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Profile` ADD COLUMN     `first_name` VARCHAR(191) NOT NULL,
    ADD COLUMN     `last_name` VARCHAR(191) NOT NULL,
    ADD COLUMN     `photo` VARCHAR(191) NOT NULL,
    ADD COLUMN     `phone_number` VARCHAR(191) NOT NULL,
    ADD COLUMN     `city` VARCHAR(191) NOT NULL,
    ADD COLUMN     `description` VARCHAR(191) NOT NULL;
