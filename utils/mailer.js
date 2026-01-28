const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetPasswordEmail = async (to, resetLink) => {
  await transporter.sendMail({
    from: `"HR System" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your password",
    html: `
      <p>You requested to reset your password.</p>
      <p>Click the link below (valid for 15 minutes):</p>
      <a href="${resetLink}">${resetLink}</a>
    `,
  });
};

module.exports = {
  sendResetPasswordEmail,
};
