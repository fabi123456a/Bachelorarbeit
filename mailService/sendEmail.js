const nodemailer = require("nodemailer");

const sendEmail = async (to1, subject1, text1) => {
  // Konfiguration des Transporters
  const transporter = nodemailer.createTransport({
    service: "gmail", // Hier den entsprechenden E-Mail-Dienst wählen
    auth: {
      user: "leistellenkonfigurator@gmail.com", // mchjrtlhsvosdzjo
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
      console.log("Email Sent");
      return true;
    }
  });
};

module.exports = sendEmail;
