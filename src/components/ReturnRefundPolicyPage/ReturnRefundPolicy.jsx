import React from "react";
import { Link } from "react-router-dom";

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
      {title}
    </h2>
    <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

const Bullet = ({ children }) => (
  <li className="flex gap-3">
    <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
    <span>{children}</span>
  </li>
);

const EnquireCard = () => (
  <div className="bg-amber-50/60 border border-gray-200 rounded-lg p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-4">
      Send us your enquire!
    </h3>
    <div className="flex items-center gap-3 mb-4">
    
      <span className="h-px bg-gray-300 flex-1" />
    </div>
    <p className="text-xs tracking-wide text-gray-500 font-semibold uppercase mb-1">
      Email us on:
    </p>
    <a
      href="mailto:info@unnatipharma.com"
      className="block text-amber-600 font-medium hover:text-amber-700 mb-5"
    >
      info@unnatipharma.com
    </a>
    <Link
      to="/contact"
      className="block w-full text-center border border-amber-500 text-amber-600 font-semibold text-sm tracking-wide uppercase py-3 rounded hover:bg-amber-500 hover:text-white transition-colors"
    >
      Contact Us
    </Link>
  </div>
);

export default function ReturnRefundPolicy() {
  return (
    <div className="w-full bg-white">
      {/* Title banner - site gold/cream color */}
      <div className="w-full bg-[#F5DEB3]/60 border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <p className="text-amber-700 font-semibold tracking-wide text-sm uppercase mb-2">
            Legal
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Refund and Returns Policy
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-14 md:py-20 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
        <div>
          {/* Header */}
          <div className="mb-12">
            <p className="text-gray-500">Effective Date: July 23, 2025</p>
            <div className="h-1 w-16 bg-amber-500 rounded-full mt-6" />
          </div>

          <p className="text-gray-600 leading-relaxed mb-12">
            At Unnati Pharma, we prioritize regulatory compliance and product
            integrity in line with global pharmaceutical export standards.
            Please carefully read our{" "}
            <strong className="text-gray-900">
              Refund and Returns Policy
            </strong>{" "}
            before placing your order.
          </p>

          <Section title="No Return Policy">
            <ul className="space-y-2">
              <Bullet>
                Due to the sensitive nature of pharmaceutical products and
                regulatory requirements,{" "}
                <strong className="text-gray-900">
                  we do not accept returns
                </strong>{" "}
                for any goods once shipped — regardless of reason.
              </Bullet>
              <Bullet>
                This includes all generic and branded medicines, APIs,
                specialty products, and bulk/batch shipments.
              </Bullet>
              <Bullet>
                Returns are strictly not permitted. Once shipped, orders are
                considered final and non-returnable under all circumstances.
              </Bullet>
            </ul>
          </Section>

          <Section title="No Refund Policy">
            <ul className="space-y-2">
              <Bullet>
                <strong className="text-gray-900">
                  Refunds are not provided
                </strong>{" "}
                for any shipped product, including cases of delayed delivery,
                customs delays, change-of-mind, or dissatisfaction with the
                product.
              </Bullet>
              <Bullet>
                All sales are considered final after shipment. No financial
                compensation, reversal, or credit will be issued for products
                once they leave our warehouse/export facility.
              </Bullet>
            </ul>
          </Section>

          <Section title="Order Cancellation">
            <ul className="space-y-2">
              <Bullet>
                <strong className="text-gray-900">
                  Order cancellation is allowed only before payment is made
                </strong>
                .
              </Bullet>
              <Bullet>
                Once payment is initiated or completed, the order becomes
                non-cancellable and is processed for export/shipment in
                accordance with Indian export laws and WHO-GMP standards.
              </Bullet>
              <Bullet>
                Customers wishing to cancel their order{" "}
                <strong className="text-gray-900">
                  must do so prior to making payment
                </strong>
                . No cancellations are allowed after payment or shipment.
              </Bullet>
            </ul>
          </Section>

          <Section title="Important Points">
            <ul className="space-y-2">
              <Bullet>
                By completing payment, you confirm your acceptance of our No
                Refund and No Return policy.
              </Bullet>
              <Bullet>
                We urge all clients to verify product specifications,
                quantities, and regulatory clearances before confirming any
                order or making payment.
              </Bullet>
              <Bullet>
                For queries or support, please contact our customer service
                team prior to payment.
              </Bullet>
            </ul>
          </Section>

          <Section title="Regulatory & Compliance Notice">
            <ul className="space-y-2">
              <Bullet>
                This policy adheres to Indian export regulations, global
                pharmaceutical handling guidelines, and ensures product
                safety and compliance during international transit.
              </Bullet>
              <Bullet>
                Exceptions to return or refund can only be considered where
                required by local law, specifically in the event of
                regulatory blocks prior to shipment (with official
                documentation). Such exceptions are rare and at the sole
                discretion of Unnati Pharma.
              </Bullet>
            </ul>
          </Section>

          <Section title="Contact">
            <p>For clarification regarding this policy or for pre-payment support:</p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mt-3 space-y-1">
              <p>
                <span className="font-semibold text-gray-900">Phone:</span>{" "}
                +91-8669251513
              </p>
              <p>
                <span className="font-semibold text-gray-900">Email:</span>{" "}
                <a
                  href="mailto:info@unnatipharma.com"
                  className="text-amber-600 hover:text-amber-700"
                >
                  info@unnatipharma.com
                </a>
              </p>
            </div>
            <p className="pt-4">
              Thank you for your understanding and trust in Unnati Pharma.
            </p>
            <p className="italic text-gray-500">
              By processing your payment, you acknowledge acceptance of this
              Refund and Returns Policy effective July 23, 2025.
            </p>
          </Section>
        </div>

        {/* Sticky enquiry sidebar */}
        <div className="lg:sticky lg:top-8">
          <EnquireCard />
        </div>
      </div>
    </div>
  );
}