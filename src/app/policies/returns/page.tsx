import PolicyLayout from "../PolicyLayout";

export const metadata = { title: "Refund & Exchange · Intaara" };

export default function ReturnsPage() {
  return (
    <PolicyLayout title="Refund & Exchange Policy">
      {/* Highlighted notice box */}
      <div className="rounded-lg border-2 border-gray-900 p-5">
        <p className="text-base font-semibold leading-relaxed text-gray-900">
          An unboxing video must be shared within 24 hours of delivery for any
          issue to be considered. Without it, we will not be able to process
          your request.
        </p>
      </div>

      <h2 className="pt-4 text-base font-semibold text-gray-900">
        14-Day Easy Exchange Policy
      </h2>
      <p>
        We offer a smooth and hassle-free exchange within 14 days of delivery
        for the following cases:
      </p>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-left text-[15px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 font-semibold text-gray-900">
                Issue Faced
              </th>
              <th className="px-4 py-3 font-semibold text-gray-900">
                Exchange Process
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-3 text-gray-600">Damaged Item</td>
              <td className="px-4 py-3 text-gray-600">
                Exchange with the same item
              </td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-3 text-gray-600">Wrong Item Received</td>
              <td className="px-4 py-3 text-gray-600">
                Exchange with the same item
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-600">Size Issue (Non-Adjustable Rings only)</td>
              <td className="px-4 py-3 text-gray-600">
                Exchange with the same variant (&#8377;200 shipping fee
                applies). Please refer to our Ring Size Guide.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="pt-4 text-base font-semibold text-gray-900">
        Important Notes
      </h2>
      <ul className="space-y-2 pl-1">
        <li>
          Size-related exchanges are only applicable to non-adjustable rings.
        </li>
        <li>Exchanges are allowed only once per order.</li>
        <li>
          A &#8377;200 shipping and handling fee will apply for ring size
          exchanges.
        </li>
        <li>
          If the exact product is unavailable, our team will assist you with the
          closest available variant or provide store credit.
        </li>
      </ul>

      <h2 className="pt-4 text-base font-semibold text-gray-900">
        Returns for Orders with Complimentary Gifts
      </h2>
      <p>
        At Intaara, every gifting / complimentary jewellery item included with
        your order is crafted to the same premium standards as our regular
        collection. Therefore, if your order included any free or gifted
        jewellery as part of a promotional offer, all complimentary items must
        also be returned along with the purchased products.
      </p>
      <p>
        All returned orders undergo a quality inspection upon arrival. If any
        complimentary or gifted item is found to be missing, only partially
        returned, or damaged beyond normal inspection, the refund will be
        limited to 40% of the amount paid for the order.
      </p>

      <h2 className="pt-4 text-base font-semibold text-gray-900">
        To Request an Exchange
      </h2>
      <ul className="space-y-2 pl-1">
        <li>
          Contact us at{" "}
          <a
            href="mailto:help@intaara.in"
            className="font-medium text-sage-700 underline underline-offset-2 hover:text-sage-800"
          >
            help@intaara.in
          </a>
        </li>
        <li>
          Share your Order ID along with a clear image of the product.
        </li>
        <li>
          Our team will review your request and guide you through the exchange
          process.
        </li>
      </ul>

      <h2 className="pt-4 text-base font-semibold text-gray-900">
        Cancellations
      </h2>

      <h3 className="pt-2 text-sm font-semibold text-gray-800">
        1. No Cancellations
      </h3>
      <p>
        Once an order has been placed, it cannot be cancelled. We begin
        processing orders immediately to ensure timely dispatch; therefore, all
        sales are considered final.
      </p>

      <h3 className="pt-2 text-sm font-semibold text-gray-800">
        2. Order Confirmation
      </h3>
      <p>
        Please review your order carefully before completing your purchase. By
        placing an order, you acknowledge and agree that cancellations are not
        permitted.
      </p>

      <h3 className="pt-2 text-sm font-semibold text-gray-800">
        3. Customized &amp; Personalized Products
      </h3>
      <p>
        Any customized or personalized products are non-cancellable,
        non-returnable, and non-refundable once the order has been confirmed.
      </p>

      <h2 className="pt-4 text-base font-semibold text-gray-900">Contact Us</h2>
      <p>
        If you have any further questions regarding your order, please contact
        our customer support team:
      </p>
      <p>
        Email:{" "}
        <a
          href="mailto:help@intaara.in"
          className="font-medium text-sage-700 underline underline-offset-2 hover:text-sage-800"
        >
          help@intaara.in
        </a>
      </p>
      <p>We&rsquo;ll be happy to assist you.</p>

      <p className="text-sm font-medium text-gray-500">
        *Please Note: An unboxing video must be shared within 24 hours of
        delivery for any issue related to damaged, incorrect, or missing
        products. Requests received without an unboxing video may not be
        eligible for exchange or resolution.
      </p>
    </PolicyLayout>
  );
}
