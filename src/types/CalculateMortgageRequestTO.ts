import {PaymentSchedule} from "./PaymentSchedule";

export interface CalculateMortgageRequestTO {
	propertyPrice: number;
	downPayment: number;
	annualInterestRatePercentage: number;
	amortizationPeriod: number;
	paymentSchedule: PaymentSchedule;
}
