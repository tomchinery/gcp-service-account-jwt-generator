import { cli, CLIArgs } from './cli';
import * as jwtGenerator from '../generate-signed-jwt/generate-signed-jwt';

describe('cli', (): void => {
  it('should error and exit if serviceAccount argument is not set', async (): Promise<void> => {
    const args: string[] = [];

    spyOn(console, 'error').and.stub();
    spyOn(process, 'exit').and.stub();

    await cli(args);

    expect(console.error).toHaveBeenCalledWith(
      `GCPServiceAccountJWTGenerator: ${CLIArgs.serviceAccount} argument is required.`,
    );
    expect(process.exit).toHaveBeenCalled();
  });

  it('should call generateSignedJWT and log its output to console', async (): Promise<void> => {
    const args: string[] = [
      CLIArgs.serviceAccount,
      './service-account.json'
    ];

    spyOn(jwtGenerator, 'generateSignedJWT').and.returnValue('test-jwt')
    spyOn(console, 'info').and.stub();

    await cli(args);

    expect(jwtGenerator.generateSignedJWT).toHaveBeenCalledWith(args[1]);
    expect(console.info).toHaveBeenCalledWith('test-jwt');
  });
});
