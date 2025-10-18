const express = require("express");
const cors = require("cors");
const Brevo = require("@getbrevo/brevo");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const allowedOrigins = ["https://oussama-beghdi.netlify.app/", "http://localhost:5500"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS refusé pour :", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());

const client = new Brevo.TransactionalEmailsApi();
client.authentications["apiKey"].apiKey = process.env.BREVO_API_KEY;
app.get("/", (req, res) => {
  res.json({ message: "CORS OK ✅" });
});
app.post("/send-email", async (req, res) => {
  const { username, email, tel, message } = req.body;

  try {
    const sendSmtpEmail = {
      sender: { email: "mxzlatan754@gmail.com", name: "Ton Nom" },
      to: [{ email: "ae.wbdb@gmail.com" }],
      subject: `Nouveau message de ${username}`,
      htmlContent: `
        <h3>Nouveau message depuis ton site</h3>
        <p><strong>Nom :</strong> ${username}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${tel}</p>
        <p><strong>Message :</strong><br>${message}</p>
      `,
    };

    await client.sendTransacEmail(sendSmtpEmail);
    res.json({ message: "✅ Votre message a bien été envoyé !" });
  } catch (error) {
    console.error("Erreur Brevo :", error);
    res.status(500).json({ message: "❌ Une erreur est survenue lors de l’envoi de l’e-mail." });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
