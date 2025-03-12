# HealthSync - Fitness Tracker App

## Problem Statement

In today's fast-paced world, many individuals struggle to maintain a balanced and healthy lifestyle due to a lack of time, motivation, and convenient tools. HealthSync aims to address this issue by providing a comprehensive fitness tracking application that helps users monitor their activities, set achievable fitness goals, and maintain a healthy routine. By integrating features like workout logging, nutrition tracking, and sleep monitoring, HealthSync empowers users to make data-driven decisions for their health and well-being.

## Overview of the Application’s Functionality

HealthSync is a web-based fitness tracker designed to help users monitor and improve their overall health. Users can register or log in to save and access their fitness data securely. The application provides tools to log workout activities such as running, cycling, and weightlifting, while also tracking nutrition intake, sleep, and water consumption. Users can set fitness goals, monitor progress, and view summaries through an intuitive dashboard with graphs and charts. The app also features a recipe addition tool to streamline nutrition tracking and offers accessibility options like dark mode. HealthSync aims to be an all-in-one health companion that simplifies the process of achieving and maintaining a healthy lifestyle.

## Technology Stack

- **Front-End:** React, TypeScript, HTML5, Tailwind CSS, Shadcn/UI, Zod
- **Back-End:** Node.js, JWT
- **Database:** DynamoDB

## Features

### Core Features

- **User Authentication:** Secure registration and login. **[IMPLEMENTED]**
- **Activity Logging:** Log various workout activities, including duration, distance, and calories burned. **[IMPLEMENTED]**
- **Sleep Tracking:** Record sleep hours and set goals.**[IMPLEMENTED]**
- **Water Intake Tracker:** Log water consumption and set goals. **[IMPLEMENTED]**

### Features to be implemented 

- **Goal Setting:** Create fitness goals and track progress.
- **Progress Dashboard:** View summaries and visual progress indicators (e.g., graphs, charts).


### Additional Features (Optional)

- **Recipe Management:** Add personal recipes with macros for easy tracking.
- **Nutrition Tracking:** Log food intake, calories, and macros.
- **Dark Mode:** Accessibility feature to toggle between light and dark themes. **[IMPLEMENTED]**

### Features Under Analysis

- **Program Exercises to Follow:**\
  This feature would allow users to access suggested exercise programs, plan custom workouts, and track details such as repetitions and weightlifting progress. However, it requires careful consideration of the complexity involved, including exercise program templates, customization capabilities, and user data integration. The feasibility and implementation of this feature will be evaluated during the development process.
- Integration with third-party APIs (e.g., Fitbit, Strava).

### User Stories

1. As a user, I want to log my daily workouts so that I can track my fitness activities and monitor calories burned.
2. As a user, I want to record my sleep hours ans set goals so that I can maintain healthy sleep habits.
3. As a user, I want to add and track my daily water intake so that I can monitor water consumption.
4. As a user, I want to set fitness goals so that I can stay motivated and track my progress over time.
5. As a user, I want to add and track my daily food intake so that I can monitor my calorie and macro consumption.
6. As a user, I want to view a progress dashboard with graphs and summaries so that I can see my performance and adjust my goals as needed.

## Entity-Relationship Diagram (ERD)

🔗 [View the ER Diagram on Lucidchart](https://lucid.app/lucidchart/5fb0775b-8876-48e9-9b47-4054f9f1ce62/edit?viewport_loc=-1080%2C-432%2C2085%2C1149%2C0_0&invitationId=inv_e7e51ade-e78c-4874-8caa-81b322eb0739)

## API Contract (Swagger)

🔗 [View the API contract](http://3.146.34.160:9000/api-docs/)

## High-level Architecture

Ideally use AWS services

🔗 [View the High-level Architecture Diagram](https://lucid.app/lucidchart/e1195048-5845-464f-a663-a39e09e4434b/edit?viewport_loc=-457%2C-550%2C1583%2C873%2C0_0&invitationId=inv_029caeb6-f28c-422a-b167-601720b460d5)

## CloudFront

🔗 [View the Website](http://dxar0rls65sxl.cloudfront.net)

## References

I've based my structure on my previous project
https://github.com/sofineo/Food-Explorer-back-end-.git
