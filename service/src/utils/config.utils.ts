import type { Configuration } from '../types/index.types';

export const readConfiguration = (): Configuration => {
  const envVars: Configuration = {
    clientId: process.env.CTP_CLIENT_ID as string,
    clientSecret: process.env.CTP_CLIENT_SECRET as string,
    projectKey: process.env.CTP_PROJECT_KEY as string,
    authUrl: process.env.CTP_AUTH_URL as string,
    apiUrl: process.env.CTP_API_URL as string,
    otlpExporterEndpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    otlpExporterEndpointApiKey: process.env
      .OTEL_EXPORTER_OTLP_ENDPOINT_API_KEY as string,
  };

  return envVars;
};
