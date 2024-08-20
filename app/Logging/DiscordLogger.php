<?php

namespace App\Logging;

use Monolog\Logger;
use Monolog\LogRecord;
use Monolog\Handler\AbstractProcessingHandler;
use DateTimeZone;

class DiscordLogger extends AbstractProcessingHandler
{
    protected $webhookUrl;
    protected $timezone;

    public function __construct($level = Logger::DEBUG, bool $bubble = true)
    {
        $this->webhookUrl = config('logging.channels.discord.url');
        $this->timezone = new DateTimeZone('Europe/Warsaw'); // Ustawienie strefy czasowej na polską
        parent::__construct($level, $bubble);
    }

    protected function write(LogRecord $record): void
    {
        $content = [
            'content' => $this->formatRecord($record),
        ];

        $this->send($content);
    }

    protected function formatRecord(LogRecord $record): string
    {
        $record->datetime->setTimezone($this->timezone); // Zmiana strefy czasowej na polską
        return sprintf(
            "[%s] %s: %s",
            $record->datetime->format('Y-m-d H:i:s'),
            $record->level->getName(),
            $record->message
        );
    }

    protected function send(array $content): void
    {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $this->webhookUrl);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($content));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

        curl_exec($ch);

        if (curl_errno($ch)) {
            throw new \Exception(curl_error($ch));
        }

        curl_close($ch);
    }

    public function __invoke(array $config)
    {
        $logger = new Logger('discord');
        return $logger->pushHandler(new self($config['level']));
    }
}


