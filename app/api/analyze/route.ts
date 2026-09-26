import { NextRequest } from "next/server";
import { POST as triagePOST, GET as triageGET, OPTIONS as triageOPTIONS } from "../triage/route";

/**
 * Legacy API endpoint alias.
 * @deprecated Use /api/triage instead.
 */
export async function POST(req: NextRequest) {
  const response = await triagePOST(req);
  response.headers.set("Warning", '299 - "/api/analyze is deprecated, please use /api/triage instead"');
  response.headers.set("Deprecation", "true");
  return response;
}

export { triageGET as GET, triageOPTIONS as OPTIONS };
