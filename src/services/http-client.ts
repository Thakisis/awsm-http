import { RequestData, ResponseData } from "../types";
import { invoke } from "@tauri-apps/api/core";

interface RustResponse {
  status: number;
  status_text: string;
  headers: Record<string, string>;
  body: string;
  time: number;
  size: number;
}

export class HttpClient {
  static async send(request: RequestData): Promise<ResponseData> {
    try {
      const headers: Record<string, string> = {};
      request.headers.forEach((h) => {
        if (h.enabled && h.key) {
          headers[h.key] = h.value;
        }
      });

      let body: string | null = null;
      if (request.method !== "GET" && request.body.type !== "none") {
        body = request.body.content;
      }

      const response = await invoke<RustResponse>("make_request", {
        method: request.method,
        url: request.url,
        headers,
        body,
      });

      let parsedBody: unknown = response.body;
      try {
        parsedBody = JSON.parse(response.body);
      } catch {
        // Not JSON
      }

      return {
        status: response.status,
        statusText: response.status_text,
        time: response.time,
        size: response.size,
        headers: response.headers,
        body: parsedBody,
        rawBody: response.body,
      };
    } catch (error: any) {
      return {
        status: 0,
        statusText: "Error",
        time: 0,
        size: 0,
        headers: {},
        body: { error: error.message || String(error) },
        rawBody: error.message || String(error),
      };
    }
  }
}
