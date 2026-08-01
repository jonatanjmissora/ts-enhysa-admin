import { queryOptions } from "@tanstack/react-query"
import {
	getAllPaymentsServer,
	getPaymentsByUserServer,
} from "../../server/credits/payments-server"

export const allPaymentsQueryOptions = queryOptions({
	queryKey: ["credit_payments", "all"],
	queryFn: () => getAllPaymentsServer(),
	// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})

export const creditPaymentsByUserQueryOptions = ({
	userId,
}: {
	userId: string
}) =>
	queryOptions({
		queryKey: ["credit_payments", userId],
		queryFn: () => getPaymentsByUserServer({ data: { userId } }),
		// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
	})
