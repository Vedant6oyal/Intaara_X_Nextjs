import PolicyLayout from "../PolicyLayout";

export const metadata = { title: "Terms of Service · Intaara" };

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms of Service">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        Last updated: April 30, 2026
      </p>

      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
        use of the website{" "}
        <a
          href="https://intaara.in"
          className="font-medium text-sage-700 underline underline-offset-2 hover:text-sage-800"
        >
          https://intaara.in
        </a>{" "}
        operated by INTAARA (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or
        &ldquo;our&rdquo;). By accessing or using the Website, you agree to be
        bound by these Terms.
      </p>

      <h2 className="pt-4 text-base font-semibold text-gray-900">
        1. Compliance with Laws
      </h2>
      <ul className="space-y-2 pl-1">
        <li>
          You agree to comply with all applicable laws and regulations of India
          while using the Website. This includes, but is not limited to, the
          Consumer Protection Act (2019) and the Information Technology Act
          (2000).
        </li>
      </ul>

      <h2 className="pt-4 text-base font-semibold text-gray-900">
        2. User Accounts
      </h2>
      <ul className="space-y-2 pl-1">
        <li>
          You may create an account on the Website to access certain features
          and functionalities.
        </li>
        <li>
          You are responsible for maintaining the confidentiality of your
          account information, including your password.
        </li>
        <li>
          You are responsible for all activity that occurs under your account.
        </li>
      </ul>

      <h2 className="pt-4 text-base font-semibold text-gray-900">
        3. Intellectual Property
      </h2>
      <ul className="space-y-2 pl-1">
        <li>
          The Website and its content, including but not limited to trademarks,
          copyrights, and logos, are the property of INTAARA or our licensors.
        </li>
        <li>
          You may not use any of our intellectual property without our express
          written permission.
        </li>
      </ul>

      <h2 className="pt-4 text-base font-semibold text-gray-900">
        4. Orders and Payment
      </h2>
      <ul className="space-y-2 pl-1">
        <li>
          When you place an order on the Website, you agree to pay the purchase
          price listed on the Website in Indian Rupees (INR).
        </li>
        <li>
          We accept various payment methods as listed on the Website, which may
          include popular Indian payment gateways.
        </li>
        <li>
          We reserve the right to cancel any order at any time for any reason,
          including but not limited to:
          <ul className="mt-1.5 space-y-1 pl-4">
            <li>Product unavailability</li>
            <li>Payment issues</li>
            <li>Suspected fraudulent activity</li>
          </ul>
        </li>
      </ul>

      <h2 className="pt-4 text-base font-semibold text-gray-900">
        5. Modifications to the Service and Prices
      </h2>
      <ul className="space-y-2 pl-1">
        <li>Prices for our products are subject to change without notice.</li>
        <li>
          We reserve the right at any time to modify or discontinue the Service
          (or any part or content thereof) without notice at any time.
        </li>
        <li>
          We shall not be liable to you or to any third-party for any
          modification, price change, suspension or discontinuance of the
          Service.
        </li>
      </ul>

      <h2 className="pt-4 text-base font-semibold text-gray-900">
        6. Shipping and Returns
      </h2>
      <ul className="space-y-2 pl-1">
        <li>
          Shipping costs and estimated delivery times will be displayed at
          checkout and may vary depending on your location.
        </li>
        <li>
          You may return or exchange your purchase according to our return
          policy, which is available on the Website. Our return policy must
          comply with the Consumer Protection (E-Commerce) Rules, 2020.
        </li>
        <li>
          We will process returns and exchanges within a reasonable timeframe,
          as mandated by Indian consumer protection laws.
        </li>
        <li>
          Product(s) can only be returned within 48 hours, if the jewellery
          piece is clearly shown as missing or defective in the unboxing video.
          Product(s) cannot be returned under any other circumstances. Unboxing
          video is mandatory for all cases including quality and size issues as
          well.
        </li>
      </ul>

      <h2 className="pt-4 text-base font-semibold text-gray-900">
        7. Disclaimer
      </h2>
      <ul className="space-y-2 pl-1">
        <li>
          The Website and its content are provided &ldquo;as is&rdquo; and
          without warranties of any kind, express or implied.
        </li>
        <li>
          We disclaim all warranties, including but not limited to warranties of
          merchantability, fitness for a particular purpose, and
          non-infringement.
        </li>
      </ul>

      <h2 className="pt-4 text-base font-semibold text-gray-900">
        8. Limitation of Liability
      </h2>
      <ul className="space-y-2 pl-1">
        <li>
          Our liability to you in any circumstance is limited to the amount you
          paid for the relevant product(s) on the Website.
        </li>
        <li>
          We will not be liable for any damages arising out of or related to
          your use of the Website, including but not limited to direct,
          indirect, incidental, consequential, or punitive damages.
        </li>
      </ul>

      <h2 className="pt-4 text-base font-semibold text-gray-900">
        9. Termination
      </h2>
      <ul className="space-y-2 pl-1">
        <li>
          Intaara.in may suspend, terminate or limit your access to the Website,
          effective immediately, if, in its reasonable opinion, these Terms have
          been breached by you.
        </li>
        <li>
          Intaara.in may suspend, limit or terminate any service provided on the
          Website or all access and use of the Website.
        </li>
      </ul>

      <h2 className="pt-4 text-base font-semibold text-gray-900">
        10. Changes to the Terms
      </h2>
      <ul className="space-y-2 pl-1">
        <li>We may revise these Terms at any time by updating this page.</li>
        <li>
          You are bound by any revisions and should periodically visit this page
          to review the current Terms.
        </li>
      </ul>

      <h2 className="pt-4 text-base font-semibold text-gray-900">
        11. Governing Law and Dispute Resolution
      </h2>
      <ul className="space-y-2 pl-1">
        <li>
          These Terms will be governed by and construed in accordance with the
          laws of India.
        </li>
        <li>
          Any dispute arising out of or related to these Terms will be subject
          to the exclusive jurisdiction of the courts located in New Delhi,
          India.
        </li>
      </ul>

      <h2 className="pt-4 text-base font-semibold text-gray-900">
        12. Grievance Officer (Consumer Protection Act Compliance)
      </h2>
      <ul className="space-y-2 pl-1">
        <li>
          In accordance with the Consumer Protection Act (2019), we are required
          to designate a Grievance Officer to address your concerns.
        </li>
        <li>
          <strong className="font-semibold text-gray-800">
            Grievance Officer Name:
          </strong>{" "}
          Vedant Goyal
        </li>
        <li>
          <strong className="font-semibold text-gray-800">Email Address:</strong>{" "}
          <a
            href="mailto:help@intaara.in"
            className="font-medium text-sage-700 underline underline-offset-2 hover:text-sage-800"
          >
            help@intaara.in
          </a>
        </li>
        <li>
          <strong className="font-semibold text-gray-800">
            Contact Address:
          </strong>{" "}
          T-2/9 DLF Phase 3, Gurugram, 122002
        </li>
      </ul>

      <h2 className="pt-4 text-base font-semibold text-gray-900">
        13. Contact Us
      </h2>
      <p>
        If you have any questions about these Terms, please contact us at{" "}
        <a
          href="mailto:help@intaara.in"
          className="font-medium text-sage-700 underline underline-offset-2 hover:text-sage-800"
        >
          help@intaara.in
        </a>
      </p>
    </PolicyLayout>
  );
}