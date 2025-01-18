import NodeClam from 'clamscan';

export class VirusScanService {
  private static clamscan = new NodeClam({
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

  static async scanBuffer(buffer: Buffer): Promise<boolean> {
    if (process.env.NODE_ENV === 'test') {
      return true; // Mock response for tests
    }

    try {
      const { isInfected } = await this.clamscan.scanBuffer(buffer);
      return !isInfected;
    } catch (error) {
      console.error('Virus scan error:', error);
      throw new Error('File failed virus scan');
    }
  }
} 