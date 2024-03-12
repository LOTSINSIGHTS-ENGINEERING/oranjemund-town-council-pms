<?php
    error_reporting(-1);
    ini_set('display_errors', 'On');
    set_error_handler("var_dump");
        
    header("Access-Control-Allow-Origin: *");
    if ($_SERVER["REQUEST_METHOD"] == "GET") {
    	$to = $_GET["to"];
    	$subject = $_GET["subject"];
    	$message = $_GET["message"];
    	$temp = "no-reply@unicomms.app";
    
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-Type: text/html; charset=ISO-8859-1" . "\r\n";
    	$headers .= "From: " . strip_tags($temp) . "\r\n" .
    	"X-Mailer: PHP/" . phpversion();
    
    	$txt = "<html><body>";
    	$txt .= "<h3>$subject</h3>";
    	$txt .= "<p>$message</p>" ;
    	$txt .= "</body></html>";
    
    	$success = mail($to, $subject, $txt, $headers);
    	if ($success) {
    		# Set a 200 (okay) response code.
    		http_response_code(200);
    		echo "Thank You! Your message has been sent.";
    	} else {
    		# Set a 500 (internal server error) response code.
    		http_response_code(500);
    		
    		echo $success;
    		echo "Failed to send email.";
    	}
    }
?>