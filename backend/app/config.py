from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    postgres_user: str = "superskill"
    postgres_password: str = "superskill_dev"
    postgres_db: str = "superskill_ia"
    postgres_host: str = "postgres"
    postgres_port: int = 5432

    redis_host: str = "redis"
    redis_port: int = 6379
    redis_queue: str = "eventos_operacionais"
    redis_pubsub_channel: str = "dashboard_broadcast"

    mqtt_enabled: bool = False
    mqtt_host: str = "mqtt"
    mqtt_port: int = 1883
    mqtt_username: str = ""
    mqtt_password: str = ""
    mqtt_topics: str = "weg/braga/ramos/eventos,weg/braga/djalma/eventos"

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg2://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
