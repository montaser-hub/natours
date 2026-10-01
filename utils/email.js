const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Natours <${process.env.EMAIL_FROM || 'hello@natours.local'}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production' && process.env.SENDGRID_PASSWORD) {
      //Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    // No SMTP configured (typical local setup): render the email and print it
    // instead of failing the request that triggered it.
    if (!process.env.EMAIL_HOST) {
      return nodemailer.createTransport({ jsonTransport: true });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) render HTML based on the template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });
    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html, { wordwrap: 100 })
    };
    // 3) Create a transport and send email
    const info = await this.newTransport().sendMail(mailOptions);
    if (info.message && !process.env.EMAIL_HOST) {
      console.log(
        `\n📧 [dev email] To: ${this.to} | ${subject}\n${mailOptions.text}\n`
      );
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Password Reset token (valid for only 10 minutes)'
    );
  }
};
