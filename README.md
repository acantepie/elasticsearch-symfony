## About
This is a demo project using elasticsearch with Symfony

- Symfony : 6.2
- elasticsearch : 8.6.1
- data used : https://www.data.gouv.fr/fr/datasets/monuments-historiques-liste-des-immeubles-proteges-au-titre-des-monuments-historiques/

## Installation

```bash
# Clone the project
git clone git@github.com:acantepie/elasticsearch-symfony.git

# Move on project dir
cd elasticsearch-symfony

# Start docker
docker-compose up

# Open docker console
docker-compose exec symfony zsh

# Install dependencies
~docker> composer install
~docker> yarn install
~docker> yarn build

# Create elastic schema
~docker> bin/console elastic:schema:create

# Populate data
~docker> bin/console elastic:populate
```

## Docker

- Wep app : http://127.0.0.1:8000 
- Elasticsearch : http://127.0.0.1:9200
- Kibana : http://127.0.0.1:5601