import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache, split } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { environment } from '../environments/environment';

const uri = environment.endpoint; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const http = httpLink.create({
    uri: uri,
    useMultipart: true,
  });

  // Create a WebSocket link:
  const ws = new WebSocketLink({
    uri: environment.websocket,
    options: {
      reconnect: true,
    },
  });

  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  const link = split(
    // split based on operation type
    ({ query }) => {
      // @ts-ignore
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    ws,
    http
  );

  return {
    link: link,
    cache: new InMemoryCache(),
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
