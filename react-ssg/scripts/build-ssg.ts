// dotenv를 가장 먼저 로드하여 환경 변수 설정
import dotenv from "dotenv";
dotenv.config();

// 환경 변수 확인
if (!process.env.TMDB_ACCESS_TOKEN) {
  console.error("❌ TMDB_ACCESS_TOKEN is not set in .env file");
  process.exit(1);
}

import fs from "fs";
import path from "path";
import { renderToString } from "react-dom/server";
import * as React from "react";
import App from "../src/client/App";
import { moviesApi } from "../src/shared/api/movies";

// React를 전역으로 설정 (JSX transform을 위해)
(global as any).React = React;

const DIST_DIR = path.join(__dirname, "../dist");

function generateHTML(
  bodyContent: string,
  initialData: any,
  ogTags: string = ""
): string {
  return `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/static/styles/index.css" />
        <title>영화 리뷰</title>
        ${ogTags}
      </head>
      <body>
        <div id="root">${bodyContent}</div>
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
  `;
}

async function buildSSG() {
  console.log("🚀 Starting SSG build...");

  // dist 디렉토리 생성
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  try {
    // 1. 홈페이지 생성 (/)
    console.log("📄 Building home page...");
    const response = await moviesApi.getPopular(1);
    const movies = response.data.results;

    const homeInitialData = {
      movies,
      url: "/",
    };

    const homeApp = renderToString(
      React.createElement(App, { url: "/" })
    );
    const homeHTML = generateHTML(homeApp, homeInitialData);

    fs.writeFileSync(path.join(DIST_DIR, "index.html"), homeHTML);
    console.log("✅ Home page created");

    // 2. 각 영화 상세 페이지 생성 (/detail/:movieId)
    console.log(`📄 Building ${movies.length} movie detail pages...`);

    const detailDir = path.join(DIST_DIR, "detail");
    if (!fs.existsSync(detailDir)) {
      fs.mkdirSync(detailDir, { recursive: true });
    }

    // 처음 20개 영화만 빌드 (예시)
    const moviesToBuild = movies.slice(0, 20);

    for (const movie of moviesToBuild) {
      try {
        const detailResponse = await moviesApi.getDetail(movie.id);
        const movieDetail = detailResponse.data;

        const detailInitialData = {
          movies,
          movieDetail,
          url: `/detail/${movie.id}`,
        };

        const detailApp = renderToString(
          React.createElement(App, { url: `/detail/${movie.id}` })
        );

        const description = movieDetail.overview || "영화 상세 정보";
        const imageUrl = movieDetail.poster_path
          ? `https://image.tmdb.org/t/p/w1280${movieDetail.poster_path}`
          : "";
        const baseUrl = process.env.BASE_URL || "http://localhost:8080";

        const ogTags = `
      <title>${movieDetail.title} - Movie App</title>
      <meta name="description" content="${description}" />

      <meta property="og:type" content="website" />
      <meta property="og:title" content="${movieDetail.title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:url" content="${baseUrl}/detail/${movie.id}" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${movieDetail.title}" />
      <meta name="twitter:description" content="${description}" />
      <meta name="twitter:image" content="${imageUrl}" />
    `;

        const detailHTML = generateHTML(detailApp, detailInitialData, ogTags);

        const movieDir = path.join(detailDir, String(movie.id));
        if (!fs.existsSync(movieDir)) {
          fs.mkdirSync(movieDir, { recursive: true });
        }

        fs.writeFileSync(path.join(movieDir, "index.html"), detailHTML);
        console.log(`  ✅ Created detail page for "${movieDetail.title}"`);
      } catch (error) {
        console.error(`  ❌ Failed to build page for movie ${movie.id}:`, error);
      }
    }

    console.log("\n🎉 SSG build completed!");
    console.log(`📦 Generated files in: ${DIST_DIR}`);
    console.log(`   - 1 home page`);
    console.log(`   - ${moviesToBuild.length} detail pages`);
  } catch (error) {
    console.error("❌ SSG build failed:", error);
    process.exit(1);
  }
}

buildSSG();
