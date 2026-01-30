export class DataGenerator {
	public static generateId(): string {
		return Math.random().toString(36).substring(2, 15);
	}

	public static generateEmail(): string {
		const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
		const domain = domains[Math.floor(Math.random() * domains.length)];
		const username = Math.random().toString(36).substring(2, 10);
		return `${username}@${domain}`;
	}

	public static generateName(): string {
		const firstNames = ["John", "Jane", "Bob", "Alice", "Charlie", "Diana", "Eve", "Frank"];
		const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"];
		const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
		const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
		return `${firstName} ${lastName}`;
	}

	public static generatePhone(): string {
		const areaCode = Math.floor(Math.random() * 900) + 100;
		const prefix = Math.floor(Math.random() * 900) + 100;
		const line = Math.floor(Math.random() * 9000) + 1000;
		return `(${areaCode}) ${prefix}-${line}`;
	}

	public static generateDate(): string {
		const date = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
		return date.toISOString();
	}

	public static generateNumber(min = 0, max = 100): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	public static generateBoolean(): boolean {
		return Math.random() > 0.5;
	}

	public static generateArray<T>(fn: () => T, min = 1, max = 5): T[] {
		const length = Math.floor(Math.random() * (max - min + 1)) + min;
		return Array.from({ length }, fn);
	}

	public static generateObject<T>(fn: () => T, count = 5): Record<string, T> {
		const obj: Record<string, T> = {};
		for (let i = 0; i < count; i++) {
			obj[`key${i}`] = fn();
		}
		return obj;
	}
}
