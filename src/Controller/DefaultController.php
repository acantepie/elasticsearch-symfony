<?php

namespace App\Controller;

use App\ImmeubleHistoriqueService;
use Elastic\Elasticsearch\Exception\ClientResponseException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/')]
class DefaultController extends AbstractController
{

    #[Route]
    public function index()
    {
        $defaultQuery = [
            'query' => [
                'multi_match'  => [
                    'query' => 'Rennes'
                ]
            ]
        ];

        return $this->render('default/index.html.twig', [
            'default_query' => $defaultQuery
        ]);
    }

    #[Route('/search')]
    public function search(ImmeubleHistoriqueService $service, Request $request)
    {
        $content = $request->getContent();

        // Read JSON query
        try {
            $query = \json_decode($content, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException $e) {
            return $this->jsonError('JSON query is invalid', $e->getMessage());
        }

        // So search
        try {
            $result = $service->search($query);
        } catch (ClientResponseException $e) {
            return $this->jsonError('Elasticsearch return an error', $e->getMessage());
        }

        return $this->json($result);
    }

    private function jsonError(string $error, string $description, int $status = Response::HTTP_BAD_REQUEST): JsonResponse
    {
        return new JsonResponse(['error' => $error, 'description' => $description], $status);
    }

}