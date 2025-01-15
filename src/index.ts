import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import axios from "axios";

type Rover = {
  name: string;
  landing_date: string;
  launch_date: string;
  status: string;
  max_sol: number;
  max_date_last_comm: string;
};

const typeDefs = `#graphql
  type Rover {
    name: String
    landing_date: String
    launch_date: String
    status: String
    max_sol: Int
    max_date_last_comm: String
  }

  type Query {
    getRovers: [Rover]
    getRover(name: String): Rover
  }
`;

async function getRovers(): Promise<Rover[] | null> {
  const response = await axios.get(
    "https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=DEMO_KEY"
  );

  return response.data.rovers.map((rover: any) => ({
    name: rover.name,
    landing_date: rover.landing_date,
    launch_date: rover.launch_date,
    status: rover.status,
    max_sol: rover.max_sol,
    max_date_last_comm: rover.max_date_last_comm,
  }));
}

async function getRover(
  _: any,
  { name }: { name: string }
): Promise<Rover | null> {
  const response = await axios.get(
    `https://api.nasa.gov/mars-photos/api/v1/rovers/${name.toLowerCase()}?api_key=DEMO_KEY`
  );

  if (response.status !== 200) throw new Error("No such rover found");

  return {
    name: response.data.rover.name,
    landing_date: response.data.rover.landing_date,
    launch_date: response.data.rover.launch_date,
    status: response.data.rover.status,
    max_sol: response.data.rover.max_sol,
    max_date_last_comm: response.data.rover.max_date_last_comm,
  };
}

const resolvers = {
  Query: {
    getRovers,
    getRover,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  const { url } = await startStandaloneServer(server);
  console.log(`🚀 Server ready at ${url}`);
}

startServer();
