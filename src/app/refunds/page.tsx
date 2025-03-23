export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Refunds & Cancellations</h1>
          
          <div className="space-y-6 text-gray-600">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Refund Policy</h2>
              <p>
                At FFLikes, we strive to provide the best service possible. However, we understand that there might be situations where a refund is warranted.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Eligible for Refund</h2>
              <ul className="list-disc list-inside mt-2 space-y-2">
                <li>Service not delivered within 48 hours of payment</li>
                <li>Technical issues preventing service delivery</li>
                <li>Double charging or incorrect amount charged</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Not Eligible for Refund</h2>
              <ul className="list-disc list-inside mt-2 space-y-2">
                <li>Service already delivered</li>
                <li>Incorrect information provided by user</li>
                <li>Changes in Free Fire profile settings affecting service delivery</li>
                <li>User's violation of Terms & Conditions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Refund Process</h2>
              <ol className="list-decimal list-inside mt-2 space-y-2">
                <li>Contact our support team with your order ID</li>
                <li>Explain the reason for refund request</li>
                <li>Provide any relevant screenshots or evidence</li>
                <li>Allow up to 7 business days for review</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Cancellation Policy</h2>
              <p>
                Orders can be cancelled and refunded only if the service delivery has not begun. Once the service delivery process has started, cancellations are not possible.
              </p>
            </section>

            <div className="mt-8 p-6 bg-blue-50 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Information</h3>
              <ul className="list-disc list-inside space-y-2 text-blue-800">
                <li>Refunds are processed through the original payment method</li>
                <li>Processing time may vary depending on your payment provider</li>
                <li>All refund requests must be submitted within 7 days of purchase</li>
              </ul>
            </div>

            <div className="mt-8 p-6 bg-yellow-50 rounded-xl">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Need Help?</h3>
              <p className="text-yellow-800">
                If you have any questions about our refund policy or need to request a refund, please contact our support team at support@fflikes.com with your order details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 