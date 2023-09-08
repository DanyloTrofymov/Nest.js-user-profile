import * as nodemailer from 'nodemailer';

export enum TemplateType {
  Confirm = 'confirm',
  RestorePassword = 'restorePassword'
}

const template = (confirmationURL: string) => ({
  [TemplateType.Confirm]: `
  <h1>Welcome to User profile App!</h1>
  <p>Please click the link below to confirm your account:</p>
  <a href="${confirmationURL}">Confirm Account</a>
  <p>link is active for 1 hour!</p>
  `,
  [TemplateType.RestorePassword]: `
  <h1>Restore password</h1>
  <p>Please click the link below to restore your password:</p>
  <a href="${confirmationURL}">Restore password</a>
  <p>link is active for 1 hour!</p>
  `
});

const subject = {
  [TemplateType.Confirm]: 'Confirm your account',
  [TemplateType.RestorePassword]: 'Restore password'
};

export const sendEmail = async (to: string, type: TemplateType, confirmationURL: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: Number(process.env.MAILER_PORT),
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD
    }
  });

  await transporter.sendMail({
    from: process.env.MAILER_FROM,
    to,
    subject: subject[type],
    html: template(confirmationURL)[type]
  });
};
