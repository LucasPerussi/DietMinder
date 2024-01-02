-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 02-Jan-2024 às 02:59
-- Versão do servidor: 10.4.27-MariaDB
-- versão do PHP: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `diet-minder-db`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `agenda`
--

CREATE TABLE `agenda` (
  `age_id` int(11) NOT NULL,
  `age_user` int(11) NOT NULL,
  `age_nutri` int(11) NOT NULL,
  `age_date` datetime DEFAULT current_timestamp(),
  `age_type` int(11) NOT NULL DEFAULT 1,
  `age_name` varchar(255) NOT NULL,
  `age_requirements` text DEFAULT NULL,
  `age_description` text DEFAULT NULL,
  `age_location` text DEFAULT NULL,
  `age_status` int(11) NOT NULL DEFAULT 1,
  `age_duration` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `anamnesis`
--

CREATE TABLE `anamnesis` (
  `anm_id` int(11) NOT NULL,
  `anm_agenda` int(11) NOT NULL,
  `anm_user` int(11) NOT NULL,
  `anm_nutri` int(11) NOT NULL,
  `anm_altura` float NOT NULL,
  `anm_peso` float NOT NULL,
  `anm_cintura` float NOT NULL,
  `anm_coxa_direita` float NOT NULL,
  `anm_braco_relaxado` float NOT NULL,
  `anm_quadril` float NOT NULL,
  `anm_pant_direita` float NOT NULL,
  `anm_braco_contraido` float NOT NULL,
  `anm_punho` float NOT NULL,
  `anm_biceps` float NOT NULL,
  `anm_triceps` float NOT NULL,
  `anm_subescapular` float NOT NULL,
  `anm_pant_medial` float NOT NULL,
  `anm_abdominal` float NOT NULL,
  `anm_suprailiaca` float NOT NULL,
  `anm_coxa` float NOT NULL,
  `anm_date` datetime NOT NULL DEFAULT current_timestamp(),
  `anm_comments` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `badges`
--

CREATE TABLE `badges` (
  `bdg_id` int(11) NOT NULL,
  `bdg_user` int(11) NOT NULL,
  `bdg_goal` int(11) DEFAULT NULL,
  `bdg_type` int(11) NOT NULL,
  `bdg_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `codes`
--

CREATE TABLE `codes` (
  `cod_id` int(11) NOT NULL,
  `cod_user` int(11) NOT NULL,
  `cod_code` varchar(255) NOT NULL,
  `cod_name` varchar(255) NOT NULL,
  `cod_email` varchar(255) NOT NULL,
  `cod_status` int(1) NOT NULL DEFAULT 1,
  `cod_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `dailycalories`
--

CREATE TABLE `dailycalories` (
  `cal_id` int(11) NOT NULL,
  `cal_user` int(11) NOT NULL,
  `cal_anamnese` int(11) NOT NULL,
  `cal_nutri` int(11) NOT NULL,
  `cal_total` float NOT NULL,
  `cal_breakfast` float DEFAULT NULL,
  `cal_lunch` float DEFAULT NULL,
  `cal_afternoon` float DEFAULT NULL,
  `cal_dinner` float DEFAULT NULL,
  `cal_supper` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `goals`
--

CREATE TABLE `goals` (
  `gol_id` int(11) NOT NULL,
  `gol_name` varchar(255) NOT NULL,
  `gol_type` int(11) NOT NULL,
  `gol_user` int(11) NOT NULL,
  `gol_start_date` datetime NOT NULL DEFAULT current_timestamp(),
  `gol_target_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `logins`
--

CREATE TABLE `logins` (
  `lgn_id` int(11) NOT NULL,
  `lgn_user` int(11) NOT NULL,
  `lgn_ip` varchar(40) NOT NULL,
  `lgn_coordinates` int(60) NOT NULL,
  `lgn_date` datetime NOT NULL DEFAULT current_timestamp(),
  `lgn_city` varchar(100) NOT NULL,
  `lgn_state` varchar(100) NOT NULL,
  `lgn_country` varchar(100) NOT NULL,
  `lgn_session` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `logintry`
--

CREATE TABLE `logintry` (
  `try_id` int(11) NOT NULL,
  `try_user` int(11) NOT NULL,
  `try_date` datetime NOT NULL DEFAULT current_timestamp(),
  `try_ip` varchar(40) DEFAULT NULL,
  `try_coordinates` varchar(60) DEFAULT NULL,
  `try_device` varchar(100) DEFAULT NULL,
  `try_status` varchar(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `logs`
--

CREATE TABLE `logs` (
  `log_id` int(11) NOT NULL,
  `log_user` int(11) NOT NULL,
  `log_date` datetime DEFAULT current_timestamp(),
  `log_operation` varchar(255) NOT NULL,
  `log_function` varchar(255) NOT NULL,
  `log_status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `meal`
--

CREATE TABLE `meal` (
  `mel_id` int(11) NOT NULL,
  `mel_type` int(11) NOT NULL,
  `mel_daily_id` int(11) NOT NULL,
  `mel_user` int(11) NOT NULL,
  `mel_anamnese` int(11) NOT NULL,
  `mel_nutri` int(11) NOT NULL,
  `mel_protein` varchar(255) DEFAULT NULL,
  `mel_protein_portion` int(11) DEFAULT NULL,
  `mel_protein_calories` int(11) DEFAULT NULL,
  `mel_veg` varchar(255) DEFAULT NULL,
  `mel_veg_portion` int(11) DEFAULT NULL,
  `mel_veg_calories` int(11) DEFAULT NULL,
  `mel_salad` varchar(255) DEFAULT NULL,
  `mel_salad_portion` int(11) DEFAULT NULL,
  `mel_salad_calories` int(11) DEFAULT NULL,
  `mel_carb` varchar(255) DEFAULT NULL,
  `mel_carb_portion` int(11) DEFAULT NULL,
  `mel_carb_calories` int(11) DEFAULT NULL,
  `mel_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `mealextra`
--

CREATE TABLE `mealextra` (
  `mel_extra_id` int(11) NOT NULL,
  `mel_extra_meal` int(11) NOT NULL,
  `mel_extra_name` varchar(255) NOT NULL,
  `mel_extra_portion` varchar(255) NOT NULL,
  `mel_extra_portion_type` varchar(255) NOT NULL,
  `mel_extra_calories` varchar(255) NOT NULL,
  `mel_extra_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `nutritionists`
--

CREATE TABLE `nutritionists` (
  `ntr_id` int(11) NOT NULL,
  `ntr_user` int(11) NOT NULL,
  `ntr_crn` varchar(255) DEFAULT NULL,
  `ntr_address` varchar(255) DEFAULT NULL,
  `ntr_logo` text DEFAULT NULL,
  `ntr_stamp` text DEFAULT NULL,
  `ntr_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `patients`
--

CREATE TABLE `patients` (
  `pac_id` int(11) NOT NULL,
  `pac_user` int(11) NOT NULL,
  `pac_nutri` int(11) NOT NULL,
  `pac_linking_date` datetime NOT NULL DEFAULT current_timestamp(),
  `pac_athlete` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `products`
--

CREATE TABLE `products` (
  `pro_id` int(11) NOT NULL,
  `pro_name` varchar(255) NOT NULL,
  `pro_type` int(1) NOT NULL,
  `pro_calories` int(10) NOT NULL,
  `pro_portion` int(11) NOT NULL,
  `pro_portion_type` varchar(20) NOT NULL,
  `pro_picture` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `recipes`
--

CREATE TABLE `recipes` (
  `rec_id` int(11) NOT NULL,
  `rec_nutri` int(11) NOT NULL,
  `rec_target` int(11) NOT NULL DEFAULT 1,
  `rec_title` varchar(255) NOT NULL,
  `rec_description` text NOT NULL,
  `rec_ingredients` text NOT NULL,
  `rec_preparation` text NOT NULL,
  `rec_calories_portion` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `registers`
--

CREATE TABLE `registers` (
  `reg_id` int(11) NOT NULL,
  `reg_type` int(11) NOT NULL,
  `reg_user` int(11) NOT NULL,
  `reg_value` float NOT NULL,
  `reg_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `results`
--

CREATE TABLE `results` (
  `res_id` int(11) NOT NULL,
  `res_anamnesis` int(11) NOT NULL,
  `res_nutri` int(11) NOT NULL,
  `res_user` int(11) NOT NULL,
  `res_agenda` int(11) NOT NULL,
  `res_data` datetime NOT NULL DEFAULT current_timestamp(),
  `res_perc_massa_gorda` float NOT NULL,
  `res_perc_massa_gorda_sit` varchar(255) NOT NULL,
  `res_massa_gorda` float NOT NULL,
  `res_massa_gorda_sit` varchar(255) NOT NULL,
  `res_perc_massa_magra` float NOT NULL,
  `res_perc_massa_magra_sit` varchar(255) NOT NULL,
  `res_massa_magra` float NOT NULL,
  `res_massa_magra_sit` varchar(255) NOT NULL,
  `res_soma_dobras` float NOT NULL,
  `res_soma_dobras_sit` varchar(255) NOT NULL,
  `res_razao_cint_quadril` float NOT NULL,
  `res_razao_cint_quadril_sit` varchar(255) NOT NULL,
  `res_amb` float NOT NULL,
  `res_amb_sit` varchar(255) NOT NULL,
  `res_agb` float NOT NULL,
  `res_agb_sit` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `sessions`
--

CREATE TABLE `sessions` (
  `ses_id` int(11) NOT NULL,
  `ses_key` varchar(40) NOT NULL,
  `ses_ip` varchar(20) NOT NULL,
  `ses_location` varchar(40) NOT NULL,
  `ses_city` varchar(100) NOT NULL,
  `ses_state` varchar(100) NOT NULL,
  `ses_country` varchar(20) NOT NULL,
  `ses_timezone` varchar(100) NOT NULL,
  `ses_status` int(11) NOT NULL DEFAULT 1,
  `ses_created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `ses_expiration_date` datetime DEFAULT NULL,
  `ses_client` int(11) NOT NULL DEFAULT 1,
  `ses_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `timeline`
--

CREATE TABLE `timeline` (
  `tim_id` int(11) NOT NULL,
  `tim_user` int(11) NOT NULL,
  `tim_type` int(11) NOT NULL,
  `tim_reference` varchar(40) NOT NULL,
  `tim_date` datetime NOT NULL DEFAULT current_timestamp(),
  `tim_title` varchar(255) NOT NULL,
  `tim_description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `user`
--

CREATE TABLE `user` (
  `usr_id` int(11) NOT NULL,
  `usr_name` varchar(255) NOT NULL,
  `usr_last_name` varchar(255) NOT NULL,
  `usr_email` varchar(255) NOT NULL,
  `usr_password` varchar(255) NOT NULL,
  `usr_role` int(11) NOT NULL DEFAULT 1,
  `usr_born_date` datetime DEFAULT NULL,
  `usr_height` float DEFAULT NULL,
  `usr_weight` float DEFAULT NULL,
  `usr_sex` int(11) NOT NULL,
  `usr_picture` varchar(255) NOT NULL DEFAULT 'https://i.imgur.com/N9c1ah6.png',
  `usr_phone` varchar(255) DEFAULT NULL,
  `usr_username` varchar(255) DEFAULT NULL,
  `usr_city` varchar(255) DEFAULT NULL,
  `usr_theme` int(1) NOT NULL,
  `usr_doubleStep` int(11) NOT NULL,
  `usr_created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `user`
--

INSERT INTO `user` (`usr_id`, `usr_name`, `usr_last_name`, `usr_email`, `usr_password`, `usr_role`, `usr_born_date`, `usr_height`, `usr_weight`, `usr_sex`, `usr_picture`, `usr_phone`, `usr_username`, `usr_city`, `usr_theme`, `usr_doubleStep`, `usr_created_at`) VALUES
(2, 'Lucas', 'Perussi', 'perussilucas@hotmail.com', '$2a$10$BCmBlSU.3acRq/1rSR5CKOrNGC3qr/0EV.v/8XWy23mrpL5NwgBxO', 1, '1999-07-28 00:00:00', NULL, NULL, 1, 'https://i.imgur.com/N9c1ah6.png', NULL, 'LucasPerussi11462024', NULL, 1, 1, '2024-01-02 01:46:21');

-- --------------------------------------------------------

--
-- Estrutura da tabela `whitelist`
--

CREATE TABLE `whitelist` (
  `wls_id` int(11) NOT NULL,
  `wls_user` int(11) NOT NULL,
  `wls_date` datetime NOT NULL DEFAULT current_timestamp(),
  `wls_ip` varchar(40) DEFAULT NULL,
  `wls_coordinates` varchar(60) DEFAULT NULL,
  `wls_device` varchar(100) DEFAULT NULL,
  `wls_city` varchar(60) DEFAULT NULL,
  `wls_state` varchar(60) DEFAULT NULL,
  `wls_country` varchar(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `agenda`
--
ALTER TABLE `agenda`
  ADD PRIMARY KEY (`age_id`),
  ADD KEY `agenda_fk0` (`age_user`),
  ADD KEY `agenda_fk1` (`age_nutri`);

--
-- Índices para tabela `anamnesis`
--
ALTER TABLE `anamnesis`
  ADD PRIMARY KEY (`anm_id`),
  ADD KEY `anamnesis_fk0` (`anm_agenda`),
  ADD KEY `anamnesis_fk1` (`anm_user`),
  ADD KEY `anamnesis_fk2` (`anm_nutri`);

--
-- Índices para tabela `badges`
--
ALTER TABLE `badges`
  ADD PRIMARY KEY (`bdg_id`),
  ADD KEY `badges_fk0` (`bdg_user`),
  ADD KEY `badges_fk1` (`bdg_goal`);

--
-- Índices para tabela `codes`
--
ALTER TABLE `codes`
  ADD PRIMARY KEY (`cod_id`),
  ADD KEY `codes_fk0` (`cod_user`);

--
-- Índices para tabela `dailycalories`
--
ALTER TABLE `dailycalories`
  ADD PRIMARY KEY (`cal_id`),
  ADD KEY `dailyCalories_fk0` (`cal_user`),
  ADD KEY `dailyCalories_fk1` (`cal_anamnese`),
  ADD KEY `dailyCalories_fk2` (`cal_nutri`);

--
-- Índices para tabela `goals`
--
ALTER TABLE `goals`
  ADD PRIMARY KEY (`gol_id`),
  ADD KEY `goals_fk0` (`gol_user`);

--
-- Índices para tabela `logins`
--
ALTER TABLE `logins`
  ADD PRIMARY KEY (`lgn_id`),
  ADD KEY `logins_fk0` (`lgn_user`);

--
-- Índices para tabela `logintry`
--
ALTER TABLE `logintry`
  ADD PRIMARY KEY (`try_id`),
  ADD KEY `loginTry_fk0` (`try_user`);

--
-- Índices para tabela `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `logs_fk0` (`log_user`);

--
-- Índices para tabela `meal`
--
ALTER TABLE `meal`
  ADD PRIMARY KEY (`mel_id`),
  ADD KEY `meal_fk0` (`mel_daily_id`),
  ADD KEY `meal_fk1` (`mel_user`),
  ADD KEY `meal_fk2` (`mel_anamnese`),
  ADD KEY `meal_fk3` (`mel_nutri`);

--
-- Índices para tabela `mealextra`
--
ALTER TABLE `mealextra`
  ADD PRIMARY KEY (`mel_extra_id`),
  ADD KEY `mealExtra_fk0` (`mel_extra_meal`);

--
-- Índices para tabela `nutritionists`
--
ALTER TABLE `nutritionists`
  ADD PRIMARY KEY (`ntr_id`),
  ADD KEY `nutritionists_fk0` (`ntr_user`);

--
-- Índices para tabela `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`pac_id`),
  ADD KEY `patients_fk0` (`pac_user`),
  ADD KEY `patients_fk1` (`pac_nutri`);

--
-- Índices para tabela `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`pro_id`);

--
-- Índices para tabela `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`rec_id`),
  ADD KEY `recipes_fk0` (`rec_nutri`);

--
-- Índices para tabela `registers`
--
ALTER TABLE `registers`
  ADD PRIMARY KEY (`reg_id`),
  ADD KEY `registers_fk0` (`reg_user`);

--
-- Índices para tabela `results`
--
ALTER TABLE `results`
  ADD PRIMARY KEY (`res_id`),
  ADD KEY `results_fk0` (`res_anamnesis`),
  ADD KEY `results_fk1` (`res_nutri`),
  ADD KEY `results_fk2` (`res_user`),
  ADD KEY `results_fk3` (`res_agenda`);

--
-- Índices para tabela `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`ses_id`),
  ADD KEY `ses_user` (`ses_user`);

--
-- Índices para tabela `timeline`
--
ALTER TABLE `timeline`
  ADD PRIMARY KEY (`tim_id`),
  ADD KEY `timeline_fk0` (`tim_user`);

--
-- Índices para tabela `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`usr_id`),
  ADD UNIQUE KEY `usr_email` (`usr_email`);

--
-- Índices para tabela `whitelist`
--
ALTER TABLE `whitelist`
  ADD PRIMARY KEY (`wls_id`),
  ADD KEY `whitelist_fk0` (`wls_user`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `agenda`
--
ALTER TABLE `agenda`
  MODIFY `age_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `anamnesis`
--
ALTER TABLE `anamnesis`
  MODIFY `anm_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `badges`
--
ALTER TABLE `badges`
  MODIFY `bdg_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `codes`
--
ALTER TABLE `codes`
  MODIFY `cod_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `dailycalories`
--
ALTER TABLE `dailycalories`
  MODIFY `cal_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `goals`
--
ALTER TABLE `goals`
  MODIFY `gol_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `logins`
--
ALTER TABLE `logins`
  MODIFY `lgn_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `logintry`
--
ALTER TABLE `logintry`
  MODIFY `try_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `logs`
--
ALTER TABLE `logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `meal`
--
ALTER TABLE `meal`
  MODIFY `mel_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `mealextra`
--
ALTER TABLE `mealextra`
  MODIFY `mel_extra_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `nutritionists`
--
ALTER TABLE `nutritionists`
  MODIFY `ntr_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `patients`
--
ALTER TABLE `patients`
  MODIFY `pac_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `products`
--
ALTER TABLE `products`
  MODIFY `pro_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `recipes`
--
ALTER TABLE `recipes`
  MODIFY `rec_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `registers`
--
ALTER TABLE `registers`
  MODIFY `reg_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `results`
--
ALTER TABLE `results`
  MODIFY `res_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `sessions`
--
ALTER TABLE `sessions`
  MODIFY `ses_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `timeline`
--
ALTER TABLE `timeline`
  MODIFY `tim_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `user`
--
ALTER TABLE `user`
  MODIFY `usr_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `whitelist`
--
ALTER TABLE `whitelist`
  MODIFY `wls_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `agenda`
--
ALTER TABLE `agenda`
  ADD CONSTRAINT `agenda_fk0` FOREIGN KEY (`age_user`) REFERENCES `user` (`usr_id`),
  ADD CONSTRAINT `agenda_fk1` FOREIGN KEY (`age_nutri`) REFERENCES `nutritionists` (`ntr_id`);

--
-- Limitadores para a tabela `anamnesis`
--
ALTER TABLE `anamnesis`
  ADD CONSTRAINT `anamnesis_fk0` FOREIGN KEY (`anm_agenda`) REFERENCES `agenda` (`age_id`),
  ADD CONSTRAINT `anamnesis_fk1` FOREIGN KEY (`anm_user`) REFERENCES `user` (`usr_id`),
  ADD CONSTRAINT `anamnesis_fk2` FOREIGN KEY (`anm_nutri`) REFERENCES `nutritionists` (`ntr_id`);

--
-- Limitadores para a tabela `badges`
--
ALTER TABLE `badges`
  ADD CONSTRAINT `badges_fk0` FOREIGN KEY (`bdg_user`) REFERENCES `user` (`usr_id`),
  ADD CONSTRAINT `badges_fk1` FOREIGN KEY (`bdg_goal`) REFERENCES `goals` (`gol_id`);

--
-- Limitadores para a tabela `codes`
--
ALTER TABLE `codes`
  ADD CONSTRAINT `codes_fk0` FOREIGN KEY (`cod_user`) REFERENCES `user` (`usr_id`);

--
-- Limitadores para a tabela `dailycalories`
--
ALTER TABLE `dailycalories`
  ADD CONSTRAINT `dailyCalories_fk0` FOREIGN KEY (`cal_user`) REFERENCES `user` (`usr_id`),
  ADD CONSTRAINT `dailyCalories_fk1` FOREIGN KEY (`cal_anamnese`) REFERENCES `anamnesis` (`anm_id`),
  ADD CONSTRAINT `dailyCalories_fk2` FOREIGN KEY (`cal_nutri`) REFERENCES `nutritionists` (`ntr_id`);

--
-- Limitadores para a tabela `goals`
--
ALTER TABLE `goals`
  ADD CONSTRAINT `goals_fk0` FOREIGN KEY (`gol_user`) REFERENCES `user` (`usr_id`);

--
-- Limitadores para a tabela `logins`
--
ALTER TABLE `logins`
  ADD CONSTRAINT `logins_fk0` FOREIGN KEY (`lgn_user`) REFERENCES `user` (`usr_id`);

--
-- Limitadores para a tabela `logintry`
--
ALTER TABLE `logintry`
  ADD CONSTRAINT `loginTry_fk0` FOREIGN KEY (`try_user`) REFERENCES `user` (`usr_id`);

--
-- Limitadores para a tabela `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `logs_fk0` FOREIGN KEY (`log_user`) REFERENCES `user` (`usr_id`);

--
-- Limitadores para a tabela `meal`
--
ALTER TABLE `meal`
  ADD CONSTRAINT `meal_fk0` FOREIGN KEY (`mel_daily_id`) REFERENCES `dailycalories` (`cal_id`),
  ADD CONSTRAINT `meal_fk1` FOREIGN KEY (`mel_user`) REFERENCES `user` (`usr_id`),
  ADD CONSTRAINT `meal_fk2` FOREIGN KEY (`mel_anamnese`) REFERENCES `anamnesis` (`anm_id`),
  ADD CONSTRAINT `meal_fk3` FOREIGN KEY (`mel_nutri`) REFERENCES `nutritionists` (`ntr_id`);

--
-- Limitadores para a tabela `mealextra`
--
ALTER TABLE `mealextra`
  ADD CONSTRAINT `mealExtra_fk0` FOREIGN KEY (`mel_extra_meal`) REFERENCES `meal` (`mel_id`);

--
-- Limitadores para a tabela `nutritionists`
--
ALTER TABLE `nutritionists`
  ADD CONSTRAINT `nutritionists_fk0` FOREIGN KEY (`ntr_user`) REFERENCES `user` (`usr_id`);

--
-- Limitadores para a tabela `patients`
--
ALTER TABLE `patients`
  ADD CONSTRAINT `patients_fk0` FOREIGN KEY (`pac_user`) REFERENCES `user` (`usr_id`),
  ADD CONSTRAINT `patients_fk1` FOREIGN KEY (`pac_nutri`) REFERENCES `nutritionists` (`ntr_id`);

--
-- Limitadores para a tabela `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_fk0` FOREIGN KEY (`rec_nutri`) REFERENCES `nutritionists` (`ntr_id`);

--
-- Limitadores para a tabela `registers`
--
ALTER TABLE `registers`
  ADD CONSTRAINT `registers_fk0` FOREIGN KEY (`reg_user`) REFERENCES `user` (`usr_id`);

--
-- Limitadores para a tabela `results`
--
ALTER TABLE `results`
  ADD CONSTRAINT `results_fk0` FOREIGN KEY (`res_anamnesis`) REFERENCES `anamnesis` (`anm_id`),
  ADD CONSTRAINT `results_fk1` FOREIGN KEY (`res_nutri`) REFERENCES `nutritionists` (`ntr_id`),
  ADD CONSTRAINT `results_fk2` FOREIGN KEY (`res_user`) REFERENCES `user` (`usr_id`),
  ADD CONSTRAINT `results_fk3` FOREIGN KEY (`res_agenda`) REFERENCES `agenda` (`age_id`);

--
-- Limitadores para a tabela `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`ses_user`) REFERENCES `user` (`usr_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `timeline`
--
ALTER TABLE `timeline`
  ADD CONSTRAINT `timeline_fk0` FOREIGN KEY (`tim_user`) REFERENCES `user` (`usr_id`);

--
-- Limitadores para a tabela `whitelist`
--
ALTER TABLE `whitelist`
  ADD CONSTRAINT `whitelist_fk0` FOREIGN KEY (`wls_user`) REFERENCES `user` (`usr_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
