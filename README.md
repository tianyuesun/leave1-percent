# Leave1%

Leave1% is a quiet, AI-assisted structured intervention for interrupting one compulsion, leaving a little uncertainty, building capability, and returning to real life. It is not a chatbot, mental-health tracker, course, or engagement product. The MVP intentionally focuses on one complete vertical slice.

## Core user flow

```text
Home
  -> Trigger input
  -> Human Safety Gate
     -> Immediate action needed: stop and handle the real-world situation
     -> No immediate action needed: continue
  -> Compulsion recognition
  -> Structured Leave 1% intervention
  -> Return to Life
  -> Capability updated
```

The Human Safety Gate is the only safety authority. The AI is called only after the person selects **No immediate action needed**.

## Tech stack

- React Native and Expo SDK 54
- TypeScript
- Expo Router
- NativeWind
- React Native Reanimated
- React Native AsyncStorage
- OpenAI Responses API with Structured Outputs

## Setup

Requirements:

- Node.js 20 or newer
- npm
- Expo Go, an Android emulator, an iOS simulator, or a web browser

Install dependencies and start Expo:

```bash
npm ci
npm start
```

From the Expo terminal, scan the QR code with Expo Go or press `a` for Android, `i` for iOS on macOS, or `w` for web.

The complete flow works without an API endpoint by using the deterministic fallback.

### Optional OpenAI endpoint

Copy `.env.example` to `.env` and set `EXPO_PUBLIC_ERP_API_URL` to an HTTPS endpoint backed by the server-side adapter in `server/erp-recognition.mjs`. Keep `OPENAI_API_KEY` only on the server. Never expose it through an `EXPO_PUBLIC_` variable or commit it.

## Testing and verification

```bash
npm run typecheck
npm run build:web
```

There is currently no unit-test script in `package.json`. The MVP is verified through TypeScript checking, Expo production export, and complete phone-viewport walkthroughs of both the safe path and the Safety Stop path.

## How GPT-5.6 is used

The server-side reference uses `gpt-5.6-sol` through the official OpenAI Responses API. One stateless request generates one concise intervention after the Human Safety Gate. There is no chat history, memory, follow-up conversation, or AI safety assessment.

The model receives only:

- The user-entered situation
- The selected trigger category
- A locally inferred compulsion signal
- A marker confirming that the Human Safety Gate has already allowed the structured intervention to continue

The model returns exactly four fields:

```json
{
  "mechanism": "what is driving the distress",
  "uncertaintyMessage": "a brief uncertainty-acceptance statement",
  "leaveOnePercentAction": "one concrete behavioral action",
  "returnToLifeLabel": "a short exit-button label"
}
```

### Human Safety Gate and validation

The person decides whether immediate real-world action is needed before any API request. GPT-5.6 never determines, confirms, or re-assesses safety and never receives unsafe or unclear cases.

Accepted output must:

- Contain exactly the four required fields
- Stay within strict length limits
- Avoid questions, diagnosis, medical advice, reassurance, safety claims, and unsafe actions
- Give one small, immediate, behaviorally specific Leave 1% action

If the endpoint is missing, times out, refuses, returns malformed JSON, adds fields, reassures, crosses the safety boundary, or otherwise fails validation, the app immediately uses the context-aware deterministic fallback. It does not ask the model to reassess safety and does not enter a retry or reassurance loop.

## Local data

Completed interventions are stored on-device with AsyncStorage. The MVP has no accounts, analytics, community features, or cloud history.

## How I collaborated with Codex

I used Codex as my implementation and verification partner. Codex accelerated implementation, testing, mobile verification, Structured Outputs integration, output validation, deterministic fallback logic, and the preparation of review materials.

I made the key product and design decisions: capability over engagement, the Human Safety Gate, no AI safety authority, no reassurance or retry loop, the four-field intervention, and Return to Life. GPT-5.6 generates only the mechanism, uncertainty message, one concrete action, and return-to-life label after the Human Safety Gate.

Codex helped translate those decisions into a working Expo application and repeatedly verified both product paths. I retained product, safety, and design authority throughout the collaboration.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
