package models

import (
	"fmt"
	"os"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"github.com/joho/godotenv"
)
  
func SetupModels() *gorm.DB {
	errors := godotenv.Load()
	if errors != nil {
		panic("Error loading .env file")
	}

	pg_user := os.Getenv("POSTGRES_USER")
	pg_password := os.Getenv("POSTGRES_PASSWORD")
	pg_db := os.Getenv("POSTGRES_DB")
	pg_host := os.Getenv("POSTGRES_HOST")
	pg_port := os.Getenv("POSTGRES_PORT")
	pg_sslmode := os.Getenv("POSTGRES_SSLMODE")

	dsn := fmt.Sprintf("host=%v port=%v user=%v dbname=%v password=%v sslmode=%v", pg_host, pg_port, pg_user, pg_db, pg_password, pg_sslmode)

	fmt.Println("dsn is\t\t", dsn)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("Failed to connect to database!")
	}
	
	return db
}
