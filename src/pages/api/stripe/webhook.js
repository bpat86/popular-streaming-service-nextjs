import { buffer } from "micro";
import Cors from "micro-cors";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SK, {
  apiVersion: "2020-08-27",
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

/**
 * Stripe webhook handler.
 * Haven't really spent much time on this yet... clearly.
 */
const handleWebhooks = async (req, res) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    let stripeEvent;

    try {
      stripeEvent = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        webhookSecret
      );
    } catch (error) {
      // On error, log and return the error message.
      // console.log(`❌ Error message: ${error.message}`);
      res.status(400).send(`Webhook Error: ${error.message}`);
      return;
    }

    // Extract the object from the event.
    const dataObject = stripeEvent.data.object;

    switch (stripeEvent.type) {
      case "invoice.payment_succeeded": {
        if (dataObject["billing_reason"] == "subscription_create") {
          // The subscription automatically activates after successful payment
          // Set the payment method used to pay the first invoice
          // as the default payment method for that subscription
          const subscription_id = dataObject["subscription"];
          const payment_method_id = dataObject["payment_method"];
          const payment_method = await stripe.paymentMethods.retrieve(
            payment_method_id
          );
          const subscription = await stripe.subscriptions.update(
            subscription_id,
            {
              // default_payment_method: payment_intent.payment_method,
              default_payment_method: payment_method.payment_method,
            }
          );
          return subscription;
        }
        break;
      }
      case "invoice.payment_failed": {
        // If the payment fails or the customer does not have a valid payment method,
        // an invoice.payment_failed event is sent, the subscription becomes past_due.
        // Use this webhook to notify your user that their payment has
        // failed and to retrieve new card details.
        break;
      }
      case "invoice.finalized": {
        // If you want to manually send out invoices to your customers
        // or store them locally to reference to avoid hitting Stripe rate limits.
        break;
      }
      case "customer.subscription.deleted": {
        if (stripeEvent.request != null) {
          // handle a subscription cancelled by your request
          // from above.
        } else {
          // handle subscription cancelled automatically based
          // upon your subscription settings.
        }
        break;
      }
      case "customer.subscription.trial_will_end": {
        // Send notification to your user that the trial will end
        break;
      }
      case "customer.deleted": {
        break;
      }
      default:
      // Unexpected event type
    }
    // Return a response to acknowledge receipt of the stripe event.
    res.json({ received: true });
  } else {
    // Reject all other request types
    res.setHeader("Allow", ["POST"]);

    // If rejected, send JSON error response back to the frontend
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
};

export default cors(handleWebhooks);
