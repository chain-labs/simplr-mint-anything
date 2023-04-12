import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { ALCHEMY_API_KEY, TEST_NETWORK } from "@/constants";

const { chains, provider } = configureChains(
  [TEST_NETWORK ? polygonMumbai : polygon],
  [alchemyProvider({ apiKey: ALCHEMY_API_KEY })]
);

const { connectors } = getDefaultWallets({
  appName: "Simplr Mint Anything",
  chains,
});

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider,
});

const RainbowKit = ({ children }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
};

export default RainbowKit;
