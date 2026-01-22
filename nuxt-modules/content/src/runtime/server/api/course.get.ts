import { readFileSync } from "fs";
import { glob } from "glob";
import matter from "gray-matter";
import { defineEventHandler } from "h3";

export default defineEventHandler(async () => {
	const courseDirs = await glob("content/course/*/index.md", {
		absolute: true,
	});

	const courses = courseDirs.map((filePath) => {
		const fileContent = readFileSync(filePath, "utf-8");
		const { data } = matter(fileContent);
		const courseName = filePath.split("/").at(-2) || "";

		return {
			id: courseName,
			title: data.title || courseName,
			description: data.description || "",
			icon: data.icon || "mdi:book",
			tags: data.tags || [],
			path: `/course/${courseName}`,
		};
	});

	return courses;
});
