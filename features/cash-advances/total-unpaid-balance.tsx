"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { CashAdvances } from "@/lib/db/get-cash-advances";

type TotalUnpaidBalanceProps = {
	cashAdvances: CashAdvances;
};

export const TotalUnpaidBalance = ({
	cashAdvances,
}: TotalUnpaidBalanceProps) => {
	const totalUnpaid = useMemo(() => {
		return cashAdvances
			.filter((advance) => !advance.is_paid)
			.reduce((sum, advance) => {
				const totalAmount = Number(advance.cash_advance);
				const paidAmount = Number(advance.paid_amount || 0);
				return sum + (totalAmount - paidAmount);
			}, 0);
	}, [cashAdvances]);

	const unpaidCount = useMemo(() => {
		return cashAdvances.filter((advance) => !advance.is_paid).length;
	}, [cashAdvances]);

	const employeeBalances = useMemo(() => {
		const balanceMap = new Map<string, { name: string; balance: number }>();

		for (const advance of cashAdvances.filter((a) => !a.is_paid)) {
			const totalAmount = Number(advance.cash_advance);
			const paidAmount = Number(advance.paid_amount || 0);
			const balance = totalAmount - paidAmount;
			const employeeName = advance.name || "Unknown";

			if (balanceMap.has(employeeName)) {
				const existing = balanceMap.get(employeeName);
				if (existing) {
					balanceMap.set(employeeName, {
						name: employeeName,
						balance: existing.balance + balance,
					});
				}
			} else {
				balanceMap.set(employeeName, {
					name: employeeName,
					balance: balance,
				});
			}
		}

		return Array.from(balanceMap.values()).sort(
			(a, b) => b.balance - a.balance,
		);
	}, [cashAdvances]);

	return (
		<Card>
			<CardContent>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Total Unpaid Balance
							</p>
							<p className="text-2xl font-bold">
								₱
								{totalUnpaid.toLocaleString("en-PH", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</p>
						</div>
						<div className="text-right">
							<p className="text-sm font-medium text-muted-foreground">
								Unpaid Records
							</p>
							<p className="text-2xl font-bold">{unpaidCount}</p>
						</div>
					</div>

					{employeeBalances.length > 0 && (
						<div className="border-t pt-4">
							<p className="text-sm font-medium text-muted-foreground mb-3">
								Balance by Employee
							</p>
							<div className="space-y-2 max-h-48 overflow-y-auto">
								{employeeBalances.map((employee) => (
									<div
										key={employee.name}
										className="flex items-center justify-between text-sm"
									>
										<span className="font-medium">{employee.name}</span>
										<span className="text-muted-foreground">
											₱
											{employee.balance.toLocaleString("en-PH", {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</span>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};
