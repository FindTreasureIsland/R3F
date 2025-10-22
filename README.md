# Entrance Animation for FindTreasureIsland Blog

This repository contains the source code for the cinematic 3D entrance animation for the blog [FindTreasureIsland.github.io](https://findtreasureisland.github.io/blog.html).

---

## English Version

### 🎬 Project Introduction

This project is a cinematic web experience designed to serve as an immersive entry point for the "Find Treasure Island" blog. Built with React Three Fiber, it guides the user through a short, automated journey in a 3D space, setting a narrative tone of exploration and discovery before leading them to the main blog content.

### ✨ Features

-   **Cinematic Camera:** An automated camera animation that moves through several predefined viewpoints to tell a short story.
-   **3D Model Integration:** Loads and displays a `.glb` 3D model of a spaceship, central to the scene's theme.
-   **Narrative Text Overlays:** Displays animated, typewriter-style text that synchronizes with the camera's movement, conveying themes of perseverance and adventure.
-   **Background Music:** Includes atmospheric background music with a simple UI control to mute and unmute.
-   **Seamless Redirect:** After the animation sequence, a call-to-action button appears, which, when clicked, triggers a final animation and smoothly navigates the user to the blog.

### 🛠️ Tech Stack

-   **Framework:** [React](https://react.dev/)
-   **Bundler:** [Vite](https://vitejs.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **3D Rendering:** [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) & [Three.js](https://threejs.org/)
-   **Helpers & Abstractions:** [Drei](https://github.com/pmndrs/drei) for R3F

### 🚀 Getting Started

#### Prerequisites

-   [Node.js](https://nodejs.org/en) (v18 or higher recommended)
-   [npm](https://www.npmjs.com/) (or another package manager like yarn or pnpm)

#### Installation & Running

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd R3F
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

---

## 中文版本

### 🎬 项目简介

本项目是为博客网站 [寻找金银岛](https://findtreasureisland.github.io/blog.html) 精心打造的一个电影质感的 3D 入场动画。它旨在作为博客的沉浸式入口，通过一段自动播放的 3D 场景动画，带领用户体验一场关于探索与发现的视觉叙事，最后将用户引导至博客主页。

### ✨ 功能特性

-   **电影感镜头:** 通过预设的镜头路径，自动播放一段富有故事性的相机动画。
-   **3D 模型集成:** 加载并展示作为场景核心主题的 `.glb` 格式飞船模型。
-   **叙事文字叠加:** 与镜头动画同步展示打字机效果的动态文字，传达关于坚持与冒险的主题。
-   **背景音乐:** 集成了氛围感十足的背景音乐，并提供了简单的播放/暂停控制按钮。
-   **无缝跳转:** 动画序列结束后，一个交互按钮将会浮现，点击后触发最终动画并将用户平滑地重定向到博客页面。

### 🛠️ 技术栈

-   **前端框架:** [React](https://react.dev/)
-   **构建工具:** [Vite](https://vitejs.dev/)
-   **开发语言:** [TypeScript](https://www.typescriptlang.org/)
-   **3D 渲染:** [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) & [Three.js](https://threejs.org/)
-   **辅助工具:** [Drei](https://github.com/pmndrs/drei) (R3F 助手库)

### 🚀 快速开始

#### 环境要求

-   [Node.js](https.nodejs.org/en) (推荐 v18 或更高版本)
-   [npm](https://www.npmjs.com/) (或 yarn, pnpm 等包管理工具)

#### 安装与运行

1.  克隆仓库:
    ```bash
    git clone <repository-url>
    ```
2.  进入项目目录:
    ```bash
    cd R3F
    ```
3.  安装依赖:
    ```bash
    npm install
    ```
4.  启动开发服务器:
    ```bash
    npm run dev
    ```
