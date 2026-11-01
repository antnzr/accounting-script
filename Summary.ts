interface SummaryTransaction {
	tag: unknown;
	expense: unknown;
	income: unknown;
	monthKey: string | null;
	month: string | null;
}

interface CategoryTotal {
	tag: string;
	expenses: number;
}

interface MonthlyTotals {
	key: string;
	month: string;
	expenses: number;
	income: number;
	categoryTotals: Map<string, CategoryTotal>;
}

interface SummaryCategory {
	tag: string;
	expenses: number;
	percentage: number;
}

interface MonthSummary {
	categories: SummaryCategory[];
	key: string;
	month: string;
	income: number;
	expenses: number;
	balance: number;
}

interface SummaryResult {
	months: MonthSummary[];
	income: number;
	expenses: number;
	balance: number;
}

function calculateSummary(transactions: SummaryTransaction[]): SummaryResult {
	let expenses = 0;
	let income = 0;
	const monthlyTotals = new Map<string, MonthlyTotals>();

	for (const transaction of transactions) {
		const expenseValue =
			typeof transaction.expense === "number" ? transaction.expense : 0;
		const incomeValue =
			typeof transaction.income === "number" ? transaction.income : 0;

		// Overall totals include rows with missing or invalid dates.
		expenses += expenseValue;
		income += incomeValue;

		if (transaction.monthKey === null || transaction.month === null) continue;

		if (!monthlyTotals.has(transaction.monthKey)) {
			monthlyTotals.set(transaction.monthKey, {
				key: transaction.monthKey,
				month: transaction.month,
				expenses: 0,
				income: 0,
				categoryTotals: new Map<string, CategoryTotal>(),
			});
		}

		const month = monthlyTotals.get(transaction.monthKey);
		if (!month) continue;

		month.expenses += expenseValue;
		month.income += incomeValue;

		// Categorize non-zero numeric expenses only.
		if (typeof transaction.expense !== "number" || expenseValue === 0) continue;

		const originalTag =
			transaction.tag == null ? "" : String(transaction.tag).trim();
		const normalizedTag = originalTag ? originalTag.toLowerCase() : "untagged";
		const displayTag = originalTag || "Untagged";

		if (!month.categoryTotals.has(normalizedTag)) {
			month.categoryTotals.set(normalizedTag, {
				tag: displayTag,
				expenses: 0,
			});
		}

		const category = month.categoryTotals.get(normalizedTag);
		if (category) category.expenses += expenseValue;
	}

	const months = Array.from(monthlyTotals.entries())
		.sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
		.map(([, month]) => {
			const categories = Array.from(month.categoryTotals.values())
				.map((category) => ({
					tag: category.tag,
					expenses: category.expenses,
					percentage:
						month.expenses !== 0
							? (category.expenses / month.expenses) * 100
							: 0,
				}))
				.sort(
					(a, b) => b.expenses - a.expenses || a.tag.localeCompare(b.tag),
				);

			return {
				categories,
				key: month.key,
				month: month.month,
				income: month.income,
				expenses: month.expenses,
				balance: month.income - month.expenses,
			};
		});

	return {
		months,
		income,
		expenses,
		balance: income - expenses,
	};
}
