import { readFileSync } from "fs";
import { glob } from "glob";
import matter from "gray-matter";
import { createError, defineEventHandler } from "h3";
import { join } from "path";

export default defineEventHandler(async (_event) => {
	try {
		const contentDir = join(process.cwd(), "content", "blog");
		const files = await glob("*.md", { cwd: contentDir, absolute: false });

		const posts = files.map((file) => {
			const filePath = join(contentDir, file);
			const fileContent = readFileSync(filePath, "utf-8");
			const { data, content } = matter(fileContent);

			const slug = file.replace(/\.md$/, "");

			return {
				slug,
				title: data.title || slug,
				excerpt: data.excerpt || content.slice(0, 150).replace(/[#*`]/g, "") + "...",
				date: data.date || new Date().toISOString(),
				category: data.category || null,
				tags: data.tags || [],
				cover: data.cover || data.image || null,
			};
		});

		return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	} catch {
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to fetch blog posts",
		});
	}
});
