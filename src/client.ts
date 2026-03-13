import axios, { AxiosInstance } from 'axios';
import { getAuthHeaders } from './auth.js';

export async function getCpiClient(): Promise<AxiosInstance> {
  const baseURL = process.env.CPI_TENANT_URL;

  if (!baseURL) {
    throw new Error('Missing CPI_TENANT_URL in .env');
  }

  const authHeaders = await getAuthHeaders();

  return axios.create({
    baseURL: `${baseURL}/api/v1`,
    headers: {
      ...authHeaders,
      Accept: 'application/json',
    },
  });
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
