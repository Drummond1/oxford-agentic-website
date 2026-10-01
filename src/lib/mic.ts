/**
 * Microphone help for the voice pages (/office-hours/, /find-your-bootcamp/).
 *
 * Browsers only show their own permission prompt once; after a "Block" (or in
 * an in-app browser that has no mic access at all) the visitor is stuck unless
 * we tell them exactly where the switch is on their device. This works out the
 * device, browser and failure, and returns plain instructions for it.
 */

export type MicProblem = 'denied' | 'none' | 'busy' | 'inapp' | 'unsupported';

export interface MicEnv {
  platform: 'ios' | 'android' | 'desktop';
  browser: 'safari' | 'chrome' | 'firefox' | 'edge' | 'samsung' | 'other';
  /** Name of the app whose built-in browser this is (LinkedIn, Instagram...), or ''. */
  inApp: string;
}

export function detectMicEnv(): MicEnv {
  const ua = navigator.userAgent;
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const android = /Android/i.test(ua);

  const apps: [RegExp, string][] = [
    [/LinkedInApp/i, 'LinkedIn'],
    [/FBAN|FBAV|FB_IAB/i, 'Facebook'],
    [/Instagram/i, 'Instagram'],
    [/Twitter/i, 'X'],
    [/\bGSA\//, 'the Google app'],
    [/\bLine\//, 'LINE'],
    [/WhatsApp/i, 'WhatsApp'],
  ];
  let inApp = apps.find(([re]) => re.test(ua))?.[1] ?? '';
  if (!inApp && android && /; wv\)/.test(ua)) inApp = 'this app';

  const browser: MicEnv['browser'] = /Edg(e|A|iOS)?\//.test(ua)
    ? 'edge'
    : /SamsungBrowser/.test(ua)
      ? 'samsung'
      : /Firefox|FxiOS/.test(ua)
        ? 'firefox'
        : /Chrome|CriOS/.test(ua)
          ? 'chrome'
          : /Safari/.test(ua)
            ? 'safari'
            : 'other';

  return { platform: ios ? 'ios' : android ? 'android' : 'desktop', browser, inApp };
}

/** Turn a getUserMedia failure into the problem the visitor can act on. */
export function micProblemFrom(error: unknown, env: MicEnv): MicProblem {
  const name = (error as { name?: string } | null)?.name ?? '';
  if (/NotFound|DevicesNotFound|Overconstrained/.test(name)) return 'none';
  if (/NotReadable|TrackStart|Abort/.test(name)) return 'busy';
  return env.inApp ? 'inapp' : 'denied';
}

export function micHelpCopy(problem: MicProblem, env: MicEnv): { title: string; steps: string } {
  const browserName = env.platform === 'ios' ? 'Safari' : 'Chrome';
  switch (problem) {
    case 'inapp':
      return {
        title: `${env.inApp === 'this app' ? 'This app' : env.inApp}'s browser can't use your mic`,
        steps:
          env.platform === 'ios'
            ? `Tap ••• or the share icon and choose Open in ${browserName}, or copy the link and paste it into ${browserName}. Or just type your question.`
            : `Tap ⋮ and choose Open in ${browserName} (or Open in browser), or copy the link and paste it there. Or just type your question.`,
      };
    case 'none':
      return {
        title: 'No microphone found',
        steps: 'Connect or switch on a microphone and try again - or type your question instead.',
      };
    case 'busy':
      return {
        title: 'Your microphone is busy',
        steps: 'Another app or call may be using it. Close that, then try again.',
      };
    case 'unsupported':
      return {
        title: "This browser can't use a microphone here",
        steps: 'Open the page in Safari, Chrome or Edge - or type your question instead.',
      };
    case 'denied':
    default:
      return { title: 'Microphone blocked', steps: deniedSteps(env) };
  }
}

function deniedSteps({ platform, browser }: MicEnv): string {
  if (platform === 'ios') {
    if (browser === 'safari')
      return 'Tap aA in the address bar, then Website Settings, and set Microphone to Allow. Then tap Try again.';
    return `Open the Settings app, find ${browser === 'chrome' ? 'Chrome' : 'this browser'}, turn on Microphone, then come back and tap Try again.`;
  }
  if (platform === 'android')
    return 'Tap the icon to the left of the web address, open Permissions, and allow Microphone. Then tap Try again.';
  if (browser === 'safari')
    return 'In the Safari menu choose Settings for this website and set Microphone to Allow. Then try again.';
  if (browser === 'firefox')
    return 'Click the crossed-out microphone in the address bar and remove the block. Then try again.';
  return "Click the icon to the left of the web address and set Microphone to Allow. Then try again. If it's still blocked, check your computer's privacy settings.";
}

/** Short line shown just before the browser's own permission prompt. */
export function micAskLine(env: MicEnv): string {
  return env.platform === 'desktop' ? 'Click "Allow" when your browser asks for the mic' : 'Tap "Allow" when asked for the mic';
}
