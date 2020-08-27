import { generateSignedJWT } from '../generate-signed-jwt/generate-signed-jwt';

export enum CLIArgs {
  serviceAccount = '--service-account'
}

export async function cli(args: string[]): Promise<void> {
  const serviceAccountIndex = args.indexOf(CLIArgs.serviceAccount) + 1;

  // check serviceAccount is set
  if (serviceAccountIndex === 0) {
    console.error(
      `GCPServiceAccountJWTGenerator: ${CLIArgs.serviceAccount} argument is required.`
    );
    return process.exit();
  }

  const serviceAccountPath = args[serviceAccountIndex];

  const signedJWT = await generateSignedJWT(serviceAccountPath);

  console.info(signedJWT);
}
