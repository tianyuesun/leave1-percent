# Leave1%

**Reduce 1% Compulsion. Build 1% Capability.**

Leave1% is a prototype that helps people interrupt one compulsive cycle, leave a little uncertainty unfinished, build capability, and return to everyday life.

It is not a chatbot, a mental health tracker, a course, or an engagement product. Instead, it focuses on one complete intervention flow designed to help users practice tolerating uncertainty through small, repeatable behavioral actions.

---

## Core User Flow

```
Home
  → Trigger Input
  → Human Safety Gate
      → Immediate action needed
          → Stop and handle the real-world situation
      → No immediate action needed
          → Continue
  → Compulsion Recognition
  → Structured Leave 1% Intervention
  → Return to Life
  → Capability Updated
```

The **Human Safety Gate** is the only safety authority.

The current MVP demonstrates the complete intervention flow using deterministic guidance after the Human Safety Gate.

---

## Tech Stack

- React Native
- Expo SDK 54
- TypeScript
- Expo Router
- NativeWind
- React Native Reanimated
- React Native AsyncStorage

---

## Setup

### Requirements

- Node.js 20+
- npm
- Expo Go, Android Emulator, iOS Simulator, or any modern web browser

### Install

```bash
npm ci
npm start
```

From the Expo terminal:

- Scan the QR code with Expo Go
- Press **a** for Android
- Press **i** for iOS (macOS)
- Press **w** for Web

The current MVP runs completely without any backend services.

---

## Validation

The current prototype has been verified through:

- TypeScript checking
- Expo production export
- Mobile viewport verification
- Human Safety Gate walkthroughs
- Complete intervention flow testing

---

## Planned AI Integration

The application architecture is designed to support structured LLM-generated interventions **after** the Human Safety Gate.

A future server-side integration may generate four structured fields:

- Mechanism
- Uncertainty message
- Leave 1% action
- Return-to-Life label

The Human Safety Gate will always remain deterministic and outside the language model.

The current prototype intentionally uses deterministic interventions to demonstrate the complete interaction design and safety architecture.

---

## Local Data

Completed interventions are stored locally using AsyncStorage.

The MVP currently includes:

- No user accounts
- No cloud storage
- No analytics
- No community features

---

## Collaboration

I developed Leave1% through an iterative collaboration with ChatGPT 5.6 and Codex.

I used ChatGPT 5.6 as a product design partner to refine the concept, intervention flow, safety boundaries, UI, and product language. I then worked with Codex to translate those decisions into a working Expo application, improve the interface, test both safety paths, verify the build, and prepare the project for deployment.

I made the final decisions about the product vision, safety principles, feature scope, and user experience.

---

## Future Work

Future versions of Leave1% will introduce structured AI-generated interventions while preserving the Human Safety Gate as the sole safety authority.

The long-term goal is not to eliminate uncertainty, but to help people gradually build the capacity to live with it—one small step at a time.

---

## License

This project is licensed under the MIT License.

See `LICENSE`.
