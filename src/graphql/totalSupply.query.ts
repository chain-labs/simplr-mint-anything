import { gql } from "@apollo/client";

const TOTAL_SUPPLY_QUERY = gql`
  query TotalSupplyQuery($address: Bytes) {
    collections(where: { address: $address }) {
      address
      totalSupply
    }
  }
`;

export default TOTAL_SUPPLY_QUERY;
