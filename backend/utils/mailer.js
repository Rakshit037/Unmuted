import nodemailer from "nodemailer";

export const sendBookingEmail = async ({
  userEmail,
  show,
  seats,
  total_price
}) => {
  try {

    // ✅ Check INSIDE function
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials missing in .env");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Booking Confirmation 🎟️",
      text: `
New Booking Received!

User Email: ${userEmail}

Show: ${show.title}
Venue: ${show.venue}
Date: ${show.show_date}
Time: ${show.show_time}

Seats: ${seats.join(", ")}
Total Price: ₹${total_price}
`
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully ✅");

  } catch (error) {
    console.log("Email failed:", error.message);
  }
};