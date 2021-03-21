/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Profile` DROP FOREIGN KEY `Profile_ibfk_1`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN     `first_name` VARCHAR(191),
    ADD COLUMN     `last_name` VARCHAR(191),
    ADD COLUMN     `photo` VARCHAR(191),
    ADD COLUMN     `phone_number` VARCHAR(191),
    ADD COLUMN     `city` VARCHAR(191),
    ADD COLUMN     `description` VARCHAR(191);

-- DropTable
DROP TABLE `Profile`;
