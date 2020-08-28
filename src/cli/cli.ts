import { generateSignedJWT } from '../generate-signed-jwt/generate-signed-jwt';

export enum CLIArgs {
  serviceAccount = '--service-account',
  targetAudience = '--target-audience'
}

export async function cli(args: string[]): Promise<void> {
  const serviceAccountIndex = args.indexOf(CLIArgs.serviceAccount) + 1;
  const targetAudienceIndex = args.indexOf(CLIArgs.targetAudience) + 1;

  // check serviceAccount is set
  if (serviceAccountIndex === 0) {
    console.error(
      `GCPServiceAccountJWTGenerator: ${CLIArgs.serviceAccount} argument is required.`
    );
    return process.exit();
  }

  // check targetAudience is set
  if (targetAudienceIndex === 0) {
    console.error(
      `GCPServiceAccountJWTGenerator: ${CLIArgs.targetAudience} argument is required.`
    );
    return process.exit();
  }

  const serviceAccountPath = args[serviceAccountIndex];
  const targetAudience = args[targetAudienceIndex];

  const signedJWT = await generateSignedJWT(serviceAccountPath, targetAudience);

  console.info(signedJWT);
}
