import type { VercelRequest, VercelResponse } from "@vercel/node"
import nodemailer from "nodemailer"

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" })
	}

	const { email, subject, html } = req.body

	if (!email || !subject || !html) {
		return res.status(400).json({ error: "Missing required fields" })
	}

	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 465,
			secure: true,
			auth: {
				user: process.env.EMAIL_APP_NAME,
				pass: process.env.EMAIL_APP_PASSWORD, // 16-char app password from Gmail
			},
		})

		await transporter.sendMail({
			from: `"Digital World Commercial" <${process.env.EMAIL_APP_NAME}>`,
			to: email,
			subject,
			html,
		})

		return res.status(200).json({ success: true, message: "Email sent" })
	} catch (err: any) {
		console.error("[Email Error]", err.message)
		return res.status(500).json({ success: false, error: err.message })
	}
}
