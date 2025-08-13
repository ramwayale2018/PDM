-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 03, 2025 at 08:54 AM
-- Server version: 8.0.39
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jay_pdm`
--

-- --------------------------------------------------------

--
-- Table structure for table `design_status_activity`
--

CREATE TABLE `design_status_activity` (
  `dsa_id` int NOT NULL,
  `du_id` int NOT NULL,
  `user_id` int NOT NULL,
  `previous_status` varchar(255) NOT NULL,
  `updated_status` varchar(255) NOT NULL,
  `activity_timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `design_status_activity`
--

INSERT INTO `design_status_activity` (`dsa_id`, `du_id`, `user_id`, `previous_status`, `updated_status`, `activity_timestamp`) VALUES
(1, 1, 7, 'in_progress', 'pending', '2025-01-24 06:08:09');

-- --------------------------------------------------------

--
-- Table structure for table `design_upload`
--

CREATE TABLE `design_upload` (
  `du_id` int NOT NULL,
  `product_id` int NOT NULL,
  `revision_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `design_path` varchar(255) NOT NULL,
  `upload_timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','in_progress','under_review','on_hold','completed') NOT NULL DEFAULT 'pending',
  `comment` text,
  `version` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `design_upload`
--

INSERT INTO `design_upload` (`du_id`, `product_id`, `revision_id`, `user_id`, `design_path`, `upload_timestamp`, `status`, `comment`, `version`) VALUES
(1, 1, NULL, 7, 'D:\\JAY_PDM_DATA\\Part1\\designs_v1\\Product_Data_Management_Presentation_Enhanced.pptx', '2025-01-24 05:53:38', 'in_progress', 'cutting\n', 1),
(2, 2, NULL, 1, 'D:\\JAY_PDM_DATA\\Part2\\designs\\Create_Project_Template (2).xlsx', '2025-01-27 06:45:04', 'pending', '', 0),
(3, 4, NULL, 6, 'D:\\JAY_PDM_DATA\\part4\\designs_v1\\Create Project template (4).xlsx', '2025-01-27 10:51:22', 'in_progress', '', 1),
(4, 5, NULL, 4, 'D:\\JAY_PDM_DATA\\part5\\A\\design\\designs_v1\\Create Project template (4) (3).xlsx', '2025-01-28 07:40:49', 'under_review', '', 1),
(5, 5, NULL, 1, 'D:\\JAY_PDM_DATA\\part5\\A\\design\\designs_v1\\Create Project template (4) (4).xlsx', '2025-01-28 07:45:33', 'pending', '', 1),
(6, 9, NULL, 2, 'D:\\JAY_PDM_DATA\\part8\\C\\design\\designs_v1\\project.sql', '2025-01-29 07:36:09', 'pending', '', 1),
(7, 9, 4, 2, 'D:\\JAY_PDM_DATA\\part8\\C\\design\\designs\\Bracket02 (1).CATPart', '2025-01-29 10:00:11', 'pending', '', 0),
(8, 7, 5, 2, 'D:\\JAY_PDM_DATA\\part7\\B\\design\\designs\\à¤µà¥à¤¯à¤¾à¤à¥à¤¯à¤¾à¤¨ à¤¨à¤¿à¤®à¤à¤¤à¥à¤°à¤£ (5).png', '2025-01-29 10:02:24', 'pending', '', 0),
(9, 7, 5, 2, 'D:\\JAY_PDM_DATA\\part7\\B\\design\\designs\\Emudra PFX\\e-Mudhra Sub CA for Class 2 Document Signer 2022.pfx', '2025-01-29 10:02:24', 'pending', '', 0),
(10, 7, 5, 2, 'D:\\JAY_PDM_DATA\\part7\\B\\design\\designs\\Emudra PFX\\PW.txt', '2025-01-29 10:02:24', 'pending', '', 0),
(11, 9, 6, 2, 'D:\\JAY_PDM_DATA\\part8\\D\\design\\designs\\butterfly_pattern.js', '2025-01-30 04:32:22', 'pending', '', 0),
(12, 10, 7, 2, 'D:\\JAY_PDM_DATA\\part9\\A\\design\\designs\\6.js', '2025-01-30 06:00:08', 'pending', '', 0),
(13, 10, 7, 2, 'D:\\JAY_PDM_DATA\\part9\\A\\design\\designs\\13.js', '2025-01-30 06:00:08', 'pending', '', 0),
(14, 10, 8, 7, 'D:\\JAY_PDM_DATA\\part9\\B\\design\\designs_v1\\asyncExercise.js', '2025-01-30 06:05:17', 'under_review', '', 1),
(15, 11, 9, 2, 'D:\\JAY_PDM_DATA\\part10\\A\\design\\designs_v1\\promise.js', '2025-01-30 09:32:33', 'pending', '', 1),
(16, 11, 9, 2, 'D:\\JAY_PDM_DATA\\part10\\A\\design\\designs\\rotational.js', '2025-01-30 09:32:33', 'pending', '', 0),
(17, 11, 9, 2, 'D:\\JAY_PDM_DATA\\part10\\A\\design\\designs\\slice.js', '2025-01-30 09:32:33', 'pending', '', 0),
(18, 11, 9, 2, 'D:\\JAY_PDM_DATA\\part10\\A\\design\\designs\\sortingTwoArray.js', '2025-01-30 09:32:33', 'pending', '', 0),
(19, 11, 10, 2, 'D:\\JAY_PDM_DATA\\part10\\B\\design\\designs\\stringProgram.js', '2025-01-30 09:44:45', 'pending', '', 0),
(20, 11, 10, 7, 'D:\\JAY_PDM_DATA\\part10\\B\\design\\designs\\unique_character.js', '2025-01-30 12:31:39', 'pending', '', 0),
(21, 13, 12, 7, 'D:\\JAY_PDM_DATA\\part12\\A\\design\\designs\\Bali 05N_06D Amazing Honeymoon pacakge   (1).pdf', '2025-02-03 06:44:34', 'pending', 'refa', 0),
(22, 13, 12, 7, 'D:\\JAY_PDM_DATA\\part12\\A\\design\\designs\\Product_Data_Management_Presentation_Enhanced (2).pptx', '2025-02-03 07:31:31', 'pending', '', 0),
(23, 13, 12, 7, 'D:\\JAY_PDM_DATA\\part12\\A\\design\\designs\\ASA-21-00-08.SLDDRW', '2025-02-03 07:31:31', 'pending', '', 0),
(24, 13, 13, 1, 'D:\\JAY_PDM_DATA\\part12\\B\\design\\designs_v2\\Create Project template.xlsx', '2025-02-04 09:23:47', 'pending', '', 2),
(25, 13, 13, 1, 'D:\\JAY_PDM_DATA\\part12\\B\\design\\designs\\test encrypted.pdf', '2025-02-04 09:23:47', 'pending', '', 0),
(26, 13, 13, 1, 'D:\\JAY_PDM_DATA\\part12\\B\\design\\designs\\Project_Timeline.xlsx', '2025-02-04 09:23:47', 'pending', '', 0),
(27, 13, 13, 7, 'D:\\JAY_PDM_DATA\\part12\\B\\design\\designs_v2\\ECN (1).pdf', '2025-02-04 10:28:02', 'pending', '', 0),
(28, 12, 11, 7, 'D:\\JAY_PDM_DATA\\part11\\A\\design\\designs\\ASA-21-00-01-SS304-1.5-01 (1).DXF', '2025-02-05 05:23:56', 'pending', '', 0),
(29, 14, 14, 7, 'D:\\JAY_PDM_DATA\\part13\\A\\design\\designs_v3\\W609-FR SKID PLATE_11.12.2024.CATPart', '2025-02-05 10:09:36', 'under_review', '', 3),
(30, 14, 14, 7, 'D:\\JAY_PDM_DATA\\part13\\A\\design\\designs_v1\\W609-FR BUMPER ASSEMBLY 13.12.2024.CATProduct', '2025-02-05 10:09:36', 'pending', '', 1),
(31, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B\\design\\designs\\DVP_details.xlsx', '2025-02-19 04:33:32', 'pending', '', 0),
(32, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A\\design\\designs\\sample (1).xlsx', '2025-02-19 04:42:42', 'pending', '', 0),
(33, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A\\design\\designs\\ASA-21-00-01-SS304-1.5-01.DXF', '2025-02-19 04:58:41', 'pending', '', 0),
(34, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A\\design\\designs\\sample (1).xlsx', '2025-02-19 05:16:49', 'pending', '', 0),
(35, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A\\design\\designs\\Book1.xlsx', '2025-02-19 05:19:29', 'pending', '', 0),
(36, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A\\design\\PWD_active user.xlsx', '2025-02-19 05:27:45', 'pending', '', 0),
(37, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A_v3\\Design\\sample (1).xlsx', '2025-02-19 06:18:37', 'pending', '', 3),
(38, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A_v3\\Design\\ASA-21-00-01-SS304-1.5-01.DXF', '2025-02-19 06:18:37', 'pending', '', 3),
(39, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A_v3\\Design\\sample (1).xlsx', '2025-02-19 06:18:37', 'pending', '', 3),
(40, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A_v3\\Design\\Book1.xlsx', '2025-02-19 06:18:37', 'pending', '', 3),
(41, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A_v3\\Design\\PWD_active user.xlsx', '2025-02-19 06:18:37', 'pending', '', 3),
(42, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v1\\Design\\DVP_details.xlsx', '2025-02-19 06:38:39', 'pending', '', 1),
(43, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v2\\Design\\DVP_details.xlsx', '2025-02-19 06:41:48', 'pending', '', 2),
(44, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v2\\Design\\DVP_details.xlsx', '2025-02-19 06:41:48', 'pending', '', 2),
(45, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v3\\design\\DVP_details.xlsx', '2025-02-19 06:53:07', 'pending', '', 3),
(46, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v3\\design\\DVP_details.xlsx', '2025-02-19 06:53:07', 'pending', '', 3),
(47, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v3\\design\\DVP_details.xlsx', '2025-02-19 06:53:07', 'pending', '', 3),
(48, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v3\\design\\DVP_details.xlsx', '2025-02-19 06:53:07', 'pending', '', 3),
(49, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v4\\design\\DVP_details.xlsx', '2025-02-19 06:53:59', 'pending', '', 4),
(50, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v4\\design\\DVP_details.xlsx', '2025-02-19 06:53:59', 'pending', '', 4),
(51, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v4\\design\\DVP_details.xlsx', '2025-02-19 06:53:59', 'pending', '', 4),
(52, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v4\\design\\DVP_details.xlsx', '2025-02-19 06:53:59', 'pending', '', 4),
(53, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v5\\DVP_details.xlsx', '2025-02-19 07:03:38', 'pending', '', 5),
(54, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v5\\DVP_details.xlsx', '2025-02-19 07:03:38', 'pending', '', 5),
(55, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v5\\DVP_details.xlsx', '2025-02-19 07:03:38', 'pending', '', 5),
(56, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v5\\DVP_details.xlsx', '2025-02-19 07:03:38', 'pending', '', 5),
(57, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v5\\DVP_details.xlsx', '2025-02-19 07:03:38', 'pending', '', 5),
(58, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v5\\DVP_details.xlsx', '2025-02-19 07:03:38', 'pending', '', 5),
(59, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v5\\DVP_details.xlsx', '2025-02-19 07:03:38', 'pending', '', 5),
(60, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v5\\DVP_details.xlsx', '2025-02-19 07:03:38', 'pending', '', 5),
(61, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v6\\DVP_details.xlsx', '2025-02-19 07:05:45', 'pending', '', 6),
(62, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v6\\DVP_details.xlsx', '2025-02-19 07:05:45', 'pending', '', 6),
(63, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v6\\DVP_details.xlsx', '2025-02-19 07:05:45', 'pending', '', 6),
(64, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v6\\DVP_details.xlsx', '2025-02-19 07:05:45', 'pending', '', 6),
(65, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v6\\DVP_details.xlsx', '2025-02-19 07:05:45', 'pending', '', 6),
(66, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v6\\DVP_details.xlsx', '2025-02-19 07:05:45', 'pending', '', 6),
(67, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v6\\DVP_details.xlsx', '2025-02-19 07:05:45', 'pending', '', 6),
(68, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v6\\DVP_details.xlsx', '2025-02-19 07:05:45', 'pending', '', 6),
(69, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v6\\DVP_details.xlsx', '2025-02-19 07:05:45', 'pending', '', 6),
(70, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v6\\DVP_details.xlsx', '2025-02-19 07:05:45', 'pending', '', 6),
(71, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v6\\DVP_details.xlsx', '2025-02-19 07:05:45', 'pending', '', 6),
(72, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v6\\DVP_details.xlsx', '2025-02-19 07:05:45', 'pending', '', 6),
(73, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v6\\DVP_details.xlsx', '2025-02-19 07:05:45', 'pending', '', 6),
(74, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v6\\DVP_details.xlsx', '2025-02-19 07:05:45', 'pending', '', 6),
(75, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v6\\DVP_details.xlsx', '2025-02-19 07:05:45', 'pending', '', 6),
(76, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v6\\DVP_details.xlsx', '2025-02-19 07:05:45', 'pending', '', 6),
(77, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(78, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(79, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(80, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(81, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(82, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(83, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(84, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(85, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(86, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(87, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(88, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(89, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(90, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(91, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(92, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(93, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(94, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(95, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(96, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(97, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(98, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(99, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(100, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(101, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(102, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(103, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(104, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(105, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(106, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(107, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(108, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(109, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(110, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(111, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(112, 14, 16, 1, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DVP_details.xlsx', '2025-02-19 07:06:46', 'pending', '', 7),
(113, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A_v4\\sample (1).xlsx', '2025-02-19 07:12:38', 'pending', '', 4),
(114, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A_v4\\ASA-21-00-01-SS304-1.5-01.DXF', '2025-02-19 07:12:38', 'pending', '', 4),
(115, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A_v4\\sample (1).xlsx', '2025-02-19 07:12:38', 'pending', '', 4),
(116, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A_v4\\Book1.xlsx', '2025-02-19 07:12:38', 'pending', '', 4),
(117, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A_v4\\PWD_active user.xlsx', '2025-02-19 07:12:38', 'pending', '', 4),
(118, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A_v4\\sample (1).xlsx', '2025-02-19 07:12:38', 'pending', '', 4),
(119, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A_v4\\ASA-21-00-01-SS304-1.5-01.DXF', '2025-02-19 07:12:38', 'pending', '', 4),
(120, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A_v4\\sample (1).xlsx', '2025-02-19 07:12:38', 'pending', '', 4),
(121, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A_v4\\Book1.xlsx', '2025-02-19 07:12:38', 'pending', '', 4),
(122, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A_v4\\PWD_active user.xlsx', '2025-02-19 07:12:38', 'pending', '', 4),
(123, 12, 11, 7, 'D:\\JAY_PDM_DATA\\part11\\A_v1\\ASA-21-00-01-SS304-1.5-01 (1).DXF', '2025-02-19 07:15:03', 'pending', '', 1),
(124, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C\\design\\Book1.xlsx', '2025-02-19 07:17:46', 'pending', '', 0),
(125, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C\\design\\PWD_active user.xlsx', '2025-02-19 07:17:47', 'pending', '', 0),
(126, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v1\\Book1.xlsx', '2025-02-19 07:19:46', 'pending', '', 1),
(127, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v1\\PWD_active user.xlsx', '2025-02-19 07:19:46', 'pending', '', 1),
(128, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v2\\Book1.xlsx', '2025-02-19 07:25:40', 'pending', '', 2),
(129, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v2\\PWD_active user.xlsx', '2025-02-19 07:25:40', 'pending', '', 2),
(130, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v3\\design\\Book1.xlsx', '2025-02-19 07:26:40', 'pending', '', 3),
(131, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v3\\design\\PWD_active user.xlsx', '2025-02-19 07:26:40', 'pending', '', 3),
(132, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v3\\design\\Book1.xlsx', '2025-02-19 07:26:40', 'pending', '', 3),
(133, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v3\\design\\PWD_active user.xlsx', '2025-02-19 07:26:40', 'pending', '', 3),
(134, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v4\\design\\Book1.xlsx', '2025-02-19 07:30:36', 'pending', '', 4),
(135, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v4\\design\\PWD_active user.xlsx', '2025-02-19 07:30:36', 'pending', '', 4),
(136, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v4\\design\\Book1.xlsx', '2025-02-19 07:30:36', 'pending', '', 4),
(137, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v4\\design\\PWD_active user.xlsx', '2025-02-19 07:30:36', 'pending', '', 4),
(138, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v4\\design\\Book1.xlsx', '2025-02-19 07:30:36', 'pending', '', 4),
(139, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v4\\design\\PWD_active user.xlsx', '2025-02-19 07:30:36', 'pending', '', 4),
(140, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v4\\design\\Book1.xlsx', '2025-02-19 07:30:36', 'pending', '', 4),
(141, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v4\\design\\PWD_active user.xlsx', '2025-02-19 07:30:36', 'pending', '', 4),
(142, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v5\\design\\Book1.xlsx', '2025-02-19 07:38:10', 'pending', '', 5),
(143, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v5\\design\\PWD_active user.xlsx', '2025-02-19 07:38:10', 'pending', '', 5),
(144, 12, 11, 1, 'D:\\JAY_PDM_DATA\\part11\\A\\design\\designs\\DVP_details (3).xlsx', '2025-02-19 10:20:57', 'pending', '', 0),
(145, 12, 11, 1, 'D:\\JAY_PDM_DATA\\part11\\A_v2\\designs\\DVP_details (1).xlsx', '2025-02-19 10:39:47', 'pending', '', 2),
(146, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v6\\designs\\DVP_details (2).xlsx', '2025-02-20 04:34:34', 'pending', '', 6),
(147, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v6\\designs\\sample (1) (4).xlsx', '2025-02-20 04:34:34', 'pending', '', 6),
(148, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v7\\designs\\ASA-21-00-01-SS304-1.5-01.DXF', '2025-02-20 09:28:29', 'pending', '', 7),
(149, 17, 19, 7, 'D:\\JAY_PDM_DATA\\demo part\\A\\designs\\Bracket02 (3).CATPart', '2025-02-21 09:18:35', 'pending', '', 0),
(150, 17, 19, 7, 'D:\\JAY_PDM_DATA\\demo part\\A\\designs\\table_data (3).xlsx', '2025-02-21 09:18:35', 'pending', '', 0),
(151, 17, 19, 7, 'D:\\JAY_PDM_DATA\\demo part\\A_v1\\designs\\tax_invoice_100.pdf', '2025-02-21 09:29:10', 'pending', '', 1),
(152, 17, 19, 7, 'D:\\JAY_PDM_DATA\\demo part\\A_v1\\designs\\table_data (3).xlsx', '2025-02-21 09:29:10', 'pending', '', 1),
(153, 17, 19, 1, 'D:\\JAY_PDM_DATA\\demo part\\A_v1\\designs\\sample (1) (1).xlsx', '2025-02-21 10:11:46', 'pending', '', 1),
(154, 19, 21, 7, 'D:\\JAY_PDM_DATA\\new part\\A\\designs\\Bracket02 (3).CATPart', '2025-02-28 10:10:06', 'pending', '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `design_upload_version`
--

CREATE TABLE `design_upload_version` (
  `duv_id` int NOT NULL,
  `du_id` int NOT NULL,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `version` int NOT NULL,
  `comment` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `design_upload_version`
--

INSERT INTO `design_upload_version` (`duv_id`, `du_id`, `product_id`, `user_id`, `file_path`, `timestamp`, `version`, `comment`) VALUES
(1, 1, 1, 7, 'D:\\JAY_PDM_DATA\\Part1\\designs_v1\\Product_Data_Management_Presentation_Enhanced.pptx', '2025-01-24 06:43:58', 1, 'test'),
(2, 3, 4, 1, 'D:\\JAY_PDM_DATA\\part4\\designs_v1\\Create Project template (4).xlsx', '2025-01-27 10:56:55', 1, ''),
(3, 5, 5, 1, 'D:\\JAY_PDM_DATA\\part5\\A\\design\\designs_v1\\Create Project template (4) (4).xlsx', '2025-01-28 07:46:13', 1, ''),
(4, 4, 5, 4, 'D:\\JAY_PDM_DATA\\part5\\A\\design\\designs_v1\\Create Project template (4) (3).xlsx', '2025-01-28 09:45:39', 1, ''),
(5, 6, 9, 2, 'D:\\JAY_PDM_DATA\\part8\\C\\design\\designs_v1\\project.sql', '2025-01-29 10:01:29', 1, 'xdfb'),
(6, 14, 10, 7, 'D:\\JAY_PDM_DATA\\part9\\B\\design\\designs_v1\\asyncExercise.js', '2025-01-30 06:07:04', 1, 'dgdsg'),
(7, 15, 11, 2, 'D:\\JAY_PDM_DATA\\part10\\A\\design\\designs_v1\\promise.js', '2025-01-30 09:34:16', 1, 'test'),
(8, 24, 13, 1, 'D:\\JAY_PDM_DATA\\part12\\B\\design\\designs_v1\\Create Project template.xlsx', '2025-02-04 10:01:14', 1, 'grfsvc'),
(9, 24, 13, 1, 'D:\\JAY_PDM_DATA\\part12\\B\\design\\designs_v2\\Create Project template.xlsx', '2025-02-04 10:02:26', 2, 'sdcx'),
(10, 29, 14, 7, 'D:\\JAY_PDM_DATA\\part13\\A\\design\\designs_v1\\W609-FR SKID PLATE_11.12.2024.CATPart', '2025-02-05 10:44:39', 1, ''),
(11, 29, 14, 7, 'D:\\JAY_PDM_DATA\\part13\\A\\design\\designs_v2\\W609-FR SKID PLATE_11.12.2024.CATPart', '2025-02-06 09:45:56', 2, 'ewsa'),
(12, 29, 14, 7, 'D:\\JAY_PDM_DATA\\part13\\A\\design\\designs_v3\\W609-FR SKID PLATE_11.12.2024.CATPart', '2025-02-06 09:46:21', 3, 'lkjhgfds'),
(13, 30, 14, 1, 'D:\\JAY_PDM_DATA\\part13\\A\\design\\designs_v1\\W609-FR BUMPER ASSEMBLY 13.12.2024.CATProduct', '2025-02-17 04:52:22', 1, 'hello');

-- --------------------------------------------------------

--
-- Table structure for table `dfx_files`
--

CREATE TABLE `dfx_files` (
  `dfx_id` int NOT NULL,
  `product_id` int NOT NULL,
  `revision_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `dfx_file_path` varchar(255) NOT NULL,
  `upload_timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dfx_files`
--

INSERT INTO `dfx_files` (`dfx_id`, `product_id`, `revision_id`, `user_id`, `dfx_file_path`, `upload_timestamp`) VALUES
(1, 2, NULL, 2, 'D:\\JAY_DFX\\Part2\\DFX\\users.xlsx', '2025-01-24 08:06:53'),
(2, 2, NULL, 2, 'D:\\JAY_DFX\\Part2\\DFX\\Testing PDF for pfx.pdf', '2025-01-24 08:06:53'),
(3, 2, NULL, 1, 'D:\\JAY_DFX\\Part2\\DFX\\MASTER LOGIN SITE DVP 26-12-23 (2) (1) (1).pdf', '2025-01-27 06:45:21'),
(4, 4, NULL, 1, 'D:\\JAY_DFX\\part4\\DFX\\Create_Project_Template (3).xlsx', '2025-01-27 10:54:36'),
(5, 5, NULL, 1, 'D:\\JAY_DFX\\part5\\A\\DFX\\ASA-21-00-08.SLDDRW', '2025-01-28 08:45:42'),
(6, 9, NULL, 2, 'D:\\JAY_DFX\\part8\\C\\DFX\\users.xlsx', '2025-01-29 07:36:45'),
(7, 9, NULL, 2, 'D:\\JAY_DFX\\part8\\C\\DFX\\WM Import File.csv', '2025-01-29 10:31:37'),
(8, 9, NULL, 2, 'D:\\JAY_DFX\\part8\\C\\DFX\\WM Import File.csv', '2025-01-29 10:31:40'),
(9, 7, NULL, 2, 'D:\\JAY_DFX\\part7\\B\\DFX\\angular.json', '2025-01-29 10:32:29'),
(10, 9, NULL, 2, 'D:\\JAY_DFX\\part8\\D\\DFX\\butterfly_pattern.js', '2025-01-30 04:32:34'),
(11, 9, NULL, 2, 'D:\\JAY_DFX\\part8\\D\\DFX\\countVowelSpecial.js', '2025-01-30 04:32:34'),
(12, 9, NULL, 2, 'D:\\JAY_DFX\\part8\\D\\DFX\\oops.md', '2025-01-30 04:47:10'),
(13, 9, 6, 1, 'D:\\JAY_DFX\\part8\\D\\DFX\\Html, CSS, Bootstrap, Javascript & jQuery Notesâ.pdf', '2025-01-30 05:13:28'),
(14, 10, 7, 2, 'D:\\JAY_DFX\\part9\\A\\DFX\\JavaScript-Interview-Questions.pdf', '2025-01-30 06:00:28'),
(15, 11, 9, 2, 'D:\\JAY_DFX\\part10\\A\\DFX\\countVowelSpecial.js', '2025-01-30 09:35:21'),
(16, 11, 10, 1, 'D:\\JAY_DFX\\part10\\B\\DFX\\ASA-21-00-01-SS304-1.5-01.DXF', '2025-01-31 10:35:27'),
(17, 14, 14, 1, 'D:\\JAY_DFX\\part13\\A\\DFX\\ASA-21-00-01-SS304-1.5-01.DXF', '2025-02-06 11:21:38');

-- --------------------------------------------------------

--
-- Table structure for table `ecn`
--

CREATE TABLE `ecn` (
  `ecn_id` int NOT NULL,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `description` text NOT NULL,
  `status` enum('requested','approved','reject') DEFAULT 'requested',
  `ecn_date` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ecn`
--

INSERT INTO `ecn` (`ecn_id`, `product_id`, `user_id`, `description`, `status`, `ecn_date`) VALUES
(1, 15, 12, 'ECN has been reviewed and reject.', 'reject', '2025-02-13 00:00:00'),
(2, 15, 12, 'hello testing', 'requested', '2025-02-13 00:00:00'),
(3, 14, 12, 'no need for changes', 'approved', '2025-02-13 14:08:54'),
(4, 15, 12, 'tedt', 'approved', '2025-02-18 09:51:01'),
(5, 13, 12, 'multiple changes', 'reject', '2025-02-18 11:55:32'),
(6, 13, 12, 'vs', 'approved', '2025-02-18 12:04:35'),
(7, 13, 12, 'sad', 'approved', '2025-02-18 12:09:58'),
(8, 10, 12, 'product status update', 'approved', '2025-02-18 14:44:42'),
(9, 16, 12, 'testing ECN', 'approved', '2025-02-19 10:31:38'),
(10, 12, 12, 'tw', 'approved', '2025-02-19 12:44:11'),
(11, 11, 12, 'rfvs', 'approved', '2025-02-19 12:49:25'),
(12, 11, 12, 'test', 'approved', '2025-02-21 14:39:18'),
(13, 17, 12, 'trest', 'approved', '2025-02-21 14:53:43');

-- --------------------------------------------------------

--
-- Table structure for table `ecn_approval`
--

CREATE TABLE `ecn_approval` (
  `ecn_approval_id` int NOT NULL,
  `ecn_id` int NOT NULL,
  `user_id` int NOT NULL,
  `action` enum('requested','approved','reject','changed by','replaced by') NOT NULL,
  `description` text NOT NULL,
  `action_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ecn_approval`
--

INSERT INTO `ecn_approval` (`ecn_approval_id`, `ecn_id`, `user_id`, `action`, `description`, `action_at`) VALUES
(1, 1, 12, 'requested', 'Your ECN Description', '2025-02-13 05:25:12'),
(2, 2, 12, 'requested', 'hello testing', '2025-02-13 05:39:43'),
(3, 1, 1, 'approved', 'ECN has been reviewed and approved.', '2025-02-13 05:57:59'),
(4, 1, 1, 'reject', 'ECN has been reviewed and reject.', '2025-02-13 06:02:42'),
(5, 3, 12, 'requested', 'trdssd', '2025-02-13 08:38:54'),
(6, 2, 1, 'requested', 'hello testing', '2025-02-14 04:25:04'),
(7, 2, 1, 'requested', 'hello testing', '2025-02-14 04:25:06'),
(8, 2, 1, 'approved', 'hello testing', '2025-02-14 04:25:32'),
(9, 3, 1, 'reject', 'no need for changes', '2025-02-14 04:31:47'),
(10, 2, 1, 'approved', 'hello testing', '2025-02-14 05:50:55'),
(11, 2, 1, 'reject', 'hello testing', '2025-02-14 05:58:38'),
(12, 2, 1, 'approved', 'hello testing', '2025-02-14 05:59:01'),
(13, 2, 1, 'approved', 'hello testing', '2025-02-17 05:48:09'),
(14, 2, 1, 'requested', 'hello testing', '2025-02-17 10:08:59'),
(15, 2, 1, 'approved', 'hello testing', '2025-02-17 10:11:36'),
(16, 4, 12, 'requested', 'tedt', '2025-02-18 04:21:01'),
(17, 3, 1, 'approved', 'no need for changes', '2025-02-18 05:39:15'),
(18, 5, 12, 'requested', 'multiple changes', '2025-02-18 06:25:32'),
(19, 5, 1, 'reject', 'multiple changes', '2025-02-18 06:26:36'),
(20, 6, 12, 'requested', 'vs', '2025-02-18 06:34:35'),
(21, 7, 12, 'requested', 'sad', '2025-02-18 06:39:58'),
(22, 7, 1, 'approved', 'sad', '2025-02-18 09:04:42'),
(23, 8, 12, 'requested', 'product status update', '2025-02-18 09:14:42'),
(24, 8, 1, 'approved', 'product status update', '2025-02-18 09:15:26'),
(25, 8, 1, 'approved', 'product status update', '2025-02-18 09:21:32'),
(26, 8, 1, 'approved', 'product status update', '2025-02-18 09:21:39'),
(27, 8, 1, 'approved', 'product status update', '2025-02-18 09:21:56'),
(28, 8, 1, 'approved', 'product status update', '2025-02-18 09:22:07'),
(29, 8, 1, 'reject', 'product status update', '2025-02-18 09:22:21'),
(30, 8, 1, 'reject', 'product status update', '2025-02-18 09:22:26'),
(31, 6, 1, 'approved', 'vs', '2025-02-18 09:23:42'),
(32, 6, 1, 'approved', 'vs', '2025-02-18 09:30:49'),
(33, 4, 1, 'approved', 'tedt', '2025-02-18 09:32:09'),
(34, 7, 1, 'requested', 'sad', '2025-02-18 10:13:50'),
(35, 7, 1, 'approved', 'sad', '2025-02-18 10:22:36'),
(36, 8, 1, 'requested', 'product status update', '2025-02-18 10:59:01'),
(37, 8, 1, 'approved', 'product status update', '2025-02-18 10:59:21'),
(38, 9, 12, 'requested', 'testing ECN', '2025-02-19 05:01:38'),
(39, 9, 1, 'approved', 'testing ECN', '2025-02-19 05:02:24'),
(40, 9, 1, 'requested', 'testing ECN', '2025-02-19 05:10:37'),
(41, 9, 1, 'approved', 'testing ECN', '2025-02-19 05:10:52'),
(42, 9, 1, 'requested', 'testing ECN', '2025-02-19 06:18:03'),
(43, 9, 1, 'approved', 'testing ECN', '2025-02-19 06:18:37'),
(44, 3, 1, 'requested', 'no need for changes', '2025-02-19 06:38:29'),
(45, 3, 1, 'approved', 'no need for changes', '2025-02-19 06:38:39'),
(46, 3, 1, 'reject', 'no need for changes', '2025-02-19 06:41:42'),
(47, 3, 1, 'approved', 'no need for changes', '2025-02-19 06:41:48'),
(48, 3, 1, 'requested', 'no need for changes', '2025-02-19 06:53:00'),
(49, 3, 1, 'approved', 'no need for changes', '2025-02-19 06:53:07'),
(50, 3, 1, 'requested', 'no need for changes', '2025-02-19 06:53:54'),
(51, 3, 1, 'approved', 'no need for changes', '2025-02-19 06:53:59'),
(52, 3, 1, 'requested', 'no need for changes', '2025-02-19 07:03:34'),
(53, 3, 1, 'approved', 'no need for changes', '2025-02-19 07:03:38'),
(54, 3, 1, 'requested', 'no need for changes', '2025-02-19 07:05:40'),
(55, 3, 1, 'approved', 'no need for changes', '2025-02-19 07:05:45'),
(56, 3, 1, 'requested', 'no need for changes', '2025-02-19 07:06:42'),
(57, 3, 1, 'approved', 'no need for changes', '2025-02-19 07:06:46'),
(58, 9, 1, 'requested', 'testing ECN', '2025-02-19 07:12:25'),
(59, 9, 1, 'approved', 'testing ECN', '2025-02-19 07:12:38'),
(60, 10, 12, 'requested', 'tw', '2025-02-19 07:14:11'),
(61, 10, 1, 'approved', 'tw', '2025-02-19 07:15:03'),
(62, 11, 12, 'requested', 'rfvs', '2025-02-19 07:19:25'),
(63, 11, 1, 'approved', 'rfvs', '2025-02-19 07:19:47'),
(64, 11, 1, 'requested', 'rfvs', '2025-02-19 07:25:35'),
(65, 11, 1, 'approved', 'rfvs', '2025-02-19 07:25:40'),
(66, 11, 1, 'requested', 'rfvs', '2025-02-19 07:26:35'),
(67, 11, 1, 'requested', 'rfvs', '2025-02-19 07:26:37'),
(68, 11, 1, 'approved', 'rfvs', '2025-02-19 07:26:40'),
(69, 11, 1, 'requested', 'rfvs', '2025-02-19 07:30:29'),
(70, 11, 1, 'approved', 'rfvs', '2025-02-19 07:30:36'),
(71, 11, 1, 'requested', 'rfvs', '2025-02-19 07:38:06'),
(72, 11, 1, 'approved', 'rfvs', '2025-02-19 07:38:10'),
(73, 10, 1, 'reject', 'tw', '2025-02-19 10:07:22'),
(74, 10, 1, 'approved', 'tw', '2025-02-19 10:07:29'),
(75, 11, 1, 'requested', 'rfvs', '2025-02-19 11:08:27'),
(76, 11, 1, 'approved', 'rfvs', '2025-02-19 11:12:53'),
(77, 11, 1, 'requested', 'rfvs', '2025-02-20 08:03:52'),
(78, 11, 1, 'approved', 'rfvs', '2025-02-20 08:06:04'),
(79, 12, 12, 'requested', 'test', '2025-02-21 09:09:18'),
(80, 13, 12, 'requested', 'trest', '2025-02-21 09:23:43'),
(81, 13, 1, 'approved', 'trest', '2025-02-21 09:24:34'),
(82, 12, 1, 'approved', 'test', '2025-02-22 04:30:48'),
(83, 12, 1, 'requested', 'test', '2025-02-22 04:34:37'),
(84, 12, 1, 'approved', 'test', '2025-02-22 04:34:48');

-- --------------------------------------------------------

--
-- Table structure for table `ecn_change_details`
--

CREATE TABLE `ecn_change_details` (
  `ecn_change_id` int NOT NULL,
  `ecn_id` int NOT NULL,
  `description_of_change` text NOT NULL,
  `reason_of_change` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ecn_change_details`
--

INSERT INTO `ecn_change_details` (`ecn_change_id`, `ecn_id`, `description_of_change`, `reason_of_change`) VALUES
(1, 1, 'tes', 'dfh'),
(2, 1, 'efh', 'dffbv'),
(3, 2, 'change sqaure', 'hole is missing'),
(4, 2, 'change rectangle', 'increase width'),
(5, 3, 'Transform the API response before setting the state: But the API response returns description_of_change and reason_of_change, which have different key', 'If changeDetails has the correct data but is still not showing in the frontend, then the issue is in the React component.'),
(6, 4, 'hr', 'rhr'),
(7, 4, 'erheb', 'thtth'),
(8, 5, 'The table itself and other content inside the modal will be aligned properly as flexbox ensures everything stays in place.', 'The close button remains aligned to the right with justify-end, and it has a clean hover effect.'),
(9, 5, 'I\'ve used w-full sm:w-4/5 md:w-3/4 lg:w-1/2 xl:w-1/3, which allows the modal to be responsive based on the screen size. It will take up full width on smaller screens and gradually reduce in width on larger screens.', 'Make sure the modal is horizontally and vertically centered by using flexbox with proper alignment. Adjust the width of the modal container for better responsiveness. Ensure that the table and its content are aligned properly.'),
(10, 6, 'DS', 'D'),
(11, 7, 'sdv', 'svd'),
(12, 8, 'jdfkjsd', 'sjkdvbjskbc'),
(13, 8, 'afdbfbrgb', 'fvvav'),
(14, 9, 'change1', 'Change one'),
(15, 9, 'change2', 'Change two'),
(16, 10, 'sdfvs', 'vsd'),
(17, 11, 'sv', 'vsa'),
(18, 12, 'wqer', 'fddv'),
(19, 12, 'dvs', 'adff'),
(20, 13, 'dssv', 'sv'),
(21, 13, 'vsda', 'vsd');

-- --------------------------------------------------------

--
-- Table structure for table `laser_design_upload`
--

CREATE TABLE `laser_design_upload` (
  `ldu_id` int NOT NULL,
  `product_id` int NOT NULL,
  `revision_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `laser_design_path` varchar(255) NOT NULL,
  `upload_timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `version` int DEFAULT '0',
  `comment` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `laser_design_upload`
--

INSERT INTO `laser_design_upload` (`ldu_id`, `product_id`, `revision_id`, `user_id`, `laser_design_path`, `upload_timestamp`, `version`, `comment`) VALUES
(1, 1, NULL, 7, 'D:\\JAY_PDM_DATA\\Part1\\laser_designs\\2128601192.pdf', '2025-01-24 07:01:36', 0, NULL),
(2, 3, NULL, 2, 'D:\\JAY_PDM_DATA\\Part3\\DFX\\DMS1.pdf', '2025-01-24 07:52:26', 0, NULL),
(3, 2, NULL, 2, 'D:\\JAY_PDM_DATA\\Part2\\DFX\\users.xlsx', '2025-01-24 08:06:53', 0, NULL),
(4, 2, NULL, 2, 'D:\\JAY_PDM_DATA\\Part2\\DFX\\Testing PDF for pfx.pdf', '2025-01-24 08:06:53', 0, NULL),
(5, 2, NULL, 1, 'D:\\JAY_PDM_DATA\\Part2\\DFX\\MASTER LOGIN SITE DVP 26-12-23 (2) (1) (1).pdf', '2025-01-27 06:45:21', 0, NULL),
(6, 4, NULL, 1, 'D:\\JAY_PDM_DATA\\part4\\DFX\\Create_Project_Template (3).xlsx', '2025-01-27 10:54:36', 0, NULL),
(7, 5, NULL, 1, 'D:\\JAY_PDM_DATA\\part5\\A\\DFX\\Product_Data_Management_Presentation_Enhanced (2).pptx', '2025-01-28 08:37:59', 0, NULL),
(8, 5, NULL, 1, 'D:\\JAY_PDM_DATA\\part5\\A\\DFX\\ASA-21-00-08.SLDDRW', '2025-01-28 08:45:42', 0, NULL),
(9, 9, NULL, 2, 'D:\\JAY_PDM_DATA\\part8\\C\\DFX\\users.xlsx', '2025-01-29 07:36:45', 0, NULL),
(10, 9, 4, 2, 'D:\\JAY_PDM_DATA\\part8\\C\\DFX\\WM Import File.csv', '2025-01-29 10:31:36', 0, NULL),
(11, 9, 4, 2, 'D:\\JAY_PDM_DATA\\part8\\C\\DFX\\WM Import File.csv', '2025-01-29 10:31:39', 0, NULL),
(12, 7, 5, 2, 'D:\\JAY_PDM_DATA\\part7\\B\\DFX\\angular.json', '2025-01-29 10:32:29', 0, NULL),
(13, 9, 6, 2, 'D:\\JAY_PDM_DATA\\part8\\D\\DFX\\butterfly_pattern.js', '2025-01-30 04:32:34', 0, NULL),
(14, 9, 6, 2, 'D:\\JAY_PDM_DATA\\part8\\D\\DFX\\countVowelSpecial.js', '2025-01-30 04:32:34', 0, NULL),
(15, 9, 6, 2, 'D:\\JAY_PDM_DATA\\part8\\D\\DFX\\oops.md', '2025-01-30 04:47:10', 0, NULL),
(16, 9, 6, 1, 'D:\\JAY_PDM_DATA\\part8\\D\\DFX\\Html, CSS, Bootstrap, Javascript & jQuery Notesâ.pdf', '2025-01-30 05:13:28', 0, NULL),
(17, 10, 7, 2, 'D:\\JAY_PDM_DATA\\part9\\A\\DFX\\JavaScript-Interview-Questions.pdf', '2025-01-30 06:00:28', 0, NULL),
(18, 11, 9, 2, 'D:\\JAY_PDM_DATA\\part10\\A\\DFX\\countVowelSpecial.js', '2025-01-30 09:35:21', 0, NULL),
(19, 11, 10, 1, 'D:\\JAY_PDM_DATA\\part10\\B\\DFX\\ASA-21-00-01-SS304-1.5-01.DXF', '2025-01-31 10:35:27', 0, NULL),
(20, 14, 14, 1, 'D:\\JAY_PDM_DATA\\part13\\A\\DFX\\ASA-21-00-01-SS304-1.5-01.DXF', '2025-02-06 11:21:38', 0, NULL),
(21, 15, 15, 1, 'D:\\JAY_PDM_DATA\\Demo\\A\\DFX\\DFX_v5\\ASA-21-00-01-SS304-1.5-01.DXF', '2025-02-17 06:32:56', 5, ''),
(22, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A\\DFX\\DFX\\ASA-21-00-01-SS304-1.5-01.DXF', '2025-02-19 04:43:52', 0, ''),
(23, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A\\DFX\\ASA-21-00-01-SS304-1.5-01.DXF', '2025-02-19 04:58:54', 0, ''),
(24, 16, 18, 7, 'D:\\JAY_PDM_DATA\\version Part\\A\\DFX\\ASA-21-00-01-SS304-1.5-01.DXF', '2025-02-19 05:20:10', 0, ''),
(25, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C\\DFX\\ASA-21-00-01-SS304-1.5-01.DXF', '2025-02-19 07:18:04', 0, ''),
(26, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v6\\DFX\\ASA-21-00-01-SS304-1.5-01.DXF', '2025-02-20 04:35:11', 6, ''),
(27, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v7\\DFX\\ASA-21-00-01-SS304-1.5-01.DXF', '2025-02-20 09:29:16', 7, ''),
(28, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v7\\DFX\\ASA-21-00-01-SS304-1.5-01 (1).DXF', '2025-02-20 10:35:08', 7, ''),
(29, 11, 17, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v7\\DFX\\ASA-21-00-01-SS304-1.5-01 (1).DXF', '2025-02-20 10:35:09', 7, ''),
(30, 17, 19, 7, 'D:\\JAY_PDM_DATA\\demo part\\A_v1\\DFX\\ASA-21-00-01-SS304-1.5-01.DXF', '2025-02-21 09:29:37', 1, ''),
(31, 14, 16, 7, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DFX\\ASA-21-00-01-SS304-1.5-01.DXF', '2025-02-27 05:09:51', 7, ''),
(32, 14, 16, 7, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\DFX\\ASA-21-00-01-SS304-1.5-01.DXF', '2025-02-27 05:11:19', 7, ''),
(33, 19, 21, 7, 'D:\\JAY_PDM_DATA\\new part\\A\\DFX\\ASA-21-00-01-SS304-1.5-01.DXF', '2025-02-28 10:12:34', 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `laser_upload_version`
--

CREATE TABLE `laser_upload_version` (
  `luv_id` int NOT NULL,
  `ldu_id` int NOT NULL,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `version` int NOT NULL,
  `comment` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `laser_upload_version`
--

INSERT INTO `laser_upload_version` (`luv_id`, `ldu_id`, `product_id`, `user_id`, `file_path`, `timestamp`, `version`, `comment`) VALUES
(1, 21, 15, 1, 'D:\\JAY_PDM_DATA\\Demo\\A\\DFX\\DFX_v5\\ASA-21-00-01-SS304-1.5-01.DXF', '2025-02-17 07:36:59', 5, 'dvs');

-- --------------------------------------------------------

--
-- Table structure for table `library_files`
--

CREATE TABLE `library_files` (
  `l_id` int NOT NULL,
  `user_id` int NOT NULL,
  `library_file_path` varchar(255) NOT NULL,
  `upload_timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `library_files`
--

INSERT INTO `library_files` (`l_id`, `user_id`, `library_file_path`, `upload_timestamp`) VALUES
(1, 2, 'D:\\JAY_Library_DATA\\Testing PDF for pfx.pdf', '2025-01-25 05:19:10'),
(2, 1, 'D:\\JAY_Library_DATA\\excel.csv', '2025-01-25 05:59:41'),
(3, 1, 'D:\\JAY_Library_DATA\\Dumyy.pdf', '2025-01-25 05:59:41'),
(4, 1, 'D:\\JAY_Library_DATA\\Demo PDF.pdf', '2025-01-25 05:59:41'),
(5, 1, 'D:\\JAY_Library_DATA\\users.xlsx', '2025-01-25 06:38:28'),
(6, 1, 'D:\\JAY_Library_DATA\\bubbleSort.js', '2025-01-30 10:00:33');

-- --------------------------------------------------------

--
-- Table structure for table `part_types`
--

CREATE TABLE `part_types` (
  `id` int NOT NULL,
  `type_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `part_types`
--

INSERT INTO `part_types` (`id`, `type_name`, `created_at`) VALUES
(1, 'Design', '2025-02-03 05:47:32'),
(2, 'Quotation', '2025-02-03 05:47:48'),
(3, 'Quotation & Design', '2025-02-03 05:49:00');

-- --------------------------------------------------------

--
-- Table structure for table `pdf_documents`
--

CREATE TABLE `pdf_documents` (
  `pdf_id` int NOT NULL,
  `product_id` int NOT NULL,
  `revision_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `version` int DEFAULT '0',
  `pdf_file_path` varchar(255) NOT NULL,
  `upload_timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pdf_documents`
--

INSERT INTO `pdf_documents` (`pdf_id`, `product_id`, `revision_id`, `user_id`, `version`, `pdf_file_path`, `upload_timestamp`) VALUES
(1, 1, NULL, 1, 0, 'D:\\JAY_PDM_DATA\\Part1\\pdf_documents\\MASTER LOGIN SITE DVP 26-12-23 (2) (1) (1).pdf', '2025-01-27 07:33:12'),
(2, 4, NULL, 1, 0, 'D:\\JAY_PDM_DATA\\part4\\pdf_documents\\MASTER LOGIN SITE DVP 26-12-23 (2) (1) (1).pdf', '2025-01-27 10:55:51'),
(3, 5, NULL, 1, 0, 'D:\\JAY_PDM_DATA\\part5\\A\\pdf_documents\\MASTER LOGIN SITE DVP 26-12-23 (2) (1) (1).pdf', '2025-01-28 08:52:03'),
(4, 9, NULL, 2, 0, 'D:\\JAY_PDM_DATA\\part8\\C\\pdf_documents\\WorkId-3-Consolidated Estimates-SSR2022-2023.pdf', '2025-01-29 07:37:19'),
(5, 9, 4, 2, 0, 'D:\\JAY_PDM_DATA\\part8\\C\\pdf_documents\\MASTER LOGIN SITE DVP 26-12-23 (2) (1).pdf', '2025-01-29 11:08:43'),
(6, 9, 6, 2, 0, 'D:\\JAY_PDM_DATA\\part8\\D\\pdf_documents\\Javascript 20-03-2024.pdf', '2025-01-30 04:32:46'),
(7, 10, 1, 2, 0, 'D:\\JAY_PDM_DATA\\part9\\A\\pdf_documents\\JavaScript-Interview-Questions.pdf', '2025-01-30 06:00:58'),
(8, 11, 1, 2, 0, 'D:\\JAY_PDM_DATA\\part10\\A\\pdf_documents\\matrix.pdf', '2025-01-30 09:36:25'),
(9, 11, 3, 1, 0, 'D:\\JAY_PDM_DATA\\part10\\B\\pdf_documents\\MASTER LOGIN SITE DVP 26-12-23 (2) (1) (1) (1).pdf', '2025-02-04 07:09:20'),
(10, 13, 1, 1, 0, 'D:\\JAY_PDM_DATA\\part12\\A\\pdf_documents\\MASTER LOGIN SITE DVP 26-12-23 (2) (1) (1) (1).pdf', '2025-02-04 07:23:58'),
(11, 13, 12, 1, 0, 'D:\\JAY_PDM_DATA\\part12\\A\\pdf_documents\\ECN.pdf', '2025-02-04 07:34:00'),
(12, 13, 13, 1, 0, 'D:\\JAY_PDM_DATA\\part12\\B\\pdf_documents\\ECN.pdf', '2025-02-05 04:29:44'),
(13, 13, 13, 1, 0, 'D:\\JAY_PDM_DATA\\part12\\B\\pdf_documents\\MASTER LOGIN SITE DVP 26-12-23 (2) (2) (1).pdf', '2025-02-05 04:29:44'),
(14, 13, 13, 1, 0, 'D:\\JAY_PDM_DATA\\part12\\B\\pdf_documents\\MASTER LOGIN SITE DVP 26-12-23 (2) (1) (1) (2).pdf', '2025-02-05 04:29:44'),
(15, 15, 15, 1, 0, 'D:\\JAY_PDM_DATA\\Demo\\A\\pdf_documents\\MASTER LOGIN SITE DVP 26-12-23 (2) (1) (1) (2).pdf', '2025-02-06 04:38:16'),
(16, 15, 15, 1, 0, 'D:\\JAY_PDM_DATA\\Demo\\A\\pdf_documents\\MASTER LOGIN SITE DVP 26-12-23 (2) (2).pdf', '2025-02-06 04:38:16'),
(17, 16, 18, 7, 0, 'D:\\JAY_PDM_DATA\\version Part\\A\\pdf_documents\\table_data.pdf', '2025-02-19 04:44:07'),
(18, 11, 17, 7, 0, 'D:\\JAY_PDM_DATA\\part10\\C\\pdf_documents\\table_data (1).pdf', '2025-02-19 07:18:17'),
(19, 11, 17, 7, 6, 'D:\\JAY_PDM_DATA\\part10\\C_v6\\pdf_documents\\test encrypted (1).pdf', '2025-02-20 04:58:35'),
(20, 11, 17, 7, 7, 'D:\\JAY_PDM_DATA\\part10\\C_v7\\pdf_documents\\test encrypted (1).pdf', '2025-02-20 09:29:26'),
(21, 17, 19, 7, 1, 'D:\\JAY_PDM_DATA\\demo part\\A_v1\\pdf_documents\\table_data (3).pdf', '2025-02-21 09:29:48'),
(22, 14, 16, 7, 7, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\pdf_documents\\table_data (3).pdf', '2025-02-27 05:14:47'),
(23, 19, 21, 7, 0, 'D:\\JAY_PDM_DATA\\new part\\A\\pdf_documents\\logo-pdf.pdf', '2025-02-28 10:12:56');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `comments` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('pending','in_progress','under_review','on_hold','completed') NOT NULL DEFAULT 'pending',
  `product_version` int DEFAULT '0',
  `user_id` int DEFAULT NULL,
  `revision` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `comments`, `created_at`, `updated_at`, `status`, `product_version`, `user_id`, `revision`, `type`) VALUES
(1, 'Part1', 'first part', '2025-01-24 05:11:37', '2025-01-29 05:27:25', 'completed', 1, 1, 'A', NULL),
(2, 'Part2', 'second part', '2025-01-24 05:30:37', '2025-02-06 11:34:18', 'completed', 0, 2, 'A', NULL),
(3, 'Part3', 'third part', '2025-01-24 05:43:04', '2025-01-29 05:27:17', 'on_hold', 0, 2, 'B', NULL),
(4, 'part4', 'test', '2025-01-27 10:50:25', '2025-01-29 05:25:27', 'under_review', 1, 1, 'A', NULL),
(5, 'part5', 'test', '2025-01-28 07:31:10', '2025-01-29 04:29:55', 'in_progress', 1, 1, 'A', NULL),
(6, 'part6', 'tesdt', '2025-01-29 06:12:29', '2025-01-29 06:12:29', 'pending', 0, 1, 'A', NULL),
(7, 'part7', 'fwe', '2025-01-29 06:15:07', '2025-02-06 11:34:04', 'completed', 0, 1, 'B', NULL),
(9, 'part8', 'qewds', '2025-01-29 06:39:23', '2025-01-30 12:16:42', 'in_progress', 0, 2, 'D', NULL),
(10, 'part9', 'test', '2025-01-30 05:59:42', '2025-02-18 10:59:21', 'pending', 0, 2, 'B', NULL),
(11, 'part10', 'test', '2025-01-30 09:28:09', '2025-02-22 04:30:48', 'pending', 0, 2, 'C', NULL),
(12, 'part11', 'sfgrv', '2025-02-03 06:22:28', '2025-02-19 07:15:03', 'pending', 0, 13, 'A', 'Design'),
(13, 'part12', 'gdvf', '2025-02-03 06:39:54', '2025-02-18 09:30:49', 'pending', 0, 13, 'B', 'Quotation & Design'),
(14, 'part13', 'test', '2025-02-05 09:56:55', '2025-02-27 05:14:47', 'under_review', 3, 13, 'B', 'Design'),
(15, 'Demo', 'testing', '2025-02-06 04:22:33', '2025-02-21 11:27:03', 'completed', 0, 13, 'A', 'Quotation'),
(16, 'version Part', 'test', '2025-02-19 04:36:04', '2025-02-21 11:22:54', 'completed', 0, 13, 'A', 'Design'),
(17, 'demo part', 'testing', '2025-02-21 09:10:41', '2025-02-21 11:27:46', 'completed', 0, 13, 'A', 'Design'),
(18, 'Akash', 'revs', '2025-02-27 05:46:24', '2025-02-27 05:46:24', 'pending', 0, 13, 'A', 'Design'),
(19, 'new part', 'test', '2025-02-28 10:08:38', '2025-02-28 10:13:09', 'completed', 0, 13, 'A', 'Design');

-- --------------------------------------------------------

--
-- Table structure for table `product_activity_logs`
--

CREATE TABLE `product_activity_logs` (
  `pal_id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `action` enum('add','remove') NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_activity_logs`
--

INSERT INTO `product_activity_logs` (`pal_id`, `user_id`, `product_id`, `action`, `file_path`, `timestamp`) VALUES
(1, 7, 15, 'remove', NULL, '2025-02-06 11:10:52'),
(2, 7, 2, 'remove', NULL, '2025-02-06 11:34:19'),
(3, 7, 13, 'remove', NULL, '2025-02-11 05:20:15'),
(4, 7, 10, 'remove', NULL, '2025-02-17 09:21:12'),
(5, 7, 11, 'remove', NULL, '2025-02-18 09:43:41'),
(6, 7, 16, 'remove', NULL, '2025-02-19 04:59:44'),
(7, 7, 12, 'remove', NULL, '2025-02-19 07:13:44'),
(8, 7, 11, 'remove', NULL, '2025-02-19 07:18:53'),
(9, 11, 11, 'remove', NULL, '2025-02-19 09:57:07'),
(10, 2, 11, 'remove', NULL, '2025-02-19 09:57:10'),
(12, 7, 11, 'remove', NULL, '2025-02-20 08:06:04'),
(13, 7, 11, 'remove', NULL, '2025-02-20 10:37:20'),
(14, 12, 17, 'remove', NULL, '2025-02-21 09:17:40'),
(15, 13, 17, 'remove', NULL, '2025-02-21 09:17:48'),
(16, 7, 17, 'remove', NULL, '2025-02-21 09:19:38'),
(17, 7, 17, 'remove', NULL, '2025-02-21 09:31:30'),
(18, 7, 16, 'remove', NULL, '2025-02-21 11:04:25'),
(19, 12, 16, 'remove', NULL, '2025-02-21 11:22:39'),
(20, 12, 16, 'add', NULL, '2025-02-21 11:22:48'),
(21, 12, 16, 'add', NULL, '2025-02-21 11:22:54'),
(22, 12, 17, 'remove', NULL, '2025-02-21 11:23:32'),
(23, 12, 17, 'add', NULL, '2025-02-21 11:24:06'),
(24, 7, 17, 'remove', NULL, '2025-02-21 11:24:12'),
(25, 12, 17, 'add', NULL, '2025-02-21 11:24:12'),
(26, 12, 15, 'remove', NULL, '2025-02-21 11:26:56'),
(27, 12, 17, 'remove', NULL, '2025-02-21 11:27:26'),
(28, 12, 17, 'add', NULL, '2025-02-21 11:27:35'),
(29, 12, 17, 'remove', NULL, '2025-02-21 11:27:39'),
(30, 12, 17, 'add', NULL, '2025-02-21 11:27:46'),
(31, 12, 16, 'remove', NULL, '2025-02-21 11:27:55'),
(33, 7, 11, 'remove', NULL, '2025-02-22 04:30:48'),
(34, 12, 14, 'add', NULL, '2025-02-27 05:14:19'),
(35, 7, 19, 'remove', NULL, '2025-02-28 10:10:42'),
(36, 12, 19, 'add', NULL, '2025-02-28 10:10:42'),
(37, 12, 19, 'add', NULL, '2025-02-28 10:11:18'),
(38, 12, 19, 'remove', NULL, '2025-02-28 10:11:22'),
(39, 7, 19, 'remove', NULL, '2025-02-28 10:13:09'),
(40, 12, 19, 'add', NULL, '2025-02-28 10:13:10');

-- --------------------------------------------------------

--
-- Table structure for table `product_assignments`
--

CREATE TABLE `product_assignments` (
  `pa_id` int NOT NULL,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_assignments`
--

INSERT INTO `product_assignments` (`pa_id`, `product_id`, `user_id`, `assigned_at`) VALUES
(1, 1, 2, '2025-01-24 05:11:37'),
(2, 1, 7, '2025-01-24 05:11:37'),
(3, 1, 9, '2025-01-24 05:11:37'),
(4, 2, 2, '2025-01-24 05:30:37'),
(6, 2, 9, '2025-01-24 05:30:37'),
(7, 3, 2, '2025-01-24 05:43:04'),
(8, 3, 7, '2025-01-24 05:43:04'),
(9, 4, 2, '2025-01-27 10:50:25'),
(10, 4, 6, '2025-01-28 04:29:03'),
(11, 5, 2, '2025-01-28 07:31:10'),
(12, 5, 4, '2025-01-28 09:44:47'),
(13, 5, 11, '2025-01-28 10:42:49'),
(14, 5, 12, '2025-01-28 10:56:17'),
(15, 7, 2, '2025-01-29 06:15:07'),
(16, 9, 3, '2025-01-29 06:39:23'),
(17, 9, 2, '2025-01-29 06:39:23'),
(18, 9, 11, '2025-01-30 05:19:45'),
(19, 10, 2, '2025-01-30 05:59:42'),
(20, 10, 11, '2025-01-30 05:59:42'),
(22, 10, 12, '2025-01-30 06:02:26'),
(23, 10, 9, '2025-01-30 06:03:20'),
(27, 9, 7, '2025-01-30 12:16:27'),
(28, 11, 13, '2025-02-03 04:38:25'),
(30, 12, 12, '2025-02-03 06:22:28'),
(31, 13, 13, '2025-02-03 06:39:54'),
(33, 13, 12, '2025-02-03 06:39:54'),
(34, 14, 13, '2025-02-05 09:56:55'),
(35, 14, 7, '2025-02-05 09:56:55'),
(36, 14, 12, '2025-02-05 09:56:55'),
(37, 15, 13, '2025-02-06 04:22:34'),
(40, 15, 2, '2025-02-06 10:37:20'),
(41, 14, 4, '2025-02-18 05:08:11'),
(42, 13, 7, '2025-02-18 09:15:30'),
(43, 16, 13, '2025-02-19 04:36:04'),
(48, 11, 12, '2025-02-19 07:19:16'),
(63, 17, 12, '2025-02-21 11:27:46'),
(64, 14, 12, '2025-02-27 05:14:19'),
(65, 18, 13, '2025-02-27 05:46:24'),
(66, 18, 7, '2025-02-27 05:46:24'),
(67, 19, 13, '2025-02-28 10:08:38'),
(72, 19, 12, '2025-02-28 10:13:09');

-- --------------------------------------------------------

--
-- Table structure for table `product_documents`
--

CREATE TABLE `product_documents` (
  `pd_id` int NOT NULL,
  `product_id` int NOT NULL,
  `revision_id` int DEFAULT NULL,
  `file_path` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_documents`
--

INSERT INTO `product_documents` (`pd_id`, `product_id`, `revision_id`, `file_path`, `created_at`) VALUES
(1, 2, NULL, 'D:\\JAY_PDM_DATA\\Part2\\MASTER LOGIN SITE DVP 26-12-23 (2) (1).pdf', '2025-01-24 05:30:37'),
(2, 2, NULL, 'D:\\JAY_PDM_DATA\\Part2\\WorkId-3-Consolidated Estimates-SSR2022-2023.pdf', '2025-01-24 05:30:37'),
(3, 2, NULL, 'D:\\JAY_PDM_DATA\\Part2\\2128601192.pdf', '2025-01-24 05:30:37'),
(4, 3, NULL, 'D:\\JAY_PDM_DATA\\Part3\\Customer Documents\\MASTER LOGIN SITE DVP 26-12-23 (2) (2).pdf', '2025-01-24 05:43:04'),
(5, 3, NULL, 'D:\\JAY_PDM_DATA\\Part3\\Customer Documents\\data.xlsx', '2025-01-24 05:43:04'),
(6, 3, NULL, 'D:\\JAY_PDM_DATA\\Part3\\Customer Documents\\MASTER LOGIN SITE DVP 26-12-23 (1) (1).pptx', '2025-01-24 05:43:04'),
(7, 4, NULL, 'D:\\JAY_PDM_DATA\\part4\\Customer Documents\\MASTER LOGIN SITE DVP 26-12-23 (2) (1) (1).pdf', '2025-01-27 10:50:25'),
(8, 4, NULL, 'D:\\JAY_PDM_DATA\\part4\\Customer Documents\\users.xlsx', '2025-01-27 10:50:25'),
(9, 5, NULL, 'D:\\JAY_PDM_DATA\\part5\\A\\Customer Documents\\MASTER LOGIN SITE DVP 26-12-23 (2) (1).pdf', '2025-01-28 07:31:10'),
(10, 5, NULL, 'D:\\JAY_PDM_DATA\\part5\\A\\Customer Documents\\Create Project template (3).xlsx', '2025-01-28 07:31:10'),
(11, 7, NULL, 'D:\\JAY_PDM_DATA\\part7\\A\\Customer Documents\\WhatsApp Image 2025-01-18 at 4.01.48 PM.jpeg', '2025-01-29 06:15:07'),
(12, 7, NULL, 'D:\\JAY_PDM_DATA\\part7\\A\\Customer Documents\\MASTER LOGIN SITE DVP 26-12-23 (2) (1) (1).pdf', '2025-01-29 06:15:07'),
(13, 9, 3, 'D:\\JAY_PDM_DATA\\part8\\B\\Customer Documents\\users.xlsx', '2025-01-29 06:39:23'),
(14, 9, 3, 'D:\\JAY_PDM_DATA\\part8\\B\\Customer Documents\\2128601192 (1).pdf', '2025-01-29 06:39:23'),
(15, 9, 4, 'D:\\JAY_PDM_DATA\\part8\\C\\Create Project template.xlsx', '2025-01-29 07:34:27'),
(16, 9, 4, 'D:\\JAY_PDM_DATA\\part8\\C\\2128601192.pdf', '2025-01-29 07:34:27'),
(17, 9, 4, 'D:\\JAY_PDM_DATA\\part8\\C\\test encrypted.pdf', '2025-01-29 07:34:27'),
(18, 7, 5, 'D:\\JAY_PDM_DATA\\part7\\B\\Customer Documents\\MASTER LOGIN SITE DVP 26-12-23 (2) (1) (1) (1).pdf', '2025-01-29 07:41:58'),
(19, 7, 5, 'D:\\JAY_PDM_DATA\\part7\\B\\Customer Documents\\MASTER LOGIN SITE DVP 26-12-23 (2) (1) (1).pdf', '2025-01-29 07:41:58'),
(20, 7, 5, 'D:\\JAY_PDM_DATA\\part7\\B\\Customer Documents\\2128601192 (1).pdf', '2025-01-29 07:41:58'),
(21, 9, 6, 'D:\\JAY_PDM_DATA\\part8\\D\\Customer Documents\\Create Project template (4) (3).xlsx', '2025-01-30 04:31:36'),
(22, 9, 6, 'D:\\JAY_PDM_DATA\\part8\\D\\Customer Documents\\WhatsApp Image 2025-01-18 at 4.01.48 PM.jpeg', '2025-01-30 04:31:37'),
(23, 10, 7, 'D:\\JAY_PDM_DATA\\part9\\A\\Customer Documents\\100 JavaScript Interview QnA.pdf', '2025-01-30 05:59:42'),
(24, 10, 7, 'D:\\JAY_PDM_DATA\\part9\\A\\Customer Documents\\Akash Javascript Notes.pdf', '2025-01-30 05:59:42'),
(25, 10, 8, 'D:\\JAY_PDM_DATA\\part9\\B\\Customer Documents\\Html, CSS, Bootstrap, Javascript & jQuery Notesâ.pdf', '2025-01-30 06:04:52'),
(26, 10, 8, 'D:\\JAY_PDM_DATA\\part9\\B\\Customer Documents\\Javascript 20-03-2024.pdf', '2025-01-30 06:04:52'),
(27, 10, 8, 'D:\\JAY_PDM_DATA\\part9\\B\\Customer Documents\\JavaScript-Interview-Questions.pdf', '2025-01-30 06:04:52'),
(28, 11, 9, 'D:\\JAY_PDM_DATA\\part10\\A\\Customer Documents\\Html, CSS, Bootstrap, Javascript & jQuery Notesâ.pdf', '2025-01-30 09:28:09'),
(29, 11, 9, 'D:\\JAY_PDM_DATA\\part10\\A\\Customer Documents\\Javascript 20-03-2024.pdf', '2025-01-30 09:28:09'),
(30, 11, 9, 'D:\\JAY_PDM_DATA\\part10\\A\\Customer Documents\\JavaScript-Interview-Questions.pdf', '2025-01-30 09:28:09'),
(31, 11, 10, 'D:\\JAY_PDM_DATA\\part10\\B\\Customer Documents\\MASTER LOGIN SITE DVP 26-12-23 (2) (2).pdf', '2025-01-30 09:40:03'),
(32, 11, 10, 'D:\\JAY_PDM_DATA\\part10\\B\\Customer Documents\\MASTER LOGIN SITE DVP 26-12-23 (1) (1).pptx', '2025-01-30 09:40:03'),
(33, 11, 10, 'D:\\JAY_PDM_DATA\\part10\\B\\Customer Documents\\MASTER LOGIN SITE DVP 26-12-23 (2) (1).pdf', '2025-01-30 09:40:03'),
(34, 12, 11, 'D:\\JAY_PDM_DATA\\part11\\A\\Customer Documents\\Bali 05N_06D Amazing Honeymoon pacakge   (1).pdf', '2025-02-03 06:22:28'),
(35, 13, 12, 'D:\\JAY_PDM_DATA\\part12\\A\\Customer Documents\\Bali 05N_06D Amazing Honeymoon pacakge   (1).pdf', '2025-02-03 06:39:54'),
(36, 13, 13, 'D:\\JAY_PDM_DATA\\part12\\B\\Customer Documents\\countVowelSpecial.js', '2025-02-04 09:11:24'),
(37, 13, 13, 'D:\\JAY_PDM_DATA\\part12\\B\\Customer Documents\\ECN.pdf', '2025-02-04 09:11:24'),
(38, 13, 13, 'D:\\JAY_PDM_DATA\\part12\\B\\Customer Documents\\[filtername].tsx', '2025-02-04 09:11:24'),
(39, 14, 14, 'D:\\JAY_PDM_DATA\\part13\\A\\Customer Documents\\ECN (1).pdf', '2025-02-05 09:56:55'),
(40, 14, 14, 'D:\\JAY_PDM_DATA\\part13\\A\\Customer Documents\\countVowelSpecial.js', '2025-02-05 09:56:55'),
(41, 15, 15, 'D:\\JAY_PDM_DATA\\Demo\\A\\Customer Documents\\ECN (1).pdf', '2025-02-06 04:22:33'),
(42, 15, 15, 'D:\\JAY_PDM_DATA\\Demo\\A\\Customer Documents\\countVowelSpecial.js', '2025-02-06 04:22:33'),
(43, 15, 15, 'D:\\JAY_PDM_DATA\\Demo\\A\\Customer Documents\\ASA-21-00-01-SS304-1.5-01 (1).DXF', '2025-02-06 04:22:33'),
(44, 14, 16, 'D:\\JAY_PDM_DATA\\part13\\B\\Customer Documents\\table_data.pdf', '2025-02-17 09:24:57'),
(45, 14, 16, 'D:\\JAY_PDM_DATA\\part13\\B\\Customer Documents\\ECN (1).pdf', '2025-02-17 09:24:57'),
(46, 11, 17, 'D:\\JAY_PDM_DATA\\part10\\C\\Customer Documents\\Chaitrali Jogade OJT Certificate.pdf', '2025-02-18 09:44:05'),
(47, 11, 17, 'D:\\JAY_PDM_DATA\\part10\\C\\Customer Documents\\On the Job Training Certificate.pdf', '2025-02-18 09:44:05'),
(48, 11, 17, 'D:\\JAY_PDM_DATA\\part10\\C\\Customer Documents\\Chaitrali Jogade Provisca Certificate.pdf', '2025-02-18 09:44:05'),
(49, 16, 18, 'D:\\JAY_PDM_DATA\\version Part\\A\\Customer Documents\\test encrypted (1).pdf', '2025-02-19 04:36:04'),
(50, 16, 18, 'D:\\JAY_PDM_DATA\\version Part\\A\\Customer Documents\\On the Job Training Certificate.pdf', '2025-02-19 04:36:04'),
(51, 16, 18, 'D:\\JAY_PDM_DATA\\version Part\\A\\Customer Documents\\sample (1).xlsx', '2025-02-19 04:36:04'),
(52, 17, 19, 'D:\\JAY_PDM_DATA\\demo part\\A\\Customer Documents\\tax_invoice_100.pdf', '2025-02-21 09:10:41'),
(53, 17, 19, 'D:\\JAY_PDM_DATA\\demo part\\A\\Customer Documents\\table_data (3).pdf', '2025-02-21 09:10:41'),
(54, 18, 20, 'D:\\JAY_PDM_DATA\\Akash\\A\\Customer Documents\\44672 Akash Sunil Shinde (2).pdf', '2025-02-27 05:46:24'),
(55, 18, 20, 'D:\\JAY_PDM_DATA\\Akash\\A\\Customer Documents\\44672 Akash Sunil Shinde.pdf', '2025-02-27 05:46:24'),
(56, 14, 16, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\Customer Documents\\users.xlsx', '2025-02-27 06:57:04'),
(57, 14, 16, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\Customer Documents\\Testing PDF for pfx.pdf', '2025-02-27 06:57:04'),
(58, 14, 16, 'D:\\JAY_PDM_DATA\\part13\\B_v7\\Customer Documents\\logo-png.png', '2025-02-27 07:28:56'),
(59, 19, 21, 'D:\\JAY_PDM_DATA\\new part\\A\\Customer Documents\\logo-transparent-pdf.pdf', '2025-02-28 10:08:38'),
(60, 19, 21, 'D:\\JAY_PDM_DATA\\new part\\A\\Customer Documents\\logo-transparent-svg.svg', '2025-02-28 10:08:38');

-- --------------------------------------------------------

--
-- Table structure for table `product_status_activity`
--

CREATE TABLE `product_status_activity` (
  `psa_id` int NOT NULL,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `previous_status` varchar(255) NOT NULL,
  `updated_status` varchar(255) NOT NULL,
  `activity_timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_status_activity`
--

INSERT INTO `product_status_activity` (`psa_id`, `product_id`, `user_id`, `previous_status`, `updated_status`, `activity_timestamp`) VALUES
(1, 1, 2, 'pending', 'in_progress', '2025-01-24 05:54:13'),
(2, 5, 1, 'pending', 'in_progress', '2025-01-29 04:29:55'),
(3, 4, 1, 'pending', 'under_review', '2025-01-29 05:25:00'),
(4, 4, 1, 'under_review', 'pending', '2025-01-29 05:25:14'),
(5, 4, 1, 'pending', 'under_review', '2025-01-29 05:25:27'),
(6, 3, 1, 'pending', 'on_hold', '2025-01-29 05:27:17'),
(7, 1, 1, 'in_progress', 'completed', '2025-01-29 05:27:25'),
(8, 10, 1, 'pending', 'in_progress', '2025-01-30 09:26:13'),
(9, 14, 1, 'under_review', 'completed', '2025-02-05 10:14:49'),
(10, 13, 1, 'under_review', 'in_progress', '2025-02-05 11:02:32'),
(11, 15, 1, 'pending', 'completed', '2025-02-06 10:46:20'),
(12, 15, 1, 'completed', 'under_review', '2025-02-06 10:52:35'),
(13, 15, 1, 'under_review', 'completed', '2025-02-06 10:52:47'),
(14, 13, 1, 'in_progress', 'completed', '2025-02-06 10:56:22'),
(15, 14, 1, 'completed', 'in_progress', '2025-02-06 10:59:30'),
(16, 14, 1, 'in_progress', 'completed', '2025-02-06 10:59:38'),
(17, 14, 1, 'completed', 'in_progress', '2025-02-06 11:01:39'),
(18, 14, 1, 'in_progress', 'completed', '2025-02-06 11:01:57'),
(19, 15, 1, 'completed', 'in_progress', '2025-02-06 11:08:03'),
(20, 15, 1, 'in_progress', 'completed', '2025-02-06 11:08:12'),
(21, 15, 1, 'completed', 'in_progress', '2025-02-06 11:09:29'),
(22, 15, 1, 'in_progress', 'completed', '2025-02-06 11:09:36'),
(23, 15, 1, 'completed', 'in_progress', '2025-02-06 11:10:44'),
(24, 15, 1, 'in_progress', 'completed', '2025-02-06 11:10:52'),
(25, 14, 1, 'completed', 'in_progress', '2025-02-06 11:19:53'),
(26, 14, 1, 'in_progress', 'completed', '2025-02-06 11:22:15'),
(27, 15, 1, 'completed', 'on_hold', '2025-02-06 11:32:13'),
(28, 15, 1, 'on_hold', 'completed', '2025-02-06 11:32:18'),
(29, 14, 1, 'completed', 'in_progress', '2025-02-06 11:32:39'),
(30, 14, 1, 'in_progress', 'completed', '2025-02-06 11:32:44'),
(31, 7, 1, 'pending', 'completed', '2025-02-06 11:34:04'),
(32, 2, 1, 'pending', 'completed', '2025-02-06 11:34:18'),
(33, 13, 1, 'completed', 'under_review', '2025-02-11 05:15:18'),
(34, 13, 1, 'under_review', 'completed', '2025-02-11 05:16:15'),
(35, 13, 1, 'completed', 'in_progress', '2025-02-11 05:17:42'),
(36, 13, 1, 'in_progress', 'completed', '2025-02-11 05:17:56'),
(37, 13, 1, 'completed', 'on_hold', '2025-02-11 05:19:55'),
(38, 13, 1, 'on_hold', 'completed', '2025-02-11 05:20:13'),
(39, 10, 1, 'in_progress', 'completed', '2025-02-17 09:21:12'),
(40, 11, 1, 'under_review', 'completed', '2025-02-18 09:43:40'),
(41, 16, 1, 'under_review', 'completed', '2025-02-19 04:45:44'),
(42, 16, 1, 'completed', 'in_progress', '2025-02-19 04:54:01'),
(43, 16, 1, 'under_review', 'completed', '2025-02-19 04:59:44'),
(44, 12, 1, 'under_review', 'completed', '2025-02-19 07:13:43'),
(45, 11, 1, 'under_review', 'completed', '2025-02-19 07:18:52'),
(46, 11, 1, 'completed', 'under_review', '2025-02-20 10:37:11'),
(47, 11, 1, 'under_review', 'completed', '2025-02-20 10:37:19'),
(48, 17, 1, 'under_review', 'completed', '2025-02-21 09:19:37'),
(49, 17, 1, 'under_review', 'completed', '2025-02-21 09:31:30'),
(50, 16, 1, 'pending', 'completed', '2025-02-21 11:04:24'),
(51, 16, 1, 'completed', 'under_review', '2025-02-21 11:11:50'),
(52, 16, 1, 'under_review', 'completed', '2025-02-21 11:12:03'),
(53, 16, 1, 'completed', 'under_review', '2025-02-21 11:22:48'),
(54, 16, 1, 'under_review', 'completed', '2025-02-21 11:22:54'),
(55, 17, 1, 'completed', 'on_hold', '2025-02-21 11:24:06'),
(56, 17, 1, 'on_hold', 'completed', '2025-02-21 11:24:12'),
(57, 15, 1, 'pending', 'completed', '2025-02-21 11:27:03'),
(58, 17, 1, 'completed', 'under_review', '2025-02-21 11:27:34'),
(59, 17, 1, 'under_review', 'completed', '2025-02-21 11:27:46'),
(60, 14, 1, 'under_review', 'in_progress', '2025-02-27 05:14:19'),
(61, 19, 1, 'under_review', 'completed', '2025-02-28 10:10:41'),
(62, 19, 1, 'completed', 'in_progress', '2025-02-28 10:11:17'),
(63, 19, 1, 'under_review', 'completed', '2025-02-28 10:13:09');

-- --------------------------------------------------------

--
-- Table structure for table `revision`
--

CREATE TABLE `revision` (
  `r_id` int NOT NULL,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `revision` varchar(255) DEFAULT NULL,
  `revision_folder_path` varchar(255) NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `revision`
--

INSERT INTO `revision` (`r_id`, `product_id`, `user_id`, `revision`, `revision_folder_path`, `timestamp`) VALUES
(1, 7, 1, 'A', 'D:\\JAY_PDM_DATA\\part7\\A', '2025-01-29 06:15:07'),
(3, 9, 2, 'B', 'D:\\JAY_PDM_DATA\\part8\\B', '2025-01-29 06:39:23'),
(4, 9, 2, 'C', 'D:\\JAY_PDM_DATA\\part8\\C', '2025-01-29 07:34:27'),
(5, 7, 2, 'B', 'D:\\JAY_PDM_DATA\\part7\\B', '2025-01-29 07:41:58'),
(6, 9, 2, 'D', 'D:\\JAY_PDM_DATA\\part8\\D', '2025-01-30 04:31:35'),
(7, 10, 2, 'A', 'D:\\JAY_PDM_DATA\\part9\\A', '2025-01-30 05:59:42'),
(8, 10, 2, 'B', 'D:\\JAY_PDM_DATA\\part9\\B', '2025-01-30 06:04:52'),
(9, 11, 2, 'A', 'D:\\JAY_PDM_DATA\\part10\\A', '2025-01-30 09:28:09'),
(10, 11, 2, 'B', 'D:\\JAY_PDM_DATA\\part10\\B', '2025-01-30 09:40:02'),
(11, 12, 13, 'A', 'D:\\JAY_PDM_DATA\\part11\\A', '2025-02-03 06:22:28'),
(12, 13, 13, 'A', 'D:\\JAY_PDM_DATA\\part12\\A', '2025-02-03 06:39:54'),
(13, 13, 1, 'B', 'D:\\JAY_PDM_DATA\\part12\\B', '2025-02-04 09:11:24'),
(14, 14, 13, 'A', 'D:\\JAY_PDM_DATA\\part13\\A', '2025-02-05 09:56:55'),
(15, 15, 13, 'A', 'D:\\JAY_PDM_DATA\\Demo\\A', '2025-02-06 04:22:33'),
(16, 14, 13, 'B', 'D:\\JAY_PDM_DATA\\part13\\B', '2025-02-17 09:24:57'),
(17, 11, 13, 'C', 'D:\\JAY_PDM_DATA\\part10\\C', '2025-02-18 09:44:05'),
(18, 16, 13, 'A', 'D:\\JAY_PDM_DATA\\version Part\\A', '2025-02-19 04:36:04'),
(19, 17, 13, 'A', 'D:\\JAY_PDM_DATA\\demo part\\A', '2025-02-21 09:10:41'),
(20, 18, 13, 'A', 'D:\\JAY_PDM_DATA\\Akash\\A', '2025-02-27 05:46:24'),
(21, 19, 13, 'A', 'D:\\JAY_PDM_DATA\\new part\\A', '2025-02-28 10:08:38');

-- --------------------------------------------------------

--
-- Table structure for table `revision_version`
--

CREATE TABLE `revision_version` (
  `rvid` int NOT NULL,
  `r_id` int NOT NULL,
  `version_folder_path` varchar(255) NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `version` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `revision_version`
--

INSERT INTO `revision_version` (`rvid`, `r_id`, `version_folder_path`, `timestamp`, `version`) VALUES
(1, 13, 'D:\\JAY_PDM_DATA\\part12\\B_v1', '2025-02-18 10:22:36', 'B_v1'),
(2, 8, 'D:\\JAY_PDM_DATA\\part9\\B\\v1', '2025-02-18 10:59:21', '1'),
(3, 18, 'D:\\JAY_PDM_DATA\\version Part\\A\\v1', '2025-02-19 05:02:24', '1'),
(4, 18, 'D:\\JAY_PDM_DATA\\version Part\\A_v2', '2025-02-19 05:10:52', '2'),
(5, 18, 'D:\\JAY_PDM_DATA\\version Part\\A_v3', '2025-02-19 06:18:37', '3'),
(6, 16, 'D:\\JAY_PDM_DATA\\part13\\B_v1', '2025-02-19 06:38:39', '1'),
(7, 16, 'D:\\JAY_PDM_DATA\\part13\\B_v2', '2025-02-19 06:41:48', '2'),
(8, 16, 'D:\\JAY_PDM_DATA\\part13\\B_v3', '2025-02-19 06:53:07', '3'),
(9, 16, 'D:\\JAY_PDM_DATA\\part13\\B_v4', '2025-02-19 06:53:59', '4'),
(10, 16, 'D:\\JAY_PDM_DATA\\part13\\B_v5', '2025-02-19 07:03:38', '5'),
(11, 16, 'D:\\JAY_PDM_DATA\\part13\\B_v6', '2025-02-19 07:05:45', '6'),
(12, 16, 'D:\\JAY_PDM_DATA\\part13\\B_v7', '2025-02-19 07:06:46', '7'),
(13, 18, 'D:\\JAY_PDM_DATA\\version Part\\A_v4', '2025-02-19 07:12:38', '4'),
(14, 11, 'D:\\JAY_PDM_DATA\\part11\\A_v1', '2025-02-19 07:15:03', '1'),
(15, 17, 'D:\\JAY_PDM_DATA\\part10\\C_v1', '2025-02-19 07:19:46', '1'),
(16, 17, 'D:\\JAY_PDM_DATA\\part10\\C_v2', '2025-02-19 07:25:40', '2'),
(17, 17, 'D:\\JAY_PDM_DATA\\part10\\C_v3', '2025-02-19 07:26:40', '3'),
(18, 17, 'D:\\JAY_PDM_DATA\\part10\\C_v4', '2025-02-19 07:30:36', '4'),
(19, 17, 'D:\\JAY_PDM_DATA\\part10\\C_v5', '2025-02-19 07:38:10', '5'),
(20, 11, 'D:\\JAY_PDM_DATA\\part11\\A_v2', '2025-02-19 10:07:29', '2'),
(21, 17, 'D:\\JAY_PDM_DATA\\part10\\C_v6', '2025-02-19 11:12:53', '6'),
(22, 17, 'D:\\JAY_PDM_DATA\\part10\\C_v7', '2025-02-20 08:06:04', '7'),
(23, 19, 'D:\\JAY_PDM_DATA\\demo part\\A_v1', '2025-02-21 09:24:34', '1'),
(25, 17, 'D:\\JAY_PDM_DATA\\part10\\C_v8', '2025-02-22 04:30:48', '8'),
(26, 17, 'D:\\JAY_PDM_DATA\\part10\\C_v9', '2025-02-22 04:34:48', '9');

-- --------------------------------------------------------

--
-- Table structure for table `store_dfx_folder_path`
--

CREATE TABLE `store_dfx_folder_path` (
  `sdfp_id` int NOT NULL,
  `dfx_folder_path` varchar(255) NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `store_dfx_folder_path`
--

INSERT INTO `store_dfx_folder_path` (`sdfp_id`, `dfx_folder_path`, `timestamp`) VALUES
(1, 'D:\\JAY_DFX', '2025-01-24 07:27:51');

-- --------------------------------------------------------

--
-- Table structure for table `store_folder_path`
--

CREATE TABLE `store_folder_path` (
  `sfp_id` int NOT NULL,
  `folder_path` varchar(255) NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `store_folder_path`
--

INSERT INTO `store_folder_path` (`sfp_id`, `folder_path`, `timestamp`) VALUES
(1, 'D:\\jay_folder', '2024-12-17 06:00:03'),
(2, 'D:\\JAY_PDM_DATA', '2025-01-24 05:08:44');

-- --------------------------------------------------------

--
-- Table structure for table `store_library_folder_path`
--

CREATE TABLE `store_library_folder_path` (
  `slfp_id` int NOT NULL,
  `library_folder_path` varchar(255) NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `store_library_folder_path`
--

INSERT INTO `store_library_folder_path` (`slfp_id`, `library_folder_path`, `timestamp`) VALUES
(1, 'D:\\JAY_Library_DATA', '2025-01-25 04:42:08');

-- --------------------------------------------------------

--
-- Table structure for table `store_old_dfx_folder_path`
--

CREATE TABLE `store_old_dfx_folder_path` (
  `sodfp` int NOT NULL,
  `old_dfx_folder_path` varchar(225) NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `store_old_dfx_folder_path`
--

INSERT INTO `store_old_dfx_folder_path` (`sodfp`, `old_dfx_folder_path`, `timestamp`) VALUES
(1, 'D:\\Old Dfx', '2025-02-20 10:00:22');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `contact_no` varchar(15) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` text,
  `role` varchar(50) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `contact_no`, `email`, `address`, `role`, `status`, `username`, `password`, `created_at`, `updated_at`) VALUES
(1, 'admin', '8600314903', 'admin@admin.com', 'Pune', 'admin', 'active', 'admin', '$2b$10$sQrBP86dmHkJDzh2H60c8.0f.1a0SLTNcUqz8T2GEI5GM3FVWBqw.', '2024-12-17 04:26:26', '2024-12-17 04:28:16'),
(2, 'Akash Pardeshi', '8600314903', 'akashp@myospaz.in', 'Pune', 'project manager', 'active', 'akash', '$2b$10$nicv3z1MKmK17ohc2snpkuzYKk9Aq6EC.MQxIf89xg8jEjEJygzVG', '2024-12-17 04:30:27', '2025-01-17 11:42:42'),
(3, 'Nehal Salunke', '7058685664', 'nehals@myospaz.in', 'Dapoli', 'team lead', 'active', 'nehal', '$2b$10$xh.K/cKcVP2G9/QvC8Wsdega7azPUmX363kNsfOdw1AkUd8LzugvW', '2024-12-17 04:31:14', '2024-12-17 04:31:14'),
(4, 'Kranti Tiwaskar', '8524561590', 'krantit@myospaz.in', 'Nagpur', 'designer', 'active', 'kranti', '$2b$10$vlljE9V3JHG14slxP0QLtOGUvix1r8nYCPTBp18Wb1PAvMxFpen1W', '2024-12-17 04:31:49', '2024-12-17 04:32:07'),
(5, 'Nitish', '9400442323', '824345@autoalfa.in', 'Pune', 'team lead', 'active', 'nitish', '$2b$10$PdS57.HIhUEF9TgzRRJTO..SU9TlTitcfzwHYwZ8ndTKG2Ad0MXHK', '2024-12-27 08:10:53', '2024-12-27 08:10:53'),
(6, 'Tushar', '9898989898', 'tushar@gmail.com', 'Pune', 'designer', 'active', 'tushar', '$2b$10$N/8A7qFVnnRNUanrncHrsepCG8aKI8.Esz12jhGE3LWoD3CDVOtYi', '2024-12-27 08:11:57', '2024-12-27 08:11:57'),
(7, 'Priyanka Bhosle', '7458961320', 'priyanka@gmail.com', 'Pune', 'designer', 'active', 'priyanka', '$2b$10$9aa6TS0SUrICgTltuUVktuEjhi.guSrMSyzUpuO9L9r4Ogc8/YzOy', '2025-01-21 06:23:59', '2025-01-21 06:23:59'),
(8, 'Arvind', '9152746380', 'arvind@gmail.com', 'Pune', 'team lead', 'active', 'arvind', '$2b$10$y5PmjZEVymR9Xu8NkTdeSORwDQhQT4HUjeyOVPdtQ4pWx/5EgFG.q', '2025-01-21 06:23:59', '2025-01-21 06:23:59'),
(9, 'Ritesh Mali', '8600314903', 'ritesh@gmail.com', 'Pune', 'laser designer', 'active', 'ritesh', '$2b$10$4pVVWS5AYe32RFspxhlEKuP3PdEzW9bj0WVrvPlMJk7t0ZnHUgLJK', '2025-01-23 07:04:40', '2025-01-23 07:04:40'),
(10, 'Mohini', '7411225588', 'mohini@gmail.com', 'Pune', 'employee', 'active', 'mohini', '$2b$10$Uo9rR0izQKZ3QV0MlMg9NukvuDwAP9uEPWEO3F71RQrYvTMOTpcWy', '2025-01-23 07:31:56', '2025-01-23 07:31:56'),
(11, 'Sarvesh', '9400442323', 'sarvesh@gmail.com', '232\\2 kanchan deep socity', 'laser designer', 'active', 'sarvesh', '$2b$10$s0VmQsuyF17SdMIaks2QsOaX.BrV.Cvsj1cXVB/44xXlK.oKc6qQy', '2025-01-28 10:42:21', '2025-01-28 10:42:21'),
(12, 'Ram', '7411225588', 'ram@gmail.com', '232\\2 kanchan deep socity', 'viewer', 'active', 'ram', '$2b$10$K8Xi6//SylN6JEn10mZTL.psgOjKi2Y6JGGAWczihHqN74YRBt4Sy', '2025-01-28 10:55:49', '2025-01-28 10:55:49'),
(13, 'Rutvek', '8524561590', 'rutvek@gmail.com', 'pune', 'sales', 'active', 'rutvek', '$2b$10$FhhKcwP6TnzuNH8RW7E2R.jtwopWpzGVw6/3T6909SJ6QIZig50xm', '2025-02-03 04:32:55', '2025-02-03 04:32:55');

-- --------------------------------------------------------

--
-- Table structure for table `vendors`
--

CREATE TABLE `vendors` (
  `vendor_id` int NOT NULL,
  `vendor_name` varchar(255) NOT NULL,
  `vendor_email` varchar(255) NOT NULL,
  `vendor_phone` varchar(15) NOT NULL,
  `vendor_address` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `vendors`
--

INSERT INTO `vendors` (`vendor_id`, `vendor_name`, `vendor_email`, `vendor_phone`, `vendor_address`, `created_at`, `updated_at`) VALUES
(1, 'Jay Engg', 'jay@gmail.com', '9246703152', 'Katraj, Pune.', '2024-12-17 04:42:21', '2024-12-17 04:42:21');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `design_status_activity`
--
ALTER TABLE `design_status_activity`
  ADD PRIMARY KEY (`dsa_id`),
  ADD KEY `du_id` (`du_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `design_upload`
--
ALTER TABLE `design_upload`
  ADD PRIMARY KEY (`du_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_revision_id_design` (`revision_id`);

--
-- Indexes for table `design_upload_version`
--
ALTER TABLE `design_upload_version`
  ADD PRIMARY KEY (`duv_id`),
  ADD KEY `du_id` (`du_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `dfx_files`
--
ALTER TABLE `dfx_files`
  ADD PRIMARY KEY (`dfx_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_revision_id_dfx` (`revision_id`);

--
-- Indexes for table `ecn`
--
ALTER TABLE `ecn`
  ADD PRIMARY KEY (`ecn_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `ecn_approval`
--
ALTER TABLE `ecn_approval`
  ADD PRIMARY KEY (`ecn_approval_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `ecn_change_details`
--
ALTER TABLE `ecn_change_details`
  ADD PRIMARY KEY (`ecn_change_id`),
  ADD KEY `ecn_id` (`ecn_id`);

--
-- Indexes for table `laser_design_upload`
--
ALTER TABLE `laser_design_upload`
  ADD PRIMARY KEY (`ldu_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_revision_id_laser` (`revision_id`);

--
-- Indexes for table `laser_upload_version`
--
ALTER TABLE `laser_upload_version`
  ADD PRIMARY KEY (`luv_id`),
  ADD KEY `ldu_id` (`ldu_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `library_files`
--
ALTER TABLE `library_files`
  ADD PRIMARY KEY (`l_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `part_types`
--
ALTER TABLE `part_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pdf_documents`
--
ALTER TABLE `pdf_documents`
  ADD PRIMARY KEY (`pdf_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_revision_id_pdf` (`revision_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `fk_user_id` (`user_id`);

--
-- Indexes for table `product_activity_logs`
--
ALTER TABLE `product_activity_logs`
  ADD PRIMARY KEY (`pal_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product_assignments`
--
ALTER TABLE `product_assignments`
  ADD PRIMARY KEY (`pa_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `product_documents`
--
ALTER TABLE `product_documents`
  ADD PRIMARY KEY (`pd_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `fk_revision_id` (`revision_id`);

--
-- Indexes for table `product_status_activity`
--
ALTER TABLE `product_status_activity`
  ADD PRIMARY KEY (`psa_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `revision`
--
ALTER TABLE `revision`
  ADD PRIMARY KEY (`r_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `revision_version`
--
ALTER TABLE `revision_version`
  ADD PRIMARY KEY (`rvid`),
  ADD KEY `r_id` (`r_id`);

--
-- Indexes for table `store_dfx_folder_path`
--
ALTER TABLE `store_dfx_folder_path`
  ADD PRIMARY KEY (`sdfp_id`);

--
-- Indexes for table `store_folder_path`
--
ALTER TABLE `store_folder_path`
  ADD PRIMARY KEY (`sfp_id`);

--
-- Indexes for table `store_library_folder_path`
--
ALTER TABLE `store_library_folder_path`
  ADD PRIMARY KEY (`slfp_id`);

--
-- Indexes for table `store_old_dfx_folder_path`
--
ALTER TABLE `store_old_dfx_folder_path`
  ADD PRIMARY KEY (`sodfp`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `vendors`
--
ALTER TABLE `vendors`
  ADD PRIMARY KEY (`vendor_id`),
  ADD UNIQUE KEY `vendor_email` (`vendor_email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `design_status_activity`
--
ALTER TABLE `design_status_activity`
  MODIFY `dsa_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `design_upload`
--
ALTER TABLE `design_upload`
  MODIFY `du_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=155;

--
-- AUTO_INCREMENT for table `design_upload_version`
--
ALTER TABLE `design_upload_version`
  MODIFY `duv_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `dfx_files`
--
ALTER TABLE `dfx_files`
  MODIFY `dfx_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `ecn`
--
ALTER TABLE `ecn`
  MODIFY `ecn_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `ecn_approval`
--
ALTER TABLE `ecn_approval`
  MODIFY `ecn_approval_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT for table `ecn_change_details`
--
ALTER TABLE `ecn_change_details`
  MODIFY `ecn_change_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `laser_design_upload`
--
ALTER TABLE `laser_design_upload`
  MODIFY `ldu_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `laser_upload_version`
--
ALTER TABLE `laser_upload_version`
  MODIFY `luv_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `library_files`
--
ALTER TABLE `library_files`
  MODIFY `l_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `part_types`
--
ALTER TABLE `part_types`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pdf_documents`
--
ALTER TABLE `pdf_documents`
  MODIFY `pdf_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `product_activity_logs`
--
ALTER TABLE `product_activity_logs`
  MODIFY `pal_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `product_assignments`
--
ALTER TABLE `product_assignments`
  MODIFY `pa_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `product_documents`
--
ALTER TABLE `product_documents`
  MODIFY `pd_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `product_status_activity`
--
ALTER TABLE `product_status_activity`
  MODIFY `psa_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `revision`
--
ALTER TABLE `revision`
  MODIFY `r_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `revision_version`
--
ALTER TABLE `revision_version`
  MODIFY `rvid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `store_dfx_folder_path`
--
ALTER TABLE `store_dfx_folder_path`
  MODIFY `sdfp_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `store_folder_path`
--
ALTER TABLE `store_folder_path`
  MODIFY `sfp_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `store_library_folder_path`
--
ALTER TABLE `store_library_folder_path`
  MODIFY `slfp_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `store_old_dfx_folder_path`
--
ALTER TABLE `store_old_dfx_folder_path`
  MODIFY `sodfp` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `vendors`
--
ALTER TABLE `vendors`
  MODIFY `vendor_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `design_status_activity`
--
ALTER TABLE `design_status_activity`
  ADD CONSTRAINT `design_status_activity_ibfk_1` FOREIGN KEY (`du_id`) REFERENCES `design_upload` (`du_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `design_status_activity_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `design_upload`
--
ALTER TABLE `design_upload`
  ADD CONSTRAINT `design_upload_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `design_upload_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_revision_id_design` FOREIGN KEY (`revision_id`) REFERENCES `revision` (`r_id`) ON DELETE CASCADE;

--
-- Constraints for table `design_upload_version`
--
ALTER TABLE `design_upload_version`
  ADD CONSTRAINT `design_upload_version_ibfk_1` FOREIGN KEY (`du_id`) REFERENCES `design_upload` (`du_id`),
  ADD CONSTRAINT `design_upload_version_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  ADD CONSTRAINT `design_upload_version_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `dfx_files`
--
ALTER TABLE `dfx_files`
  ADD CONSTRAINT `dfx_files_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `dfx_files_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_revision_id_dfx` FOREIGN KEY (`revision_id`) REFERENCES `revision` (`r_id`) ON DELETE CASCADE;

--
-- Constraints for table `ecn`
--
ALTER TABLE `ecn`
  ADD CONSTRAINT `ecn_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ecn_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ecn_approval`
--
ALTER TABLE `ecn_approval`
  ADD CONSTRAINT `ecn_approval_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ecn_change_details`
--
ALTER TABLE `ecn_change_details`
  ADD CONSTRAINT `ecn_change_details_ibfk_1` FOREIGN KEY (`ecn_id`) REFERENCES `ecn` (`ecn_id`) ON DELETE CASCADE;

--
-- Constraints for table `laser_design_upload`
--
ALTER TABLE `laser_design_upload`
  ADD CONSTRAINT `fk_revision_id_laser` FOREIGN KEY (`revision_id`) REFERENCES `revision` (`r_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `laser_design_upload_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `laser_design_upload_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `laser_upload_version`
--
ALTER TABLE `laser_upload_version`
  ADD CONSTRAINT `laser_upload_version_ibfk_1` FOREIGN KEY (`ldu_id`) REFERENCES `laser_design_upload` (`ldu_id`),
  ADD CONSTRAINT `laser_upload_version_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  ADD CONSTRAINT `laser_upload_version_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `library_files`
--
ALTER TABLE `library_files`
  ADD CONSTRAINT `library_files_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pdf_documents`
--
ALTER TABLE `pdf_documents`
  ADD CONSTRAINT `fk_revision_id_pdf` FOREIGN KEY (`revision_id`) REFERENCES `revision` (`r_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pdf_documents_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pdf_documents_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `product_activity_logs`
--
ALTER TABLE `product_activity_logs`
  ADD CONSTRAINT `product_activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_activity_logs_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `product_assignments`
--
ALTER TABLE `product_assignments`
  ADD CONSTRAINT `product_assignments_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_assignments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_documents`
--
ALTER TABLE `product_documents`
  ADD CONSTRAINT `fk_revision_id` FOREIGN KEY (`revision_id`) REFERENCES `revision` (`r_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_documents_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `product_status_activity`
--
ALTER TABLE `product_status_activity`
  ADD CONSTRAINT `product_status_activity_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_status_activity_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `revision`
--
ALTER TABLE `revision`
  ADD CONSTRAINT `revision_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `revision_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `revision_version`
--
ALTER TABLE `revision_version`
  ADD CONSTRAINT `revision_version_ibfk_1` FOREIGN KEY (`r_id`) REFERENCES `revision` (`r_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
