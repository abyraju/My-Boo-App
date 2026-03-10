# My Boo — Phase 1.1 Screens

Auth, pairing, and account screens split into individual component files.

## File Structure

```
src/
├── App.jsx                          # Root router + shared state
│
├── constants/
│   ├── screens.js                   # SCREENS enum (all route keys)
│   └── data.js                      # COUNTRIES list, BOO_ID placeholder
│
├── icons/
│   └── index.jsx                    # All shared SVG icon components
│
├── styles/
│   └── globals.css                  # Design tokens, shared utility classes
│
└── screens/
    ├── SignInScreen.jsx             # Google + email sign-in / method choice
    ├── RegisterScreen.jsx           # Email, phone, country, birthday form
    ├── AvatarUploadScreen.jsx       # Optional profile photo upload
    ├── PairingScreen.jsx            # Show your Boo ID / enter partner's
    ├── PairSuccessScreen.jsx        # Couple space created confirmation
    ├── PairBlockedScreen.jsx        # Already-paired error state
    ├── UnpairScreen.jsx             # 2-step unpair confirmation flow
    └── ProfileSettingsScreen.jsx    # Edit profile + re-upload avatar
```

## Setup

1. Copy the `src/` folder into your project.
2. Import `globals.css` in your entry point (e.g. `main.jsx` or `index.js`):
   ```js
   import './styles/globals.css';
   ```
3. Render `<App />` as your root component.

## Navigation

All screens receive a `navigate(screenKey)` prop. Use the keys from `constants/screens.js`:

```js
import SCREENS from "./constants/screens";
navigate(SCREENS.REGISTER);
```

## Replacing Placeholder Data

| File                        | What to replace                                              |
|-----------------------------|--------------------------------------------------------------|
| `constants/data.js`         | `BOO_ID` — generate a real 9-char alphanumeric ID on sign-up |
| `screens/PairSuccessScreen` | Hardcoded `"Alex & Jordan"` — pull from your auth user object|
| `screens/AvatarUploadScreen`| `URL.createObjectURL` — swap for actual Firebase Storage upload |
| `screens/ProfileSettingsScreen` | `defaultValue` fields — bind to your user state/context  |

## Design Tokens

All colours and spacing live in `globals.css` as CSS variables:

```css
--rose, --rose-lt, --rose-dk   /* Pink accent family  */
--plum, --velvet, --deep       /* Dark background family */
--mint                         /* Success / security green */
--border, --dim, --faint       /* Text and border opacities */
```
