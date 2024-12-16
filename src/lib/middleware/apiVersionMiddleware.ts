import { NextApiRequest, NextApiResponse } from 'next';
import semver from 'semver';

const SUPPORTED_VERSIONS = ['1.0.0', '1.1.0'];
const DEFAULT_VERSION = '1.0.0';

export const apiVersionMiddleware = (handler: any) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const requestedVersion = req.headers['api-version'] as string || DEFAULT_VERSION;

  if (!SUPPORTED_VERSIONS.includes(requestedVersion)) {
    return res.status(400).json({
      error: 'Unsupported API version',
      supportedVersions: SUPPORTED_VERSIONS
    });
  }

  // Add version to request context
  req.apiVersion = requestedVersion;

  // Version-specific handling
  if (semver.gte(requestedVersion, '1.1.0')) {
    // Add new features or modified behavior for v1.1.0
    req.useNewFeatures = true;
  }

  return handler(req, res);
}; 