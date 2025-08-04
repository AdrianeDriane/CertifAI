import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const getFingerprint = async (): Promise<string> => {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  return result.visitorId;
};
