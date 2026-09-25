"use client";

import React from "react";
import { IntegrityAudit } from "./IntegrityAudit";
import { VerificationReport } from "@/lib/types";

interface IntegrityCheckProps {
  verification: VerificationReport;
}

export function IntegrityCheck({ verification }: IntegrityCheckProps) {
  return <IntegrityAudit verification={verification} />;
}
