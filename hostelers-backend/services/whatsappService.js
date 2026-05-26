const twilio = require("twilio");

// You can find these on your Twilio Console
const accountSid = process.env.ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN || process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";
const myNumber = process.env.MY_WHATSAPP_NUMBER || "whatsapp:+918340982242"; 

let client = null;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

const sendOrderNotification = async (order, retries = 2) => {
  if (!client) {
    console.warn("❌ Twilio credentials missing. WhatsApp message NOT sent.");
    return { success: false, error: "Missing Twilio Credentials" };
  }

  try {
    const itemsList = order.items
      .map(item => `${item.name} x${item.quantity}`)
      .join(", ");

    const messageBody = `*New Order Received* 🚀\n\n🆔 *Order ID*: ${order.id || order.order_id}\n👤 *Customer*: ${order.customerName || order.customer_name}\n📞 *Phone*: ${order.phone}\n🍔 *Items*: ${itemsList}\n💰 *Total*: ₹${order.total}\n📍 *Address*: ${order.address}\n💳 *Payment*: ${order.status === "placed" || order.status === "Paid" ? "Paid" : order.status}`;

    console.log("Sending WhatsApp to:", myNumber);

    const message = await client.messages.create({
      body: messageBody,
      from: twilioNumber,
      to: myNumber
    });

    console.log(`✅ WhatsApp notification sent successfully! SID: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error("❌ Failed to send WhatsApp notification:", error.message);
    if (retries > 0) {
      console.log(`Retrying... (${retries} left)`);
      return await sendOrderNotification(order, retries - 1);
    }
    return { success: false, error: error.message };
  }
};

module.exports = { sendOrderNotification };
