import axios, {AxiosRequestConfig} from 'axios';
import configManager from '@/modules/_configSettings/config';
export interface PaginationResponse<T> {
	total_data: number;
	offset: number;
	limit: number;
	status: string;
	data: T[]; // Generic array of data
}

export interface ApiRequest<T> {
	status: string;
	message: string;
	data: T | T[];
}

export const getAuthToken = (): string | null => {
	return window.localStorage.getItem('auth_token');
};

export const setAuthHeader = (token: string | null): void => {
	if (token !== null) {
		window.localStorage.setItem('auth_token', token);
	} else {
		window.localStorage.removeItem('auth_token');
	}
};

axios.defaults.baseURL = configManager.getBaseURL();

export const request = async <T>(
	method: AxiosRequestConfig['method'],
	url: string,
	data?: unknown,
): Promise<T> => {
	const headers: Record<string, string> = {};

	const authToken = getAuthToken();
	if (authToken !== null && authToken !== 'null') {
		headers.Authorization = `Bearer ${authToken}`;
	}
	if (data instanceof FormData) {
		headers['Content-Type'] = 'multipart/form-data';
	} else {
		headers['Content-Type'] = 'application/json';
	}

	return axios({
		method: method,
		url: url,
		headers: headers,
		data: data,
	}).then((response) => response.data);
};
