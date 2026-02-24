/*
  Warnings:

  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `guest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `table` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verificationtoken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_userId_fkey`;

-- DropForeignKey
ALTER TABLE `guest` DROP FOREIGN KEY `Guest_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `guest` DROP FOREIGN KEY `Guest_tableId_fkey`;

-- DropForeignKey
ALTER TABLE `invitation` DROP FOREIGN KEY `Invitation_guestId_fkey`;

-- DropForeignKey
ALTER TABLE `session` DROP FOREIGN KEY `Session_userId_fkey`;

-- DropForeignKey
ALTER TABLE `table` DROP FOREIGN KEY `Table_eventId_fkey`;

-- DropTable
DROP TABLE `account`;

-- DropTable
DROP TABLE `event`;

-- DropTable
DROP TABLE `guest`;

-- DropTable
DROP TABLE `invitation`;

-- DropTable
DROP TABLE `session`;

-- DropTable
DROP TABLE `table`;

-- DropTable
DROP TABLE `user`;

-- DropTable
DROP TABLE `verificationtoken`;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `rol` VARCHAR(191) NOT NULL DEFAULT 'Organizador',
    `email_verificado` DATETIME(3) NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cuentas` (
    `id` VARCHAR(191) NOT NULL,
    `usuario_id` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `proveedor` VARCHAR(191) NOT NULL,
    `proveedor_cuenta_id` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE INDEX `cuentas_proveedor_proveedor_cuenta_id_key`(`proveedor`, `proveedor_cuenta_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sesiones` (
    `id` VARCHAR(191) NOT NULL,
    `token_sesion` VARCHAR(191) NOT NULL,
    `usuario_id` VARCHAR(191) NOT NULL,
    `expira` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sesiones_token_sesion_key`(`token_sesion`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tokens_verificacion` (
    `identificador` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expira` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tokens_verificacion_token_key`(`token`),
    UNIQUE INDEX `tokens_verificacion_identificador_token_key`(`identificador`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eventos` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `hora` VARCHAR(191) NOT NULL,
    `tipo` ENUM('Boda', 'XV_Anos', 'Cumpleaños', 'Bautizo', 'Graduacion', 'Conferencia', 'Corporativo', 'Fiesta_Privada', 'Otro') NOT NULL DEFAULT 'Otro',
    `descripcion` TEXT NULL,
    `total_invitados` INTEGER NOT NULL,
    `lugar_nombre` VARCHAR(191) NULL,
    `direccion` VARCHAR(191) NULL,
    `ciudad` VARCHAR(191) NULL,
    `codigo_postal` VARCHAR(191) NULL,
    `pais` VARCHAR(191) NOT NULL DEFAULT 'España',
    `lugar_telefono` VARCHAR(191) NULL,
    `punto_referencia` TEXT NULL,
    `nombre_organizador` VARCHAR(191) NULL,
    `email_organizador` VARCHAR(191) NULL,
    `telefono_organizador` VARCHAR(191) NULL,
    `codigo_vestimenta` VARCHAR(191) NULL,
    `notas_especiales` TEXT NULL,
    `estado` VARCHAR(191) NOT NULL DEFAULT 'proximo',
    `usuario_id` VARCHAR(191) NOT NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invitados` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `telefono` VARCHAR(191) NULL,
    `estado` VARCHAR(191) NOT NULL DEFAULT 'pendiente',
    `evento_id` VARCHAR(191) NOT NULL,
    `mesa_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mesas` (
    `id` VARCHAR(191) NOT NULL,
    `numero` INTEGER NOT NULL,
    `capacidad` INTEGER NOT NULL,
    `ubicacion` VARCHAR(191) NULL,
    `estado` VARCHAR(191) NOT NULL DEFAULT 'vacia',
    `evento_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invitaciones` (
    `id` VARCHAR(191) NOT NULL,
    `invitado_id` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL DEFAULT 'enviada',
    `fecha_envio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_apertura` DATETIME(3) NULL,
    `fecha_click` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cuentas` ADD CONSTRAINT `cuentas_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sesiones` ADD CONSTRAINT `sesiones_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eventos` ADD CONSTRAINT `eventos_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitados` ADD CONSTRAINT `invitados_evento_id_fkey` FOREIGN KEY (`evento_id`) REFERENCES `eventos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitados` ADD CONSTRAINT `invitados_mesa_id_fkey` FOREIGN KEY (`mesa_id`) REFERENCES `mesas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mesas` ADD CONSTRAINT `mesas_evento_id_fkey` FOREIGN KEY (`evento_id`) REFERENCES `eventos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitaciones` ADD CONSTRAINT `invitaciones_invitado_id_fkey` FOREIGN KEY (`invitado_id`) REFERENCES `invitados`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
