export namespace Util {
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
}