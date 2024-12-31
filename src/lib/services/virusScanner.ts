import { ClamScan } from 'clamscan';

const clamscan = new ClamScan({
  removeInfected: false,
  quarantineInfected: false,
  scanLog: null,
  debugMode: false,
  fileList: null,
  scanRecursively: true,
  clamscan: {
    path: '/usr/bin/clamscan',
    db: null,
    scanArchives: true,
    active: true
  },
  preference: 'clamscan'
});

export const scanFile = async (buffer: Buffer): Promise<{ clean: boolean }> => {
  try {
    const {isInfected} = await clamscan.scanBuffer(buffer);
    return { clean: !isInfected };
  } catch (error) {
    console.error('Virus scan error:', error);
    throw new Error('Virus scan failed');
  }
}; 