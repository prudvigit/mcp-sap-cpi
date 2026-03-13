import axios from 'axios';

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

export async function getAccessToken(): Promise<string> {
  const now = Date.now();

  if (tokenCache && tokenCache.expiresAt > now + 60000) {
    return tokenCache.accessToken;
  }

  const { CPI_TOKEN_URL, CPI_CLIENT_ID, CPI_CLIENT_SECRET } = process.env;

  if (!CPI_TOKEN_URL || !CPI_CLIENT_ID || !CPI_CLIENT_SECRET) {
    throw new Error('Missing OAuth2 config. Set CPI_TOKEN_URL, CPI_CLIENT_ID, CPI_CLIENT_SECRET in .env');
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', CPI_CLIENT_ID);
  params.append('client_secret', CPI_CLIENT_SECRET);

  const response = await axios.post(CPI_TOKEN_URL, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const { access_token, expires_in } = response.data;

  tokenCache = {
    accessToken: access_token,
    expiresAt: now + expires_in * 1000,
  };

  return access_token;
}
