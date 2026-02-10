import { SiteShell } from "@/components/site-shell"
import Link from "next/link"

export const metadata = {
  title: "Privacy Policy - SaaSKevin",
  description: "Learn how SaaSKevin collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <SiteShell>
      <div className="pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-12">
            Last updated: February 4, 2026
          </p>

          <div className="prose prose-neutral max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SaaSKevin (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our custom domain service and website.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By using SaaSKevin, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>

              <h3 className="text-lg font-medium text-foreground mb-3">Account Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you create an account, we collect:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6 ml-4">
                <li>Name and email address</li>
                <li>Company or organization name</li>
                <li>Billing information (processed securely via Stripe)</li>
                <li>Password (stored in encrypted form)</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mb-3">Domain and Usage Data</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To provide our custom domain service, we collect:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6 ml-4">
                <li>Custom domain names you configure</li>
                <li>DNS configuration and verification data</li>
                <li>Origin server URLs for traffic routing</li>
                <li>TLS certificate metadata</li>
                <li>Request logs (IP addresses, timestamps, request paths)</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mb-3">Automatically Collected Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you visit our website or use our dashboard, we automatically collect:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Device and browser information</li>
                <li>IP address and approximate location</li>
                <li>Pages visited and features used</li>
                <li>Referring website or source</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Provide, maintain, and improve our custom domain services</li>
                <li>Process domain verifications and issue TLS certificates</li>
                <li>Route traffic securely to your origin servers</li>
                <li>Process payments and manage your subscription</li>
                <li>Send transactional emails (account verification, domain status)</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Monitor for security threats and prevent abuse</li>
                <li>Analyze usage patterns to improve our service</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong className="text-foreground">Service providers:</strong> Third parties that help us operate our service (cloud infrastructure, payment processing, analytics)</li>
                <li><strong className="text-foreground">Certificate authorities:</strong> To issue and manage TLS certificates for your domains</li>
                <li><strong className="text-foreground">DNS providers:</strong> For domain verification and ACME challenge delegation</li>
                <li><strong className="text-foreground">Legal requirements:</strong> When required by law or to protect our rights</li>
                <li><strong className="text-foreground">Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Encryption of data in transit (TLS) and at rest</li>
                <li>Secure credential storage using industry-standard hashing</li>
                <li>Regular security audits and monitoring</li>
                <li>Access controls and authentication requirements</li>
                <li>Isolated infrastructure for customer data</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                While we strive to protect your information, no method of transmission or storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your account information for as long as your account is active or as needed to provide services. Request logs are retained for 90 days for security and debugging purposes. After account deletion, we may retain certain information as required by law or for legitimate business purposes (e.g., fraud prevention, legal compliance).
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Maintain your session and authentication state</li>
                <li>Remember your preferences</li>
                <li>Analyze website traffic and usage (via Vercel Analytics)</li>
                <li>Improve our services</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                You can control cookies through your browser settings, but disabling them may affect functionality.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong className="text-foreground">Access:</strong> Request a copy of your personal data</li>
                <li><strong className="text-foreground">Correction:</strong> Request correction of inaccurate data</li>
                <li><strong className="text-foreground">Deletion:</strong> Request deletion of your personal data</li>
                <li><strong className="text-foreground">Portability:</strong> Request your data in a portable format</li>
                <li><strong className="text-foreground">Objection:</strong> Object to certain processing activities</li>
                <li><strong className="text-foreground">Withdrawal:</strong> Withdraw consent where applicable</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, please contact us at{" "}
                <Link href="mailto:privacy@saaskevin.com" className="text-primary hover:underline">
                  privacy@saaskevin.com
                </Link>
                .
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">International Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Children&apos;s Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are not directed to individuals under 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. Your continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
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
                  <Link href="mailto:support@saaskevin.com" className="text-primary hover:underline">
                    support@saaskevin.com
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </SiteShell>
  )
}
