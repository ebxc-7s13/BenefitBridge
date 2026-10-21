# Publishing BenefitBridge on Google Play

Everything the store needs is in this repository. The only things that need the owner are the
signing key, the Play developer account (one-time US$25) and clicking through the Play Console.

## 1. Signing key (once)
Create `release.keystore` and add the four repository secrets described in the README
(`ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`).
From then on every release attaches a signed `benefitbridge.aab` (for Play) and `benefitbridge.apk`.
Enrol in **Play App Signing** when uploading the first bundle.

## 2. App details
| Field | Value |
|---|---|
| App name | `fastlane/metadata/android/en-US/title.txt` |
| Short description | `fastlane/metadata/android/en-US/short_description.txt` |
| Full description | `fastlane/metadata/android/en-US/full_description.txt` |
| App icon (512×512) | `fastlane/metadata/android/en-US/images/icon.png` |
| Feature graphic (1024×500) | `fastlane/metadata/android/en-US/images/featureGraphic.png` |
| Phone screenshots | `fastlane/metadata/android/en-US/images/phoneScreenshots/` |
| Category | Tools (or Lifestyle) |
| Privacy policy URL | `https://github.com/ebxc-7s13/BenefitBridge/blob/main/docs/PRIVACY.md` |
| Package name | `io.github.ebxc7s13.benefitbridge` |

Hindi listing text is in `fastlane/metadata/android/hi-IN/`.

## 3. App content declarations
- **Data safety:** "No data collected" and "No data shared". Answers are stored only on the device
  (not "collected" under Play's definition); Android backup is turned off; the only network request
  without a user tap downloads public updates and sends no user data. No account creation.
- **Ads:** No ads.
- **Target audience:** 18 and over (adults applying for benefits); not designed for children.
- **Government apps policy:** the app is **not** a government app. The listing and the app say so
  ("BenefitBridge is not a government website/app"), name no government as publisher, use no
  government emblems, and link every scheme and service to its official source.
- **Financial features:** none (no loans, payments or investments; it links to official portals).
- **Health:** not a medical app; it links to official health schemes.
- **Content rating:** answer the questionnaire — no violence, no user content, no purchases.

## 4. Technical
- `targetSdkVersion` 36, `minSdkVersion` 24 (Android 7+), only the `INTERNET` permission.
- Edge-to-edge is handled: the header and tab bar clear the status bar, gesture bar and cut-outs.
- Version code comes from the release tag (v1.4.0 → 10400).

## 5. Release
Run the **Release** workflow with the next version, download `benefitbridge.aab` from the release,
upload it to a Play testing track, then promote it to production.
