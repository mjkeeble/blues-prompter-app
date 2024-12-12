#include <Keyboard.h>

const int centreSwitch = 14;
const int leftSwitch = 16;
const int rightSwitch = 15;
unsigned long pressTimeLeft = 0;
unsigned long pressTimeCentre = 0;
unsigned long pressTimeRight = 0;

const unsigned long longPressThreshold = 400; // Threshold for long press

void setup() {
  pinMode(centreSwitch, INPUT_PULLUP);
  pinMode(leftSwitch, INPUT_PULLUP);
  pinMode(rightSwitch, INPUT_PULLUP);
  Keyboard.begin();
}

void loop() {
  checkButton(leftSwitch, 'u', 'j', &pressTimeLeft); // left footswitch returns 'u' for short, 'j' for long press
  checkButton(centreSwitch, 'i', 'k', &pressTimeCentre); // centre footswitch returns 'i' for short, 'k' for long press
  checkButton(rightSwitch, 'o', 'l', &pressTimeRight); // right footswitch returns 'o' for short, 'l' for long press
}

void checkButton(int buttonPin, char shortPressKey, char longPressKey, unsigned long *pressTime) {
  if (digitalRead(buttonPin) == LOW) { // Button is pressed
    if (*pressTime == 0) { // Start of new press
      *pressTime = millis();
    }
  } else {
    if (*pressTime != 0) {
      if (millis() - *pressTime > longPressThreshold) {
        // It's a long press
        Keyboard.press(longPressKey);
        Keyboard.release(longPressKey);
      } else {
        // It's a short press
        Keyboard.press(shortPressKey);
        Keyboard.release(shortPressKey);
      }
      *pressTime = 0; // Reset press time
    }
  }
  delay(20);
}
