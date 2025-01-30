import { AppUtil } from "./AppUtil";

class FetchClient {
	private _baseUrl: string;
	constructor() {
		const env = import.meta.env;
		const port = env.MODE == 'development' ? env.VITE_APP_ENV_ENDPOINT_PORT : window.location.port;
		this._baseUrl = window.location.protocol + '//' + window.location.hostname + ':' + port;

		console.log('******** FetchClient  created');
	}

	private async invoke<T>(method: string, endpoint: string, param?: any): Promise<T> {
		const response = await fetch(`${this._baseUrl}${endpoint}`, {
			method,
			headers: {
				'Content-Type': 'application/json',
			},
			body: param === undefined ? undefined : JSON.stringify(param)
		});

		return response.json();
	}

	public async get<T>(endpoint: string, param?: any): Promise<T> {
		let targetEndpoint = endpoint;
		if (param !== undefined) {
			targetEndpoint+= `?${AppUtil.isString(param) ? param : new URLSearchParams(param)}`;
		}
		
		return this.invoke('GET', targetEndpoint, param);
	}

	public async post<T>(endpoint: string, param?: any): Promise<T> {
		return this.invoke('POST', endpoint, param);
	}

	public async put<T>(endpoint: string, param?: any): Promise<T> {
		return this.invoke('PUT', endpoint, param);
	}

	public async delete<T>(endpoint: string, param?: any): Promise<T> {
		return this.invoke('DELETE', endpoint, param);
	}
}

export const ApiClient = new FetchClient();