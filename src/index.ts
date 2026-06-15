import { BedrockClient } from './client/BedrockClient';
import chalk from 'chalk';

async function main() {
  console.log(chalk.blue('\n=== Minecraft Bedrock Client ===\n'));
  
  const client = new BedrockClient();
  
  // Example: Connect to a server
  // const options = {
  //   host: 'play.example.com',
  //   port: 19132,
  //   username: 'YourUsername'
  // };
  // await client.connect(options);
  
  console.log(chalk.green('Client initialized successfully'));
  console.log(chalk.yellow('Ready to connect to Bedrock servers'));
}

main().catch(err => {
  console.error(chalk.red('Error:'), err);
  process.exit(1);
});
