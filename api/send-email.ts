import { VercelRequest, VercelResponse } from "@vercel/node"
import nodemailer from "nodemailer"

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" })
	}

	try {
		const { to, subject, text } = req.body

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS, // App password
			},
		})

		await transporter.sendMail({
			from: process.env.EMAIL_USER,
			to,
			subject,
			text,
		})

		return res.status(200).json({ success: true })
	} catch (err: any) {
		return res.status(500).json({ error: err.message })
	}
}
