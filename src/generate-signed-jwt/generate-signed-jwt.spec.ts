import { generateSignedJWT } from './generate-signed-jwt';
import * as jwt from 'jsonwebtoken';
import { promises as fs } from 'fs';

describe('generateSignedJWT', (): void => {
  it('should generate a signed JWT', async (): Promise<void> => {
    const serviceAccountPath = './service-account.json';
    const targetAudience = 'app-id.apps.googleusercontent.com';
    const serviceAccountContents = JSON.stringify({
      client_email: 'test@tomchinery.com',
      private_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      private_key_id: 'eyJhbGci'
    });

    spyOn(fs, 'readFile').and.returnValue(Buffer.from(serviceAccountContents, 'utf8'));
    spyOn(jwt, 'sign').and.returnValue('eyJhbGciOiJ');

    await generateSignedJWT(serviceAccountPath, targetAudience);

    expect(fs.readFile).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalled();
  });

  it('should catch and log `ENOENT` errors with a custom error message', async (): Promise<void> => {
    const serviceAccountPath = './service-account.json';
    const targetAudience = 'app-id.apps.googleusercontent.com';

    fs.readFile = jest.fn(() => { throw { code: 'ENOENT', path: serviceAccountPath } });
    spyOn(console, 'error').and.stub();
    spyOn(process, 'exit').and.stub();

    await generateSignedJWT(serviceAccountPath, targetAudience);

    expect(console.error).toHaveBeenCalledWith(
      `No such file or directory for Service Account at ${serviceAccountPath}`
    );
    expect(process.exit).toHaveBeenCalled();
  });

  it('should catch and log unknown errors', async (): Promise<void> => {
    const serviceAccountPath = './service-account.json';
    const targetAudience = 'app-id.apps.googleusercontent.com';

    spyOn(fs, 'readFile').and.throwError('Test');
    spyOn(console, 'error').and.stub();
    spyOn(process, 'exit').and.stub();

    await generateSignedJWT(serviceAccountPath, targetAudience);

    expect(console.error).toHaveBeenCalledWith(new Error('Test'));
    expect(process.exit).toHaveBeenCalled();
  });
});
