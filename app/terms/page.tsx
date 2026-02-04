import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export const metadata = {
  title: "Terms of Service - SaaSKevin",
  description: "Read the terms and conditions governing your use of SaaSKevin's custom domain services.",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
      <Header />
      <div className="pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground mb-12">
            Last updated: February 4, 2026
          </p>

          <div className="prose prose-neutral max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;you&quot; or &quot;Customer&quot;) and SaaSKevin (&quot;we,&quot; &quot;us,&quot; or &quot;Company&quot;) governing your use of our custom domain platform and related services (collectively, the &quot;Service&quot;).
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Service. If you are using the Service on behalf of an organization, you represent that you have authority to bind that organization to these Terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SaaSKevin provides a custom domain infrastructure service that enables SaaS companies to offer white-label domain functionality to their end users. Our Service includes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Embeddable widget for domain configuration</li>
                <li>Automated DNS verification and management</li>
                <li>TLS certificate provisioning and renewal</li>
                <li>Traffic routing and reverse proxy infrastructure</li>
                <li>Dashboard for domain management and monitoring</li>
                <li>API access for programmatic integration</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Account Registration</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To use certain features of the Service, you must create an account. When creating an account, you agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We reserve the right to suspend or terminate accounts that violate these Terms or contain false information.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Violate any applicable laws, regulations, or third-party rights</li>
                <li>Transmit malware, viruses, or other malicious code</li>
                <li>Engage in phishing, fraud, or deceptive practices</li>
                <li>Distribute illegal, harmful, or objectionable content</li>
                <li>Infringe on intellectual property rights of others</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the Service or its infrastructure</li>
                <li>Resell or redistribute the Service without authorization</li>
                <li>Use the Service for domains associated with illegal activities</li>
                <li>Circumvent usage limits or abuse the Service</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Domain Requirements</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When using our Service to configure custom domains, you represent and warrant that:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>You have the right to use and configure the domain names</li>
                <li>Domain registrations do not infringe third-party rights</li>
                <li>You will maintain accurate DNS records as required</li>
                <li>Your end users have proper authorization for their domains</li>
                <li>You will comply with ICANN policies and domain regulations</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Payment Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Paid features of the Service are subject to the following terms:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong className="text-foreground">Pricing:</strong> Fees are based on your selected plan and usage, as displayed on our pricing page</li>
                <li><strong className="text-foreground">Billing:</strong> Subscriptions are billed in advance on a monthly or annual basis</li>
                <li><strong className="text-foreground">Usage-based charges:</strong> Overage fees are billed monthly in arrears</li>
                <li><strong className="text-foreground">Payment method:</strong> We accept major credit cards via Stripe</li>
                <li><strong className="text-foreground">Taxes:</strong> Prices exclude applicable taxes, which will be added where required</li>
                <li><strong className="text-foreground">Failed payments:</strong> We may suspend Service access after failed payment attempts</li>
                <li><strong className="text-foreground">Refunds:</strong> Fees are non-refundable except as required by law or stated in our refund policy</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Service Level</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We strive to maintain high availability and performance. However:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>The Service is provided &quot;as is&quot; without guaranteed uptime</li>
                <li>Scheduled maintenance may cause temporary interruptions</li>
                <li>We are not liable for downtime caused by third-party services, DNS propagation, or factors outside our control</li>
                <li>Enterprise plans may include separate SLA agreements</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong className="text-foreground">Our Property:</strong> The Service, including all software, code, designs, and documentation, is owned by SaaSKevin and protected by intellectual property laws. These Terms do not grant you any rights to our trademarks, logos, or brand assets.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong className="text-foreground">Your Content:</strong> You retain ownership of your data, configurations, and content. You grant us a limited license to use this content solely to provide and improve the Service.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Feedback:</strong> Any suggestions, ideas, or feedback you provide about the Service may be used by us without obligation or compensation to you.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Confidentiality</h2>
              <p className="text-muted-foreground leading-relaxed">
                Both parties agree to protect confidential information disclosed during the use of the Service. Confidential information includes API keys, customer data, business information, and any information marked as confidential. This obligation does not apply to information that is publicly available, independently developed, or rightfully obtained from third parties.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND</li>
                <li>WE DISCLAIM ALL IMPLIED WARRANTIES, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE</li>
                <li>WE ARE NOT LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES</li>
                <li>OUR TOTAL LIABILITY SHALL NOT EXCEED THE FEES PAID BY YOU IN THE 12 MONTHS PRECEDING THE CLAIM</li>
                <li>WE ARE NOT LIABLE FOR LOSSES CAUSED BY YOUR END USERS, THIRD-PARTY SERVICES, OR DOMAIN CONFIGURATION ERRORS</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify, defend, and hold harmless SaaSKevin and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from: (a) your use of the Service; (b) your violation of these Terms; (c) your violation of any third-party rights; (d) content transmitted through your account; or (e) claims by your end users.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">12. Termination</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong className="text-foreground">By You:</strong> You may terminate your account at any time through your account settings or by contacting us. Termination does not entitle you to refunds for prepaid fees.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong className="text-foreground">By Us:</strong> We may suspend or terminate your access immediately if you violate these Terms, fail to pay fees, or engage in harmful conduct. We may also terminate with 30 days&apos; notice for any reason.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Effect of Termination:</strong> Upon termination, your right to use the Service ceases. Configured domains will stop routing through our infrastructure. You should export any needed data before termination. Certain provisions of these Terms survive termination.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">13. Modifications to Service and Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong className="text-foreground">Service Changes:</strong> We may modify, suspend, or discontinue any aspect of the Service at any time. We will provide reasonable notice for material changes that negatively affect your use.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Terms Changes:</strong> We may update these Terms from time to time. Material changes will be communicated via email or through the Service. Continued use after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">14. Governing Law and Disputes</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles. Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, except that either party may seek injunctive relief in court for intellectual property violations.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Class Action Waiver:</strong> You agree to resolve disputes individually and waive any right to participate in class action lawsuits or class-wide arbitration.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">15. General Provisions</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong className="text-foreground">Entire Agreement:</strong> These Terms, along with our Privacy Policy, constitute the entire agreement between you and SaaSKevin</li>
                <li><strong className="text-foreground">Severability:</strong> If any provision is found unenforceable, the remaining provisions remain in effect</li>
                <li><strong className="text-foreground">Waiver:</strong> Failure to enforce any right does not constitute a waiver of that right</li>
                <li><strong className="text-foreground">Assignment:</strong> You may not assign these Terms without our consent; we may assign freely</li>
                <li><strong className="text-foreground">Force Majeure:</strong> Neither party is liable for delays caused by events beyond reasonable control</li>
                <li><strong className="text-foreground">Notices:</strong> Legal notices should be sent to the email addresses on file</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">16. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none text-muted-foreground space-y-2">
                <li>
                  <strong className="text-foreground">Email:</strong>{" "}
                  <Link href="mailto:legal@saaskevin.com" className="text-primary hover:underline">
                    legal@saaskevin.com
                  </Link>
                </li>
                <li>
                  <strong className="text-foreground">General inquiries:</strong>{" "}
                  <Link href="mailto:hello@saaskevin.com" className="text-primary hover:underline">
                    hello@saaskevin.com
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
