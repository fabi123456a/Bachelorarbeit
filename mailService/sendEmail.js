const nodemailer = require("nodemailer");

const sendEmail = async (to1, subject1, text1) => {
  // Konfiguration des Transporters
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "leistellenkonfigurator@gmail.com",
      pass: "mchjrtlhsvosdzjo",
    },
  });

  // E-Mail-Details
  const mailOptions = {
    from: "leistellenkonfigurator@gmail.com",
    to: to1,
    subject: subject1,
    text: text1,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw new Error(error);
    } else {
      console.log("Eine E-Mail wurde an " + to1 + " gesendet.");
      return true;
    }
  });
};

module.exports = sendEmail;
