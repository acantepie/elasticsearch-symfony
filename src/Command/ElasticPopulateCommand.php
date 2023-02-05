<?php

namespace App\Command;

use App\ImmeubleHistoriqueService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand('elastic:populate')]
class ElasticPopulateCommand extends Command
{

    public function __construct(
        private readonly ImmeubleHistoriqueService $service,
        private readonly string $resourcesDir
    )
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->service->populate(sprintf('%s/immeuble-histo-2022.csv', $this->resourcesDir));
        return self::SUCCESS;
    }

}