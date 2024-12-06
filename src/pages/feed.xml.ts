import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIRoute } from "astro";
import { experimental_AstroContainer } from "astro/container";
import { getCollection, render, type CollectionEntry } from "astro:content";

const renderPostContent = async (
  post: CollectionEntry<"posts">
): Promise<string | undefined> => {
  const container = await experimental_AstroContainer.create();
  const { Content } = await render(post);
  const htmlContent = await container.renderToString(Content);

  return htmlContent;
};

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error("site missing in config");

  const posts = await getCollection("posts");
  const items: RSSFeedItem[] = await Promise.all(
    posts.map(async (post) => {
      return {
        content: await renderPostContent(post),
        title: post.data.title,
      };
    })
  );

  return rss({
    description: "Feed description",
    items,
    site,
    title: "Feed title",
  });
};
