Mobile Integration
React Native Integration
Learn more about integrating Cashfree SDK in your react native app

​
Payment Gateway React Native Guide

Web Checkout


UPI Intent Checkout

​
Setting Up SDK
The React Native SDK is hosted on npm.org you can get the sdk here.

Our React Native SDK supports Android SDK version 19 and above and iOS minimum deployment target of 10.3 and above. Navigate to your project and run the following command.


Copy
npm install react-native-cashfree-pg-sdk
iOS
Add this to your application’s info.plist file.


Copy
<key>LSApplicationCategoryType</key>
<string></string>
<key>LSApplicationQueriesSchemes</key>
<array>
<string>phonepe</string>
<string>tez</string>
<string>paytmmp</string>
<string>bhim</string>
<string>credpay</string>
</array>

Copy
cd ios
pod install --repo-update
​
Step 1: Creating an Order
The first step in the integration is to create an Order. You can add an endpoint to your server which creates this order and integrate this server endpoint with your frontend.

Order creation must happen from your backend (as this API uses your secret key). Please do not call this directly from your mobile application.
Here’s a sample request for creating an order using your desired backend language. Cashfree offers backend SDKs to simplify the integration process.

You can find the SDKs here.


javascript

python

java

go

csharp

php

curl

Copy
import { Cashfree } from "cashfree-pg"; 

Cashfree.XClientId = {Client ID};
Cashfree.XClientSecret = {Client Secret Key};
Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

function createOrder() {
  var request = {
    "order_amount": "1",
    "order_currency": "INR",
    "customer_details": {
      "customer_id": "node_sdk_test",
      "customer_name": "",
      "customer_email": "example@gmail.com",
      "customer_phone": "9999999999"
    },
    "order_meta": {
      "return_url": "https://test.cashfree.com/pgappsdemos/return.php?order_id=order_123"
    },
    "order_note": ""
  }

  Cashfree.PGCreateOrder("2023-08-01", request).then((response) => {
    var a = response.data;
    console.log(a)
  })
    .catch((error) => {
      console.error('Error setting up order request:', error.response.data);
    });
}
After successfully creating an order, you will receive a unique order_id and payment_session_id that you need for subsequent steps.

You can view all the complete api request and response for /orders here.

​
Step 2: Opening the Payment Page
Once the order is created, the next step is to open the payment page so the customer can make the payment. The React Native SDK offer below payment flow:


Web Checkout


UPI Intent Checkout

To complete the payment, we can follow the following steps:

Create a CFSession object.
Set payment callback.
Initiate the payment
​
Create a Session
This object contains essential information about the order, including the payment session ID (payment_session_id) and order ID (order_id) obtained from Step 1. It also specifies the environment (sandbox or production).


Copy
import {
  CFEnvironment,
  CFSession,
} from 'cashfree-pg-api-contract';

try {
      const session = new CFSession(
        'payment_session_id',
        'order_id',
        CFEnvironment.SANDBOX
      );
}
catch (e: any) {
      console.log(e.message);
}
​
Set payment callback
The SDK exposes an interface CFCallback to receive callbacks from the SDK once the payment flow ends.


Copy
onVerify(orderID: string)
onError(error: CFErrorResponse, orderID: string)
Make sure to set the callback at componentDidMount and remove the callback at componentWillUnmount as this also handles the activity restart cases and prevents memory leaks.
Always call setCallback before calling doPayment method of SDK

Copy
import {
  CFErrorResponse,
  CFPaymentGatewayService,
} from 'react-native-cashfree-pg-sdk';

export default class App extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    console.log('MOUNTED');
    CFPaymentGatewayService.setCallback({
      onVerify(orderID: string): void {
        this.changeResponseText('orderId is :' + orderID);
      },
      onError(error: CFErrorResponse, orderID: string): void {
        this.changeResponseText(
          'exception is : ' + JSON.stringify(error) + '\norderId is :' + orderID
        );
      },
    });
  }

  componentWillUnmount() {
    console.log('UNMOUNTED');
    CFPaymentGatewayService.removeCallback();
  }
}

​
Initiate the Payment

Web Checkout


UPI Intent Checkout

​
Sample Code

Web checkout


UPI Intent Checkout

Github Sample

Sample UPI Test apk

​
Step 4: Confirming the Payment
Once the payment is completed, you need to confirm whether the payment was successful by checking the order status. After payment user will be redirected back to your component.

You must always verify payment status from your backend. Before delivering the goods or services, please ensure you call check the order status from your backend. Ensure you check the order status from your server endpoint.

Copy
export default class App extends Component {
  ...
  componentDidMount() {

    CFPaymentGatewayService.setCallback({
      //verify order status from backend
      onVerify(orderID: string): void {
        this.changeResponseText('orderId is :' + orderID);
      },

      onError(error: CFErrorResponse, orderID: string): void {
        this.changeResponseText(
          'exception is : ' + JSON.stringify(error) + '\norderId is :' + orderID
        );
      },
    });
  }
}
To verify an order you can call our /pg/orders endpoint from your backend. You can also use our SDK to achieve the same.


golang

javascript

php

java

python

csharp

curl

Copy
version := "2023-08-01"
response, httpResponse, err := cashfree.PGFetchOrder(&version, "<order_id>", nil, nil, nil)
if err != nil {
	fmt.Println(err.Error())
} else {
	fmt.Println(httpResponse.StatusCode)
	fmt.Println(response)
}
​
Testing
You should now have a working checkout button that redirects your customer to Cashfree Checkout.

Click the checkout button.
You’re redirected to the Cashfree Checkout payment page.
If your integration isn’t working:

​
Error Codes
To confirm the error returned in your application, you can view the error codes that are exposed by the SDK.


Error Codes

​
Other Options

(Optional) Enable logging to debugging issues