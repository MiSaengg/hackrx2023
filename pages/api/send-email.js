import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.SENDGRID_API_KEY);
console.log(process.env);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const prescriptionData = req.body;

  console.log(req.body);
  function formatPrescription(prescriptionData) {
    let formattedText = "";
    for (let [key, value] of Object.entries(prescriptionData)) {
      formattedText += `${key}: ${value}\n`;
    }
    return formattedText;
  }

  function formatPrescriptionHTML(prescriptionData) {
    let formattedText = "<ul>";
    for (let [key, value] of Object.entries(prescriptionData)) {
      formattedText += `<li><strong>${key}:</strong> ${value}</li>`;
    }
    formattedText += "</ul>";
    return formattedText;
  }

  const msg = {
    to: prescriptionData.Email,
    from: "gcho13@my.bcit.ca",
    subject: "Prescription Information",
    text: formatPrescription(prescriptionData),
    html: `${formatPrescriptionHTML(prescriptionData)} 
           <p>Track your medication <a href="http://google.com">here</a>.</p>`,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to send email!!!!", error: error.toString() });
  }
}
