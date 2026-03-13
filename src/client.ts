import axios, { AxiosInstance } from 'axios';
import { getAccessToken } from './auth.js';

let _client: AxiosInstance | null = null;

export async function getCpiClient(): Promise<AxiosInstance> {
  const token = await getAccessToken();
  const baseURL = process.env.CPI_TENANT_URL;

  if (!baseURL) {
    throw new Error('Missing CPI_TENANT_URL in .env');
  }

  _client = axios.create({
    baseURL: `${baseURL}/api/v1`,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  return _client;
}

export function formatCpiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    const code = error.response?.status;
    const message = data?.error?.message?.value || data?.message || error.message;
    return `CPI API error ${code}: ${message}`;
  }
  return String(error);
}
