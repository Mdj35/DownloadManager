<?php
// PHP - Create Payment Session for Adyen

header('Content-Type: application/json');

$merchantAccount = 'YChicStation209ECOM';
$amount = $_POST['amount']; // get amount from POST request
$currency = 'PHP'; // set the currency

// Your API key from Adyen dashboard
$apiKey = 'AQEphmfuXNWTK0Qc+iSTmm07lPCaXIJCA8EaATwaBqqIRXtqP/+nRaF4A9YQwV1bDb7kfNy1WIxIIkxgBw==-oPa8O2KfNBq/oqEsAaneGtt1Wpd7LZNhDGHSYmDwnMo=-i1iqcM39T6+H~U{aWG$';

$data = [
    'merchantAccount' => $merchantAccount,
    'amount' => [
        'currency' => $currency,
        'value' => $amount, 
    ],
    'reference' => 'Reservation-' . time(),
    'returnUrl' => 'http://localhost:3000/confirmation', // Where user is redirected after payment
];

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://checkout-test.adyen.com/v68/sessions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_POST, 1);

$headers = [];
$headers[] = "Content-Type: application/json";
$headers[] = "X-Api-Key: $apiKey";

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
}
curl_close($ch);

echo $response;
?>
