import { SiteShell } from "@/components/site-shell"
import Link from "next/link"

export const metadata = {
  title: "Refund Policy - SaaSKevin",
  description: "Learn about SaaSKevin's refund policy for subscription and usage-based billing.",
}

export default function RefundsPage() {
  return (
    <SiteShell>
      <div className="pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Refund Policy
          </h1>
          <p className="text-muted-foreground mb-12">
            Last updated: February 4, 2026
          </p>

          <div className="prose prose-neutral max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Overview</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SaaSKevin offers a usage-based pricing model with a generous free tier, allowing you to evaluate our service before incurring any charges. We believe in transparency and fairness, and this policy outlines how refunds are handled for our subscription and usage-based billing.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our pricing includes <strong className="text-foreground">100 free domains</strong> and <strong className="text-foreground">1 million free requests per month</strong>. You only pay for usage beyond these thresholds, which means you can thoroughly test our service at no cost.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Subscription Billing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SaaSKevin subscriptions are billed monthly in advance for domain-based charges and in arrears for usage-based charges (requests). Here&apos;s how our billing works:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong className="text-foreground">Domain charges:</strong> Billed monthly based on the number of active domains beyond the free tier (100 domains)</li>
                <li><strong className="text-foreground">Request charges:</strong> Billed monthly based on actual usage beyond the free tier (1 million requests)</li>
                <li><strong className="text-foreground">Billing cycle:</strong> Charges are processed automatically via Stripe on your monthly billing date</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">General Refund Policy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Due to the nature of our service and the generous free tier that allows evaluation before payment:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong className="text-foreground">Subscription fees</strong> are generally non-refundable once charged</li>
                <li><strong className="text-foreground">Usage-based fees</strong> reflect actual consumption and are non-refundable</li>
                <li><strong className="text-foreground">Partial month usage</strong> is not pro-rated upon cancellation</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We recommend staying within the free tier while evaluating our service to avoid charges until you&apos;re confident SaaSKevin meets your needs.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Cancellation</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You can cancel your subscription at any time through the billing section of your dashboard or via the Stripe Customer Portal. When you cancel:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Your subscription remains active until the end of your current billing period</li>
                <li>You will not be charged for subsequent billing periods</li>
                <li>No partial refunds are issued for unused time in the current billing period</li>
                <li>Access to paid features continues until the subscription period ends</li>
                <li>Your configured domains will continue routing traffic until cancellation takes effect</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Exceptions and Special Circumstances</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may consider refunds or service credits in the following situations:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong className="text-foreground">Service outages:</strong> Extended unplanned downtime that significantly impacts your service may qualify for service credits</li>
                <li><strong className="text-foreground">Billing errors:</strong> If you were charged incorrectly due to a technical issue on our end, we will issue a full refund for the erroneous charges</li>
                <li><strong className="text-foreground">Duplicate charges:</strong> Accidental duplicate payments will be refunded promptly</li>
                <li><strong className="text-foreground">Unauthorized charges:</strong> If your account was compromised and unauthorized charges occurred, contact us immediately</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Service Credits</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In lieu of monetary refunds, we may offer service credits that can be applied to future billing cycles. Service credits:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Are applied automatically to your next invoice</li>
                <li>Do not expire while your account remains active</li>
                <li>Cannot be transferred or exchanged for cash</li>
                <li>Are forfeited if your account is terminated for policy violations</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">How to Request a Refund</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you believe you qualify for a refund under the exceptions listed above, please contact our support team:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Email us at{" "}
                  <Link href="mailto:support@saaskevin.com" className="text-primary hover:underline">
                    support@saaskevin.com
                  </Link>
                </li>
                <li>Include your account email and team name</li>
                <li>Provide the invoice number or date of the charge in question</li>
                <li>Describe the reason for your refund request</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We aim to respond to all refund requests within 2-3 business days. Approved refunds are typically processed within 5-10 business days and will appear on your original payment method.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Disputed Charges</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you notice an unfamiliar charge from SaaSKevin, please contact us before disputing the charge with your bank or credit card company. We&apos;re committed to resolving billing issues quickly and fairly.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Filing a chargeback without first contacting us may result in account suspension and additional fees. We maintain detailed records of all account activity and usage, which we can provide to help clarify any concerns.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Refund Policy from time to time. Material changes will be communicated via email or through your dashboard. The updated policy will apply to charges incurred after the effective date. Your continued use of the service after changes take effect constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions about this Refund Policy or need assistance with billing, please contact us:
              </p>
              <ul className="list-none text-muted-foreground space-y-2">
                <li>
                  <strong className="text-foreground">Billing inquiries:</strong>{" "}
                  <Link href="mailto:support@saaskevin.com" className="text-primary hover:underline">
                    support@saaskevin.com
                  </Link>
                </li>
                <li>
                  <strong className="text-foreground">General support:</strong>{" "}
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
