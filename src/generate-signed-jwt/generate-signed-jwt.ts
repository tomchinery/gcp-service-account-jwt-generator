import * as jwt from 'jsonwebtoken';
import { promises as fs } from 'fs';

export async function generateSignedJWT(serviceAccountPath: string): Promise<string> {
  try {
    const serviceAccountBuffer: Buffer = await fs.readFile(serviceAccountPath);
    const serviceAccountObject: any = JSON.parse(serviceAccountBuffer.toString());
    const issuedAt: number = Math.floor(Date.now() / 1000);
    const expiresAt: number = Math.floor(Date.now() / 1000) + 3600;

    const signedJWT = jwt.sign(
      {
        iss: serviceAccountObject.client_email,
        sub: serviceAccountObject.client_email,
        iat: issuedAt,
        exp: expiresAt,
        aud: '740451786387-tisefg92mooistqcg607ag599fof261s.apps.googleusercontent.com',
        // 'https://spinnaker-1.endpoints.ate-dev-services.cloud.goog/'
        //         aud: 'https://oauth2.googleapis.com/token',
      },
      serviceAccountBuffer.toString(),
      {
        algorithm: 'RS256',
        keyid: serviceAccountObject.private_key_id
      }
    );

    const isValid = jwt.verify(signedJWT, serviceAccountObject.private_key, { algorithms: ['RS256'] });

    return signedJWT;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`No such file or directory for Service Account at ${error.path}`);
      return process.exit();
    }

    console.error(error);
    return process.exit();
  }
}
