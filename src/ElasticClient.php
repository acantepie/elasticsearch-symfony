<?php

namespace App;

use Elastic\Elasticsearch\Client;
use Elastic\Elasticsearch\ClientBuilder;
use Elastic\Elasticsearch\Exception\ClientResponseException;

class ElasticClient
{
    private ?Client $client = null;

    public function __construct(
        private readonly string $url
    ) {
    }

    public function conn(): Client
    {
        if (null === $this->client) {
            $this->client = ClientBuilder::create()
                ->setHosts([$this->url])
                ->build();
        }

        return $this->client;
    }

    public function ping(): void
    {
        $response = $this->conn()->ping();

        if ($response->getStatusCode() !== 200) {
            throw new ElasticException(sprintf('Unexpected response, code : %d, reaseon : %s', $response->getStatusCode(), $response->getReasonPhrase()));
        }
    }

    public function deleteDocumentsWithIndex(string $name): void
    {
        $this->conn()->deleteByQuery([
            'index' => $name,
            'body' => [
                'query' => [
                    'match_all' => (object) [],
                ]
            ]
        ]);
    }

    public function removeIndexIfExist(string $name): void
    {
        $p = ['index' => $name];
        $conn = $this->conn();

        try {
            $conn->indices()->delete($p);
        } catch (ClientResponseException $e) {
            // 404 => try to delete a non existing index => ignore
            if ($e->getResponse()->getStatusCode() !== 404) {
                throw $e;
            }
        }
    }

    public function bulk(array $queries): void
    {
        if (count($queries) > 0) {
            $this->conn()->bulk(['body' => $queries]);
        }
    }
}
