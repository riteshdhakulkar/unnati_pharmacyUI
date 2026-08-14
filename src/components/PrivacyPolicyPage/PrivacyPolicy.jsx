import React from "react";
import { Link } from "react-router-dom";

const Section = ({ number, title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
      {number ? `${number}. ${title}` : title}
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

export default function PrivacyPolicy() {
  return (
    <div className="w-full bg-white">
      {/* Title banner - site gold/cream color */}
      <div className="w-full bg-[#F5DEB3]/60 border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <p className="text-amber-700 font-semibold tracking-wide text-sm uppercase mb-2">
            Legal
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Privacy Policy
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
          At Unnati Pharma, we are committed to protecting your privacy and
          handling your information with transparency and integrity. This
          policy explains how we collect, use, store, and protect your
          personal data and your rights regarding that information in
          accordance with applicable privacy laws.
        </p>

        <Section number={1} title="Information We Collect">
          <p>We may collect and process the following types of information:</p>
          <ul className="space-y-2 mt-3">
            <Bullet>
              <strong className="text-gray-900">Personal identification details</strong>{" "}
              (name, address, email, phone, country)
            </Bullet>
            <Bullet>
              <strong className="text-gray-900">Order and transaction data</strong>{" "}
              (ordered products, shipping info, payment method, billing address)
            </Bullet>
            <Bullet>
              <strong className="text-gray-900">Communications</strong>{" "}
              (correspondence via forms, email, chat)
            </Bullet>
            <Bullet>
              <strong className="text-gray-900">Technical information</strong>{" "}
              (IP address, browser type, device data, access times, referring website)
            </Bullet>
            <Bullet>
              <strong className="text-gray-900">Cookies and tracking technologies</strong>{" "}
              to help us improve user experience and site security
            </Bullet>
          </ul>
        </Section>

        <Section number={2} title="How We Use Your Information">
          <p>We process your data strictly for business and customer support purposes, including:</p>
          <ul className="space-y-2 mt-3">
            <Bullet>Fulfilling and managing your pharmaceutical orders</Bullet>
            <Bullet>Verifying your identity and contact details</Bullet>
            <Bullet>Responding to your inquiries or support requests</Bullet>
            <Bullet>Notifying you of order updates, changes to services, or important information</Bullet>
            <Bullet>Conducting compliance checks required under law and export regulations</Bullet>
            <Bullet>Analyzing website performance and optimizing user experience</Bullet>
            <Bullet>Marketing our products or services, only when you have consented as required by law</Bullet>
          </ul>
        </Section>

        <Section number={3} title="Data Sharing and Disclosure">
          <p>Your information may be shared only as necessary and with trusted parties, including:</p>
          <ul className="space-y-2 mt-3">
            <Bullet>Logistics, shipping, and payment service providers</Bullet>
            <Bullet>Regulatory or customs authorities to ensure compliance with legal requirements</Bullet>
            <Bullet>IT, marketing, or administrative service providers under confidentiality agreements</Bullet>
            <Bullet>As required in response to lawful requests by public authorities, including meeting national security or law enforcement requirements</Bullet>
          </ul>
          <p className="pt-2">We do not sell your data to third parties for their independent marketing purposes.</p>
        </Section>

        <Section number={4} title="Data Security">
          <p>We implement technical, organizational, and physical safeguards to:</p>
          <ul className="space-y-2 mt-3">
            <Bullet>Prevent unauthorized access, use, disclosure, loss, or alteration of your data</Bullet>
            <Bullet>Use encrypted transmission (SSL), secure servers, and access controls for sensitive information</Bullet>
            <Bullet>Restrict internal access on a "need-to-know" basis</Bullet>
            <Bullet>Regularly monitor and enhance our cyber-security and compliance measures</Bullet>
          </ul>
        </Section>

        <Section number={5} title="Data Retention">
          <p>
            We retain your personal information only as long as necessary for
            the legitimate business or legal purposes explained above, or as
            required by law.
          </p>
        </Section>

        <Section number={6} title="Your Rights">
          <p>Depending on your local laws, you may have rights to:</p>
          <ul className="space-y-2 mt-3">
            <Bullet>Access, update, or correct your personal information</Bullet>
            <Bullet>Request deletion, restriction, or object to the processing of your data</Bullet>
            <Bullet>Withdraw consent for data processing (where consent is the legal basis)</Bullet>
            <Bullet>Request a copy or portability of your information</Bullet>
          </ul>
          <p className="pt-2">
            You can exercise any of these rights by contacting us at{" "}
            <a
              href="mailto:info@unnatipharma.com"
              className="font-semibold text-amber-600 hover:text-amber-700"
            >
              info@unnatipharma.com
            </a>
            .
          </p>
        </Section>

        <Section number={7} title="International Transfers">
          <p>
            As a global pharmaceutical exporter, your data may be processed in
            or transferred to countries outside your home jurisdiction for
            order fulfillment, compliance, or support. We ensure compliance
            with all applicable data protection laws during such transfers.
          </p>
        </Section>

        <Section number={8} title="Cookies">
          <p>
            Our website uses cookies to improve user experience and analyze
            site usage. You may disable cookies in your browser, but some
            features may not function optimally.
          </p>
        </Section>

        <Section number={9} title="Children's Privacy">
          <p>
            Our services are not directed to individuals under the age of 18.
            We do not knowingly collect personal data from children.
          </p>
        </Section>

        <Section number={10} title="Updates to This Policy">
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our practices, legal requirements, or technology.
            Updates will be posted on this page with a revised
            &ldquo;Effective Date.&rdquo;
          </p>
        </Section>

        <Section number={11} title="Contact Us">
          <p>For questions, data access requests, or concerns about privacy, please contact:</p>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mt-3 space-y-1">
            <p className="font-semibold text-gray-900">Unnati Pharma</p>
            <p>
              Email:{" "}
              <a
                href="mailto:info@unnatipharma.com"
                className="text-amber-600 hover:text-amber-700"
              >
                info@unnatipharma.com
              </a>
            </p>
            <p>Phone: +91-8669251513</p>
          </div>
          <p className="pt-4 italic text-gray-500">
            By using this website and our services, you agree to this Privacy
            Policy and the processing of your data as described above.
          </p>
        </Section>

        {/* Medical & Legal Disclaimer */}
        <div className="border-t border-gray-100 pt-10 mt-2">
          <Section title="Medical & Legal Disclaimer">
            <p>
              All content provided on the Unnati Pharma website — including
              but not limited to text, images, audio, videos, and downloadable
              materials — is intended for informational purposes only. It is
              not intended as a substitute for professional medical advice,
              diagnosis, or treatment.
            </p>
            <p>
              Always seek the advice of your physician or other qualified
              healthcare provider with any questions you may have regarding a
              medical condition or before starting, stopping, or altering any
              course of treatment. Never disregard or delay professional
              medical advice because of information you have read on this
              website.
            </p>
            <p>
              If you believe you may be experiencing a medical emergency,
              contact your doctor or your local emergency services
              immediately.
            </p>
            <p>
              Unnati Pharma does not recommend or endorse any specific
              physicians, products, procedures, tests, or treatment methods
              mentioned on this site. Any reliance on information provided by
              Unnati Pharma, its employees, contractors, or content
              contributors is solely at your own risk.
            </p>
            <p>
              This site may contain medical or health-related discussions,
              including those involving sensitive or sexually transmitted
              conditions. If you find such content offensive, you should
              refrain from using the site.
            </p>
          </Section>

          <Section title="International Sales & Compliance">
            <p>
              Unnati Pharma exports medicines strictly in accordance with
              applicable laws and regulations. Products protected by valid
              patents are not offered for sale in countries where doing so
              would constitute patent infringement. Any liability for patent
              infringement lies solely with the buyer. All buyers are
              responsible for ensuring that importation and use of products
              in their country is legal.
            </p>
          </Section>

          <Section title="Trademark Notice">
            <p>
              All trademarks, brands, and service marks that appear on this
              website are the property of their respective owners.
            </p>
          </Section>

          <Section title="General Advisory">
            <p>
              We advise all patients to follow the medication regimen
              prescribed by their qualified healthcare provider — the correct
              dosage, timing, and method of administration. Failure to follow
              medical instructions may result in worsening health conditions,
              hospitalization, or death.
            </p>
            <p>
              This website and all its content are provided on an{" "}
              <strong className="text-gray-900">&ldquo;as is&rdquo;</strong>{" "}
              basis without any warranties, either express or implied. Links
              to third-party content are provided for educational purposes
              only, and Unnati Pharma assumes no responsibility for the
              accuracy or claims of external websites.
            </p>
          </Section>
        </div>
      </div>

      {/* Sticky enquiry sidebar */}
      <div className="lg:sticky lg:top-8">
        <EnquireCard />
      </div>
      </div>
    </div>
  );
}