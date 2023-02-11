export enum Network {
  ETHEREUM = 'ethereum',
  MATIC = 'matic',
  ARBITRUM = 'arbitrum',
  AVALANCHE = 'avalanche',
  OPTIMISM = 'optimism',
}

export type Deployment = {
  readonly contractAddress: string;
  readonly network: Network;
};
