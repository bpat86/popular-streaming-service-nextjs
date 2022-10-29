import axios from "axios";
import { buffer } from "micro";
import Cors from "micro-cors";
import Stripe from "stripe";

import { API_URL } from "@/config/index";

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

// Reformat Stripe amount data for Strapi | 1799 -> 17.99
const stripeAmount = (amount) => amount / 100;
// Reformat Stripe date format for Strapi
const secondsToISOString = (seconds) => {
  const date = new Date(seconds * 1000);
  return date.toISOString();
};

/**
 * Create an `incomplete` order in Strapi via webhook
 * @param {any} subscription
 * @returns
 */
const customerSubscriptionCreated = async (subscription) => {
  // console.log(`🥳 Subscription created: ${subscription?.id}`);
  // Define the body parameters to be sent to Strapi
  const body = {
    email: subscription.customer_email,
    plan: subscription.plan.id,
    subscriptionId: subscription.id,
    customerId: subscription.customer,
    currency: subscription.plan.currency,
    monthlyPrice: stripeAmount(subscription.plan.amount),
    startDate: secondsToISOString(subscription.start_date),
    currentPeriodStart: secondsToISOString(subscription.current_period_start),
    currentPeriodEnd: secondsToISOString(subscription.current_period_end),
  };
  try {
    // Retrieve the current Strapi `bearer` token from the Stripe customer object
    const config = {
      headers: {
        Authorization: `Bearer ${subscription.metadata?.token}`,
      },
    };
    // Define the create order api url
    const strapiOrdersUrl = `${API_URL}/orders`;
    // Create an `incomplete` order in Strapi
    const orderResponse = await axios.post(strapiOrdersUrl, body, config);
    const orderData = await orderResponse.data;
    return res.status(200).send({ orderData });
  } catch (error) {
    return error.message;
  }
};

/**
 * Delete a user in Strapi
 * @param {any} customer
 * @returns
 */
const customerDeleted = async (customer) => {
  // Did it work?
  console.log(`😪 Customer deleted: ${customer.id}`);
  console.log(customer);
  try {
    // Retrieve the current Strapi `bearer` token from the Stripe customer object
    const config = {
      headers: {
        Authorization: `Bearer ${customer.metadata?.token}`,
      },
    };
    // Define the delete customer + delete order api urls
    const strapiDeleteCustomerOrderUrl = `${API_URL}/orders/customer/${customer.id}`;
    const strapiDeleteCustomerUrl = `${API_URL}/users/customer/${customer.id}`;
    // Delete the customer's order
    const orderResponse = await axios.delete(
      strapiDeleteCustomerOrderUrl,
      config
    );
    // Delete the customer
    const customerResponse = await axios.delete(
      strapiDeleteCustomerUrl,
      config
    );
    if (
      orderResponse.data.status === 200 &&
      customerResponse.data.status === 200
    ) {
      return { user: customerResponse.data, order: orderResponse.data };
    }
  } catch (error) {
    return error.message;
  }
};

const chargeSucceeded = async (charge) => {
  console.log(`💵 Charge id: ${charge.id}`);
  console.log(charge);
};

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
      console.log(`❌ Error message: ${error.message}`);
      res.status(400).send(`Webhook Error: ${error.message}`);
      return;
    }

    // Successfully constructed event.
    // console.log("✅ Success:", stripeEvent.id);

    // Extract the object from the event.
    const dataObject = stripeEvent.data.object;

    switch (stripeEvent.type) {
      case "invoice.payment_succeeded":
        if (dataObject["billing_reason"] == "subscription_create") {
          // The subscription automatically activates after successful payment
          // Set the payment method used to pay the first invoice
          // as the default payment method for that subscription
          const subscription_id = dataObject["subscription"];
          const payment_intent_id = dataObject["payment_intent"];
          const payment_method_id = dataObject["payment_method"];

          // Retrieve the payment intent used to pay the subscription
          const payment_intent = await stripe.paymentIntents.retrieve(
            payment_intent_id
          );
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

          console.log(
            "Default payment method set for subscription:" +
              payment_method.payment_method
          );
          return subscription;
        }

        break;
      case "invoice.payment_failed":
        // If the payment fails or the customer does not have a valid payment method,
        //  an invoice.payment_failed event is sent, the subscription becomes past_due.
        // Use this webhook to notify your user that their payment has
        // failed and to retrieve new card details.
        break;
      case "invoice.finalized":
        // If you want to manually send out invoices to your customers
        // or store them locally to reference to avoid hitting Stripe rate limits.
        break;
      case "customer.subscription.deleted":
        if (stripeEvent.request != null) {
          // handle a subscription cancelled by your request
          // from above.
        } else {
          // handle subscription cancelled automatically based
          // upon your subscription settings.
        }
        break;
      case "customer.subscription.trial_will_end":
        // Send notification to your user that the trial will end
        break;
      case "customer.deleted":
        const customer = stripeEvent.data.object;
        customerDeleted(customer);
        break;
      default:
      // Unexpected event type
    }

    // if ("payment_intent.succeeded" === stripeEvent.type) {
    //   const paymentIntent = stripeEvent.data.object;
    //   console.log(stripeEvent.data.object);
    //   console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);
    // } else if ("payment_intent.payment_failed" === stripeEvent.type) {
    //   const paymentIntent = stripeEvent.data.object;
    //   console.log(stripeEvent.data.object);
    //   console.log(
    //     `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
    //   );
    // } else if ("charge.succeeded" === stripeEvent.type) {
    //   const charge = stripeEvent.data.object;
    //   await chargeSucceeded(charge);
    // } else if ("customer.created" === stripeEvent.type) {
    //   const customer = stripeEvent.data.object;
    //   console.log(`🥳 Customer created: ${customer.id}`);
    //   console.log(stripeEvent.data.object);
    // } else if ("customer.updated" === stripeEvent.type) {
    //   // const customer = stripeEvent.data.object;
    //   // console.log(`🥳 Customer updated: ${customer.id}`);
    // } else if ("customer.subscription.created" === stripeEvent.type) {
    //   // Create an order in Strapi
    //   // const subscription = stripeEvent.data.object;
    //   // await customerSubscriptionCreated(subscription);
    // } else if ("customer.subscription.updated" === stripeEvent.type) {
    //   // const subscription = stripeEvent.data.object;
    //   // console.log(`🥳 Subscription updated: ${subscription.id}`);
    // } else if ("customer.deleted" === stripeEvent.type) {
    //   const customer = stripeEvent.data.object;
    //   // Delete the customer in Strapi
    //   customerDeleted(customer);
    // } else {
    //   // console.warn(event);
    //   // console.warn(`🤷‍♀️ Unhandled event type: ${stripeEvent.type}`);
    // }

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
