import PolicyLayout from "../PolicyLayout";

export const metadata = { title: "Shipping & Delivery · Intaara" };

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout title="Shipping & Delivery">
      <p>
        At <strong className="font-semibold text-gray-800">INTAARA</strong>,
        we&rsquo;re committed to ensuring your jewellery reaches you safely and
        as quickly as possible. Orders are generally prepared and dispatched
        within <strong className="font-semibold text-gray-800">24 hours</strong>{" "}
        of successful order confirmation.
      </p>

      <p>Please keep the following in mind:</p>

      <ul className="space-y-2 pl-1">
        <li>
          Delivery timelines depend on your location and the availability of the
          items you&rsquo;ve ordered.
        </li>
        <li>
          As soon as your package is dispatched, we&rsquo;ll send you the
          tracking details via{" "}
          <strong className="font-semibold text-gray-800">
            WhatsApp and an email via shiprocket
          </strong>{" "}
          so you can monitor its journey.
        </li>
        <li>
          Although we work hard to deliver every order on time, occasional
          delays may occur due to factors beyond our control, such as severe
          weather, courier network disruptions, or public holidays.
        </li>
      </ul>

      <p>
        If you need any assistance regarding your shipment or have questions
        about your order, our support team is here to help. Simply reach out to
        us at{" "}
        <a
          href="mailto:help@intaara.in"
          className="font-medium text-sage-700 underline underline-offset-2 hover:text-sage-800"
        >
          help@intaara.in
        </a>
        .
      </p>
    </PolicyLayout>
  );
}
