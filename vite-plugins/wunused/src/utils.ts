import { glob } from "fast-glob";
import { readFileSync, statSync } from "node:fs";
import { dirname, relative } from "node:path";
import pc from "picocolors";

export function resolvePath(basePath: string, targetPath: string): string {
	return relative(basePath, targetPath);
}

export function isFile(path: string): boolean {
	try {
		return statSync(path).isFile();
	} catch {
		return false;
	}
}

export function isDirectory(path: string): boolean {
	try {
		return statSync(path).isDirectory();
	} catch {
		return false;
	}
}

export function readJsonFile<T>(path: string): T | null {
	try {
		const content = readFileSync(path, "utf-8");
		return JSON.parse(content) as T;
	} catch {
		return null;
	}
}

export function getFilesByGlob(patterns: string[], cwd: string): string[] {
	return glob(patterns, {
		cwd,
		absolute: true,
		ignore: ["**/node_modules/**", "**/dist/**"],
	});
}

export function getRelativePath(from: string, to: string): string {
	return relative(dirname(from), to);
}

export function formatFilePath(path: string, cwd: string): string {
	return relative(cwd, path);
}

export function logInfo(message: string): void {
	console.log(`${pc.cyan("ℹ")} ${message}`);
}

export function logSuccess(message: string): void {
	console.log(`${pc.green("✓")} ${message}`);
}

export function logWarning(message: string): void {
	console.log(`${pc.yellow("⚠")} ${message}`);
}

export function logError(message: string): void {
	console.log(`${pc.red("✗")} ${message}`);
}

export function logSection(title: string): void {
	console.log(`\n${pc.bold(title)}`);
}

export function formatList(items: string[], indent = 0): string {
	const spaces = "  ".repeat(indent);
	return items.map((item) => `${spaces}- ${item}`).join("\n");
}
