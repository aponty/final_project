/*
 based on the sketch included in "examples" library of the Arduino IDE (original credits below). Modifications were made 
 (different ethernet library, response, etc)
 help with formatting response (not really needed, but it keeps ajax from hanging) from here- 
 http://arduinobasics.blogspot.com/2015/11/
  Web Server

 A simple web server that shows the value of the analog input pins.
 using an Arduino Wiznet Ethernet shield.

 Circuit:
 * Ethernet shield attached to pins 10, 11, 12, 13
 * Analog inputs attached to pins A0 through A5 (optional)

 created 18 Dec 2009
 by David A. Mellis
 modified 9 Apr 2012
 by Tom Igoe
 modified 02 Sept 2015
 by Arturo Guadalupi


 */

#include <SPI.h>
#include <Ethernet2.h>

int LED1 = 9;
byte mac[] = {
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED
};
IPAddress ip(192, 168, 0, 50);
EthernetServer server(80);

void setup() {
  Serial.begin(9600);
  Ethernet.begin(mac, ip);
  server.begin();
  Serial.print("server is at ");
  Serial.println(Ethernet.localIP());
}

void loop() {
  EthernetClient client = server.available();
  if (client.connected()) {
    Serial.println("new client");

    client.println("HTTP/1.1 200 OK");
    client.println("Access-Control-Allow-Origin: *");
    client.println("Content-Type: application/json;charset=utf-8");
    client.println("Connection: close");
    client.println();
    
    client.print("[");                      
    client.print("{\"body\": ");
    client.print("\"howdy node i'm arduino\"");
    client.print("}");   
    client.print("]");

    client.stop();
    Serial.println("client disconnected");

    digitalWrite(LED1, HIGH);
    delay(10000);
    digitalWrite(LED1, LOW);
  }
}

