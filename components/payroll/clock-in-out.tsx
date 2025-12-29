import type { SessionWithRole } from "@/lib/session";
import React from "react";
import { Button } from "../ui/button";

export const ClockInOut = ({ session }: { session: SessionWithRole }) => {
	return <Button variant="outline">Clock In</Button>;
};
