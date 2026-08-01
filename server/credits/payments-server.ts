import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import {
	getAllPendingPaymentsDB,
	getPendingPaymentsByUserDB,
} from "../../db/credits/payments/payments-db"

const userIdValidator = z.object({
	userId: z.string(),
})

export const getAllPaymentsServer = createServerFn().handler(async () => {
	return await getAllPendingPaymentsDB()
})

export const getPaymentsByUserServer = createServerFn()
	.inputValidator(userIdValidator)
	.handler(async ({ data }: { data: { userId: string } }) => {
		return await getPendingPaymentsByUserDB(data.userId)
	})
