import fs from "fs";
import matter from "gray-matter";
import path from "path";
import moment from "moment";
import { remark } from "remark";
import html from "remark-html";

type Article = {
  id: string;
  image?: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  tags: string[];
};

const articlesDirectory = path.join(process.cwd(), "articles");

export const getSortedArticles = (): Article[] => {
  const fileNames = fs.readdirSync(articlesDirectory);

  const allArticlesData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "");
    const fullPath = path.join(articlesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf-8");

    const matterResult = matter(fileContents);

    return {
      id,
      image: matterResult.data.image,
      title: matterResult.data.title,
      description: matterResult.data.description,
      date: moment(matterResult.data.date, "YYYY-MM-DD").format("MMM D, YYYY"),
      time: matterResult.data.time,
      tags: matterResult.data.tags,
      type: matterResult.data.type,
    };
  });

  return allArticlesData.sort((a, b) => {
    const format = "MMM D, YYYY";
    const dateA = moment(a.date, format);
    const dateB = moment(b.date, format);
    if (dateA.isBefore(dateB)) {
      return -1;
    } else if (dateB.isAfter(dateA)) {
      return 1;
    } else {
      return 0;
    }
  });
};

export const getArticleData = async (id: string) => {
  const fullPath = path.join(articlesDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf-8");
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    image: matterResult.data.image,
    title: matterResult.data.title,
    description: matterResult.data.description,
    date: moment(matterResult.data.date, "YYYY-MM-DD").format("MMM D, YYYY"),
    time: matterResult.data.time,
  };
};
