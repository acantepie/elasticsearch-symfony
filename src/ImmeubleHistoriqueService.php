<?php

namespace App;

use App\DTO\ImmeubleHistorique;

class ImmeubleHistoriqueService
{
    public const INDEX = 'es.ih';

    public function __construct(
        private readonly ElasticClient $client,
        private readonly Helper $helper
    )
    {
    }

    public function createSchema(): void
    {
        $conn = $this->client->conn();

        $this->client->removeIndexIfExist(self::INDEX);
        $conn->indices()->create([
            'index' => self::INDEX,
        ]);
    }

    public function populate(string $filePath): void
    {
        $this->client->deleteDocumentsWithIndex(self::INDEX);

        $bulkQueries = [];

        $h = fopen($filePath, 'r');

        $i = 0;
        while (($data = fgetcsv($h, null, ';')) !== false) {

            // skip header
            if ($i++ === 0) {
                continue;
            }

            // Create DTO

            $dto = new ImmeubleHistorique();
            $dto->commune = $data[0];
            $dto->codeDepartement = $data[1];
            $dto->dateMaj = $this->helper->toDate($data[2]);
            $dto->insee = $data[3];
            $dto->region = $data[4];
            $dto->departement = $data[5];
            $dto->appellationCourante = $data[6];
            // 7 -> adresse1
            $dto->siecle = $data[8];
            $dto->dateDeProtection = null; // FIXME
            $dto->precisionProtection = $data[10];
            $dto->auteur = $data[11];
            $dto->statut = $data[12];
            $dto->description = $data[13];
            $dto->historique = $data[14];
            $dto->affectaire = $data[15];
            $dto->adresse = $data[16];
            // 17 : commune0
            $dto->precisionLocalisation = $data[18];
            $dto->reference = $data[19];
            $dto->contact = $data[20];

            $coords = explode(',', $data[21]);
            if (count($coords) === 2) {
                $dto->geolocX = $coords[0];
                $dto->geolocY = $coords[1];
            }

            // add to query
            // https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html
            $bulkQueries[] = [
                'index' => [
                    '_index' => self::INDEX,
                    '_id' => $dto->reference
                ]
            ];

            $bulkQueries[] = [
                'ref' => $dto->reference,
                'insee' => $dto->insee,
                'adresse' => $dto->adresse,
                'commune' => $dto->commune,
                'code_departement' => $dto->codeDepartement,
                'region' => $dto->region,
                'nom' => $dto->appellationCourante,
                'description' => $dto->description,
                'historique' => $dto->historique,
                'statut' => $dto->statut,
                'affectaire' => $dto->affectaire,
            ];


            if ($i % 100 === 0) {
                // flush
                $this->client->bulk($bulkQueries);
                $bulkQueries = [];
            }
        }

        // flush
        $this->client->bulk($bulkQueries);
        fclose($h);
    }


    public function search(array $query): array
    {
        $params = [
            'index' => self::INDEX,
            'body' => $query,
        ];

        $response = $this->client->conn()->search($params);
        return json_decode($response->getBody(), true);
    }


}