<?php

namespace App\Command;

use App\ElasticClient;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand('elastic:ping')]
class ElasticPingCommand extends Command
{

    public function __construct(private readonly ElasticClient $client)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $this->client->ping();
        $io->success('OK');

        return self::SUCCESS;
    }

}