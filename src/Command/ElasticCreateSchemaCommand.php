<?php

namespace App\Command;

use App\ImmeubleHistoriqueService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand('elastic:schema:create')]
class ElasticCreateSchemaCommand extends Command
{

    public function __construct(private readonly ImmeubleHistoriqueService $service)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $this->service->createSchema();
        $io->success('OK');

        return self::SUCCESS;
    }

}