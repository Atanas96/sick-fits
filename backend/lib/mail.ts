import { createTransport, getTestMessageUrl } from 'nodemailer';

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function makeANiceEmail(text: string) {
  return `
        <div className="email" style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px;
        ">
        <h2>Hello There !</h2>
        <p>${text}</p>
        <p>Atanas</p>
        
        </div>
    `;
}

interface MailResponse {
  message: string;
}

export async function sendPasswordResetEmail(
  resetToken: string,
  to: string
): Promise<void> {
  // email the user a token
  const info = (await transport.sendMail({
    to,
    from: 'atanas@gmail.com',
    subject: 'Your password reset token!',
    html: makeANiceEmail(`Your password reset token is here
        <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click Here To Reset</a>
    
    `),
  })) as MailResponse;
  if (process.env.MAIL_USER.includes('etheral.email')) {
    console.log(`💌 Message Sent!  Preview it at ${getTestMessageUrl(info)}`);
  }
  console.log(info);
}
