import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeMail(email, username) {
    const { data, error } = await resend.emails.send({
        from: "Lars <noreply@noreply.tolana.dev>",
        to: [email],
        subject: "Welcome to CozyIdle",
        html: `<strong>Welcome ${username} to CozyIdle! Hope you will enjoy your stay!</strong>`,
    });

    if (error) {
        return console.error({ error });
    }

    console.log({ data });
}
