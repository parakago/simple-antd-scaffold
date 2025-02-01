export namespace AppUtil {
	export function isArray(value: any): boolean {
		return Array.isArray(value);
	}

	export function isDate(value: any): boolean {
		return value instanceof Date;
	}

	export function isString(value: any): boolean {
		return typeof value === 'string';
	}

	export function isFunction(value: any): boolean {
		return typeof value === 'function';
	}
	
	export function isNumber(value: any): boolean {
		return typeof value === 'number' || value instanceof Number;
	}

	export function isBoolean(value: any): boolean {
		return typeof value === 'boolean';
	}

	export function classNames(baseClassName: string, ...args: (string | undefined)[]): string {
		const cls = [baseClassName];
		args.forEach(arg => {
			if (arg != undefined) cls.push(arg);
		});
		
		return cls.join(' ');
	}

	export function isEmpty(value: string | null | undefined): boolean {
		return value === undefined || value === null || value === '';
	}

	export function isNotEmpty(value: string | null | undefined): boolean {
		return !isEmpty(value);
	}

	export function nvl(value: string | undefined | null, defaultValue: string = ''): string {
		return value === null || value === undefined ? defaultValue : value;
	}

	export function randomUUID(): string {
		return self.crypto.randomUUID();
	}

	export function getBrowserPath(): string {
		let currentPath = window.location.hash;
		if (currentPath.indexOf('#') != -1) {
			currentPath = currentPath.replace(/\#/g, '');
		}
	
		return currentPath;
	}

	export function extractCurrentWebMenuPath(): [string | undefined, string | undefined] {
		const paths = getBrowserPath().split('/').filter((path) => path !== '');
		const mainWebMenuPath = paths.length > 0 ? `/${paths[0]}` : undefined;
		const subWebMenuPath = paths.length > 1 ? `/${paths[0]}/${paths[1]}` : undefined;
		return [mainWebMenuPath, subWebMenuPath];
	}
}